import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Check, ArrowRight, ArrowLeft, CreditCard, Lock, Loader2 } from "lucide-react";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const InfluencerPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | "checking" | "paid" | "failed"

  const basePrice = 2.99;
  const vat = 0.60;
  const total = 3.59;

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
      const res = await fetch(`${API_BASE}/api/stripe/checkout/influencer-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin_url: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Payment success view
  if (paymentStatus === "paid") {
    return (
      <Layout userType="influencer">
        <div className="p-8 max-w-lg mx-auto" data-testid="influencer-payment-page">
          <div className="bg-white rounded-3xl shadow-soft p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-teal-600" />
            </div>
            <h1 className="font-outfit text-3xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your subscription is now active. You can now create your digital twin.
            </p>
            <Button
              onClick={() => navigate("/create-digital-twin")}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20"
              data-testid="continue-to-clone-btn"
            >
              Continue to Create Twin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Checking payment view
  if (paymentStatus === "checking") {
    return (
      <Layout userType="influencer">
        <div className="p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-4" data-testid="influencer-payment-page">
          <Loader2 className="w-10 h-10 animate-spin text-orange-400" />
          <p className="text-lg text-muted-foreground">Verifying your payment...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-2xl mx-auto" data-testid="influencer-payment-page">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Subscribe to Fruitee
          </h1>
          <p className="text-muted-foreground">
            Get access to your digital twin and campaign features
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto mb-8 border-2 border-orange-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-outfit text-xl font-semibold">Creator Plan</h2>
              <p className="text-sm text-muted-foreground">Monthly subscription</p>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Digital Twin Creation",
              "Unlimited Campaigns",
              "Advanced Analytics",
              "Priority Support",
              "Voice Cloning",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-teal-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Price Breakdown */}
          <div className="border-t border-gray-100 pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subscription</span>
              <span>£{basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (20%)</span>
              <span>£{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>£{total.toFixed(2)}/mo</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <div className="max-w-md mx-auto space-y-4">
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
                Pay £{total.toFixed(2)} with Stripe
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

          <div className="flex justify-start pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 rounded-xl border-gray-200 hover:bg-muted"
              onClick={() => navigate("/influencer-preferences")}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InfluencerPaymentPage;
