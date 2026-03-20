import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";

const BusinessPreferencesPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    campaignGoals: [],
    targetAudiences: [],
    contentTypes: [],
  });

  const campaignGoalOptions = [
    { id: "brand-awareness", label: "Brand Awareness" },
    { id: "lead-generation", label: "Lead Generation" },
    { id: "sales-conversion", label: "Sales & Conversion" },
    { id: "community-building", label: "Community Building" },
    { id: "product-launch", label: "Product Launch" },
    { id: "event-promotion", label: "Event Promotion" },
  ];

  const targetAudienceOptions = [
    { id: "13-17", label: "Gen Z (13-17)" },
    { id: "18-24", label: "Gen Z (18-24)" },
    { id: "25-34", label: "Millennials (25-34)" },
    { id: "35-44", label: "Millennials (35-44)" },
    { id: "45-54", label: "Gen X (45-54)" },
    { id: "55+", label: "Baby Boomers (55+)" },
  ];

  const contentTypeOptions = [
    { id: "posts", label: "Static Posts" },
    { id: "reels", label: "Reels/Shorts" },
    { id: "stories", label: "Stories" },
    { id: "live", label: "Live Streams" },
    { id: "reviews", label: "Product Reviews" },
    { id: "tutorials", label: "Tutorials" },
  ];

  const toggleSelection = (field, value) => {
    const currentValues = formData[field];
    if (currentValues.includes(value)) {
      setFormData({ ...formData, [field]: currentValues.filter((item) => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...currentValues, value] });
    }
  };

  const removeSelection = (field, value) => {
    setFormData({ ...formData, [field]: formData[field].filter((item) => item !== value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/brands");
  };

  // Custom checkbox indicator component
  const CheckboxIndicator = ({ checked, color = "orange" }) => {
    const colorClasses = {
      orange: checked ? "bg-orange-500 border-orange-500" : "border-gray-300",
      pink: checked ? "bg-pink-500 border-pink-500" : "border-gray-300",
      teal: checked ? "bg-teal-500 border-teal-500" : "border-gray-300",
    };
    
    return (
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${colorClasses[color]}`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    );
  };

  // Get label for an option by id
  const getLabel = (options, id) => {
    const option = options.find(opt => opt.id === id);
    return option ? option.label : id;
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="business-preferences-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Campaign Preferences
          </h1>
          <p className="text-muted-foreground">
            Help us understand your marketing goals to find the perfect influencers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Goals */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Campaign Goals</h2>
            <p className="text-sm text-muted-foreground">
              Select all that apply
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {campaignGoalOptions.map((option) => {
                const isSelected = formData.campaignGoals.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-100 hover:border-orange-200"
                    }`}
                    onClick={() => toggleSelection("campaignGoals", option.id)}
                    data-testid={`campaign-goal-${option.id}`}
                  >
                    <CheckboxIndicator checked={isSelected} color="orange" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Audiences - Multi-select with chips */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Target Audiences</h2>
            <p className="text-sm text-muted-foreground">
              Select all age groups you want to target
            </p>

            {/* Selected Chips */}
            {formData.targetAudiences.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.targetAudiences.map((audienceId) => (
                  <div
                    key={audienceId}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {getLabel(targetAudienceOptions, audienceId)}
                    <button
                      type="button"
                      onClick={() => removeSelection("targetAudiences", audienceId)}
                      className="w-4 h-4 rounded-full bg-pink-200 hover:bg-pink-300 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {targetAudienceOptions.map((option) => {
                const isSelected = formData.targetAudiences.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-100 hover:border-pink-200"
                    }`}
                    onClick={() => toggleSelection("targetAudiences", option.id)}
                    data-testid={`target-audience-${option.id}`}
                  >
                    <CheckboxIndicator checked={isSelected} color="pink" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Types */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Content Types</h2>
            <p className="text-sm text-muted-foreground">
              What type of content do you want influencers to create?
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {contentTypeOptions.map((option) => {
                const isSelected = formData.contentTypes.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-teal-400 bg-teal-50"
                        : "border-gray-100 hover:border-teal-200"
                    }`}
                    onClick={() => toggleSelection("contentTypes", option.id)}
                    data-testid={`content-type-${option.id}`}
                  >
                    <CheckboxIndicator checked={isSelected} color="teal" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/profile")}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BusinessPreferencesPage;
