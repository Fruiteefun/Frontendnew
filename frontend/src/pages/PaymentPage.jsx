import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Check, ArrowRight, ArrowLeft, Lock, Calendar, Loader2 } from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [selectedDuration, setSelectedDuration] = useState("1_month");
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const campaignId = localStorage.getItem("fruitee_activeCampaignId") || "";

  // Fetch campaign prices from backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stripe/campaign-prices`);
        const data = await res.json();
        setPrices(data.prices);
      } catch {
        // Fallback prices
        setPrices({
          "1_week": { base_price: 49.99, vat: 10.00, total: 59.99, label: "1 Week" },
          "1_month": { base_price: 149.99, vat: 30.00, total: 179.99, label: "1 Month" },
          "3_months": { base_price: 349.99, vat: 70.00, total: 419.99, label: "3 Months" },
        });
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPrices();
  }, []);

  // Poll payment status on return from Stripe
  useEffect(() => {
    if (!sessionId) return;
    setPaymentStatus("checking");
    let attempts = 0;
    const maxAttempts = 8;
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stripe/checkout-status/${sessionId}`);
        const data = await res.json();
        if (data.payment_status === "paid") {
          setPaymentStatus("paid");
          return;
        }
        if (data.status === "expired") {
          setPaymentStatus("failed");
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setPaymentStatus("failed");
        }
      } catch {
        setPaymentStatus("failed");
      }
    };
    poll();
  }, [sessionId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/stripe/checkout/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin_url: window.location.origin,
          campaign_id: campaignId,
          duration: selectedDuration,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Payment success view
  if (paymentStatus === "paid") {
    return (
      <Layout userType="business">
        <div className="p-8 max-w-lg mx-auto" data-testid="payment-page">
          <div className="bg-white rounded-3xl shadow-soft p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-teal-600" />
            </div>
            <h1 className="font-outfit text-3xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your campaign is now active. Let's set up your content plan.
            </p>
            <Button
              onClick={() => navigate("/content-plan")}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20"
              data-testid="continue-btn"
            >
              Continue to Content Plan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentStatus === "checking") {
    return (
      <Layout userType="business">
        <div className="p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-4" data-testid="payment-page">
          <Loader2 className="w-10 h-10 animate-spin text-orange-400" />
          <p className="text-lg text-muted-foreground">Verifying your payment...</p>
        </div>
      </Layout>
    );
  }

  const selected = prices?.[selectedDuration];

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="payment-page">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Campaign Payment
          </h1>
          <p className="text-muted-foreground">
            Choose your campaign duration and complete payment
          </p>
        </div>

        {loadingPrices ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
          <>
            {/* Duration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {prices && Object.entries(prices).map(([key, p]) => {
                const isSelected = selectedDuration === key;
                const isBestValue = key === "3_months";
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDuration(key)}
                    className={`relative bg-white rounded-3xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? "border-orange-400 shadow-floating"
                        : "border-transparent shadow-soft hover:shadow-md"
                    }`}
                    data-testid={`duration-${key}`}
                  >
                    {isBestValue && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-xs font-medium rounded-full">
                        Best Value
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      <h3 className="font-outfit text-lg font-semibold">{p.label}</h3>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-outfit font-bold">£{p.base_price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">+ £{p.vat.toFixed(2)} VAT</p>
                    <p className="text-sm font-semibold mt-2">Total: £{p.total.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            {/* Price Summary + Pay */}
            {selected && (
              <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto space-y-6">
                <h2 className="font-outfit text-xl font-semibold">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Campaign ({selected.label})</span>
                    <span>£{selected.base_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (20%)</span>
                    <span>£{selected.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>£{selected.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300"
                  data-testid="pay-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay £{selected.total.toFixed(2)} with Stripe
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe. Your card details are never stored on our servers.
                </p>

                {paymentStatus === "failed" && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center" data-testid="payment-error">
                    Payment could not be verified. Please try again.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex justify-start mt-8">
          <Button
            type="button"
            variant="outline"
            className="h-12 px-6 rounded-xl border-gray-200 hover:bg-muted"
            onClick={() => navigate(-1)}
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
