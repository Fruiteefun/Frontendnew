import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { ArrowRight, ArrowLeft } from "lucide-react";

const BusinessPreferencesPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    campaignGoals: [],
    targetAudience: "",
    preferredPlatforms: [],
    budgetRange: [5000],
    campaignFrequency: "",
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

  const platformOptions = [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" },
    { id: "twitter", label: "Twitter/X" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "Facebook" },
  ];

  const contentTypeOptions = [
    { id: "posts", label: "Static Posts" },
    { id: "reels", label: "Reels/Shorts" },
    { id: "stories", label: "Stories" },
    { id: "live", label: "Live Streams" },
    { id: "reviews", label: "Product Reviews" },
    { id: "tutorials", label: "Tutorials" },
  ];

  const handleCheckboxChange = (field, value, checked) => {
    if (checked) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
    } else {
      setFormData({
        ...formData,
        [field]: formData[field].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/brands");
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
              {campaignGoalOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.campaignGoals.includes(option.id)
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-100 hover:border-orange-200"
                  }`}
                  onClick={() =>
                    handleCheckboxChange(
                      "campaignGoals",
                      option.id,
                      !formData.campaignGoals.includes(option.id)
                    )
                  }
                >
                  <Checkbox
                    checked={formData.campaignGoals.includes(option.id)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Target Audience</h2>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Primary Age Group</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetAudience: value })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white/50" data-testid="target-audience-select">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="13-17">Gen Z (13-17)</SelectItem>
                  <SelectItem value="18-24">Gen Z (18-24)</SelectItem>
                  <SelectItem value="25-34">Millennials (25-34)</SelectItem>
                  <SelectItem value="35-44">Millennials (35-44)</SelectItem>
                  <SelectItem value="45-54">Gen X (45-54)</SelectItem>
                  <SelectItem value="55+">Baby Boomers (55+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferred Platforms */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Preferred Platforms</h2>
            <p className="text-sm text-muted-foreground">
              Select the platforms where you want to run campaigns
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {platformOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.preferredPlatforms.includes(option.id)
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-100 hover:border-pink-200"
                  }`}
                  onClick={() =>
                    handleCheckboxChange(
                      "preferredPlatforms",
                      option.id,
                      !formData.preferredPlatforms.includes(option.id)
                    )
                  }
                >
                  <Checkbox
                    checked={formData.preferredPlatforms.includes(option.id)}
                    className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Monthly Budget</h2>

            <div className="space-y-6">
              <div className="text-center">
                <span className="text-4xl font-outfit font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  ${formData.budgetRange[0].toLocaleString()}
                </span>
                <span className="text-muted-foreground ml-2">/ month</span>
              </div>

              <Slider
                value={formData.budgetRange}
                onValueChange={(value) =>
                  setFormData({ ...formData, budgetRange: value })
                }
                max={50000}
                min={500}
                step={500}
                className="py-4"
                data-testid="budget-slider"
              />

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$500</span>
                <span>$50,000+</span>
              </div>
            </div>
          </div>

          {/* Content Types */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Content Types</h2>
            <p className="text-sm text-muted-foreground">
              What type of content do you want influencers to create?
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {contentTypeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.contentTypes.includes(option.id)
                      ? "border-teal-400 bg-teal-50"
                      : "border-gray-100 hover:border-teal-200"
                  }`}
                  onClick={() =>
                    handleCheckboxChange(
                      "contentTypes",
                      option.id,
                      !formData.contentTypes.includes(option.id)
                    )
                  }
                >
                  <Checkbox
                    checked={formData.contentTypes.includes(option.id)}
                    className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Frequency */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Campaign Frequency</h2>

            <div className="space-y-2">
              <Label htmlFor="frequency">How often do you plan to run campaigns?</Label>
              <Select
                value={formData.campaignFrequency}
                onValueChange={(value) =>
                  setFormData({ ...formData, campaignFrequency: value })
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white/50" data-testid="frequency-select">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="adhoc">Ad-hoc / One-time</SelectItem>
                </SelectContent>
              </Select>
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
              Save & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BusinessPreferencesPage;
