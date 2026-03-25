from fastapi import FastAPI, APIRouter, Request, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import httpx
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# External API backend URL
EXTERNAL_API_URL = os.environ.get('EXTERNAL_API_URL', 'http://18.135.75.87:8000')

# Stripe
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

# ====== STRIPE PAYMENT ENDPOINTS ======

# Fixed pricing (server-side only — never trust frontend amounts)
INFLUENCER_SUBSCRIPTION_PRICE = 2.99  # GBP
VAT_RATE = 0.20  # 20% UK VAT
CAMPAIGN_PRICES = {
    "1_week": 49.99,
    "1_month": 149.99,
    "3_months": 349.99,
}


class InfluencerCheckoutRequest(BaseModel):
    origin_url: str


class CampaignCheckoutRequest(BaseModel):
    origin_url: str
    campaign_id: str
    duration: str  # "1_week", "1_month", "3_months"
    influencer_id: Optional[str] = None


class CheckoutStatusRequest(BaseModel):
    session_id: str


@app.post("/api/stripe/checkout/influencer-subscription")
async def create_influencer_checkout(req: InfluencerCheckoutRequest, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    base_price = INFLUENCER_SUBSCRIPTION_PRICE
    vat = round(base_price * VAT_RATE, 2)
    total = round(base_price + vat, 2)

    success_url = f"{req.origin_url}/influencer-payment?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{req.origin_url}/influencer-payment"

    checkout_req = CheckoutSessionRequest(
        amount=total,
        currency="gbp",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "type": "influencer_subscription",
            "base_price": str(base_price),
            "vat": str(vat),
            "total": str(total),
        },
    )

    session = await stripe_checkout.create_checkout_session(checkout_req)

    # Save transaction record
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "type": "influencer_subscription",
        "amount": total,
        "currency": "gbp",
        "base_price": base_price,
        "vat": vat,
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"url": session.url, "session_id": session.session_id}


@app.post("/api/stripe/checkout/campaign")
async def create_campaign_checkout(req: CampaignCheckoutRequest, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    if req.duration not in CAMPAIGN_PRICES:
        raise HTTPException(400, f"Invalid duration. Choose from: {list(CAMPAIGN_PRICES.keys())}")

    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    base_price = CAMPAIGN_PRICES[req.duration]
    vat = round(base_price * VAT_RATE, 2)
    total = round(base_price + vat, 2)

    success_url = f"{req.origin_url}/payment?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{req.origin_url}/payment"

    checkout_req = CheckoutSessionRequest(
        amount=total,
        currency="gbp",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "type": "campaign_payment",
            "campaign_id": req.campaign_id,
            "duration": req.duration,
            "base_price": str(base_price),
            "vat": str(vat),
            "total": str(total),
            "influencer_id": req.influencer_id or "",
        },
    )

    session = await stripe_checkout.create_checkout_session(checkout_req)

    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "type": "campaign_payment",
        "campaign_id": req.campaign_id,
        "duration": req.duration,
        "amount": total,
        "currency": "gbp",
        "base_price": base_price,
        "vat": vat,
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"url": session.url, "session_id": session.session_id}


@app.get("/api/stripe/checkout-status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    status = await stripe_checkout.get_checkout_status(session_id)

    # Update transaction in DB (only once for 'paid')
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if txn and txn.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": status.payment_status,
                "status": status.status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )

    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "metadata": status.metadata,
    }


@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        event = await stripe_checkout.handle_webhook(body, sig)
        if event.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {
                    "payment_status": "paid",
                    "event_type": event.event_type,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }},
            )
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "detail": str(e)}


# ====== CAMPAIGN PRICING ENDPOINT ======
@app.get("/api/stripe/campaign-prices")
async def get_campaign_prices():
    prices = {}
    for duration, base in CAMPAIGN_PRICES.items():
        vat = round(base * VAT_RATE, 2)
        prices[duration] = {
            "base_price": base,
            "vat": vat,
            "total": round(base + vat, 2),
            "label": duration.replace("_", " ").title(),
        }
    return {"currency": "GBP", "vat_rate": VAT_RATE, "prices": prices}

# ====== Reverse Proxy to External Backend ======
# Forwards /api/v1/* to the external API to avoid mixed-content (HTTP from HTTPS)
@app.api_route("/api/v1/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_to_external_api(request: Request, path: str):
    target_url = f"{EXTERNAL_API_URL}/api/v1/{path}"
    
    # Preserve query params
    if request.url.query:
        target_url += f"?{request.url.query}"
    
    # Forward headers (except host)
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("Host", None)
    
    body = await request.body()
    
    async with httpx.AsyncClient(timeout=60.0) as http_client:
        resp = await http_client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
        )
    
    # Build response, exclude hop-by-hop headers
    excluded = {"transfer-encoding", "connection", "keep-alive"}
    resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in excluded}
    
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=resp_headers,
        media_type=resp.headers.get("content-type"),
    )

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()