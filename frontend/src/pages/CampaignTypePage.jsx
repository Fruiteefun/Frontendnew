import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Megaphone, Rocket, CalendarDays, Tag, ArrowRight, ArrowLeft, Check } from "lucide-react";

const CampaignTypePage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const campaignTypes = [
    {
      id: "brand-awareness",
      icon: Megaphone,
      title: "Raising Brand Awareness",
      description:
        "Increase visibility, reach new audiences, and build recognition for your brand",
      color: "from-orange-400 to-orange-500",
    },
    {
      id: "product-launch",
      icon: Rocket,
      title: "Launching New Product(s) or Service(s)",
      description:
        "Generate buzz and drive interest around a new product or service launch",
      color: "from-pink-400 to-pink-500",
    },
    {
      id: "event-promo",
      icon: CalendarDays,
      title: "Advertising an Event",
      description:
        "Promote an upcoming event to maximise attendance and engagement",
      color: "from-teal-400 to-teal-500",
    },
    {
      id: "promotion",
      icon: Tag,
      title: "Launching a Promotion",
      description:
        "Drive sales and conversions with a limited-time offer or discount campaign",
      color: "from-purple-400 to-purple-500",
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      navigate("/business-plan");
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="campaign-type-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Select Campaign Type
          </h1>
          <p className="text-muted-foreground">
            Choose the objective that best fits your campaign
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {campaignTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`bg-white rounded-3xl p-6 shadow-soft cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-orange-400 shadow-floating"
                    : "border-transparent hover:border-orange-200 hover:shadow-md"
                }`}
                data-testid={`campaign-type-${type.id}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-outfit text-lg font-semibold text-foreground">
                        {type.title}
                      </h3>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            onClick={() => navigate("/brand-setup")}
            data-testid="back-btn"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-50"
            data-testid="continue-btn"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignTypePage;
