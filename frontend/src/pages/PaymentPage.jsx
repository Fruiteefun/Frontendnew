import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Check, ArrowRight, CreditCard, Lock, Sparkles } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      features: [
        "5 Campaigns",
        "Basic Analytics",
        "3 Social Platforms",
        "Email Support",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 79,
      features: [
        "Unlimited Campaigns",
        "Advanced Analytics",
        "All Platforms",
        "Priority Support",
        "AI Content",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      features: [
        "Everything in Pro",
        "Custom Integrations",
        "Dedicated Manager",
        "White-label",
        "API Access",
      ],
      popular: false,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/content-plan");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-5xl mx-auto" data-testid="payment-page">
        <div className="text-center mb-12">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Start creating amazing campaigns today
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

                <div className="text-center mb-6">
                  <h3 className="font-outfit text-xl font-semibold mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-outfit font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-teal-500" : "bg-muted"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            isSelected ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  className={`w-full h-12 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {isSelected ? "Selected" : "Get Started"}
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
              data-testid="pay-continue-btn"
            >
              Pay & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
