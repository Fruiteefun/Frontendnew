import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Megaphone, CalendarDays, Save } from "lucide-react";
import { isNotEmpty } from "../lib/validation";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const CampaignPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    campaignName: "",
    startDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = {};
    if (!isNotEmpty(formData.campaignName)) e2.campaignName = "Campaign name is required";
    if (!isNotEmpty(formData.startDate)) e2.startDate = "Start date is required";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    navigate("/campaign-type");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="campaign-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Create Your Campaign
          </h1>
          <p className="text-muted-foreground">
            Set up your campaign details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            {/* 1. Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaignName" className="flex items-center gap-2 text-base font-semibold">
                <Megaphone className="w-4 h-4 text-orange-500" />
                1. Campaign Name
              </Label>
              <Input
                id="campaignName"
                placeholder="Enter campaign name"
                className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.campaignName ? "border-red-400" : ""}`}
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                data-testid="campaign-name-input"
              />
              <FieldError message={errors.campaignName} />
            </div>

            {/* 2. Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="w-4 h-4 text-orange-500" />
                2. Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.startDate ? "border-red-400" : ""}`}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                data-testid="start-date-input"
              />
              <FieldError message={errors.startDate} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/brand-campaigns")}
              data-testid="back-btn"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CampaignPage;
