import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Check, ArrowRight, ArrowLeft, CreditCard, Lock, Sparkles, CreditCard as CardIcon } from "lucide-react";

const InfluencerPaymentPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("creator");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 9,
      color: "from-orange-400 to-orange-500",
      features: [
        "Digital Twin Creation",
        "1 Campaign/month",
        "Basic Analytics",
        "Email Support",
      ],
      popular: false,
    },
    {
      id: "creator",
      name: "Creator",
      price: 29,
      color: "from-orange-400 to-pink-500",
      features: [
        "Digital Twin Creation",
        "Unlimited Campaigns",
        "Advanced Analytics",
        "Priority Support",
        "Voice Cloning",
      ],
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 79,
      color: "from-teal-400 to-teal-500",
      features: [
        "Everything in Creator",
        "Custom Branding",
        "Dedicated Manager",
        "Revenue Sharing",
        "API Access",
      ],
      popular: false,
    },
  ];

  const handlePayment = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-5xl mx-auto" data-testid="influencer-payment-page">
        <div className="text-center mb-12">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Subscribe to start creating your digital twin
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-orange-400 shadow-floating"
                    : "border-transparent shadow-soft hover:shadow-md"
                }`}
                data-testid={`plan-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <CardIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-outfit text-xl font-semibold mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-outfit font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  className={`w-full h-12 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-400 to-purple-500 text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {isSelected ? "Selected" : "Select Plan"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-teal-500" />
            <h2 className="font-outfit text-xl font-semibold">Secure Payment</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  data-testid="card-number-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  data-testid="expiry-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={cardDetails.cvc}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvc: e.target.value })
                  }
                  data-testid="cvc-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="pay-btn"
            >
              Pay & Subscribe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>

        {/* Back button */}
        <div className="flex justify-start mt-8">
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

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-floating p-8 w-full max-w-md text-center space-y-6" data-testid="payment-success-modal">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="font-outfit text-2xl font-bold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your subscription is now active. You can now create your digital twin.
            </p>
            <Button
              onClick={() => {
                const progress = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
                progress.payment = true;
                localStorage.setItem("fruitee_influencer_progress", JSON.stringify(progress));
                navigate("/create-digital-twin");
              }}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20"
              data-testid="continue-to-clone-btn"
            >
              Continue to Create Twin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InfluencerPaymentPage;
