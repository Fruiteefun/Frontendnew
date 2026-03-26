import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Megaphone, CalendarDays, Save, Loader2 } from "lucide-react";
import { isNotEmpty, isValidDate, isFutureOrToday } from "../lib/validation";
import { campaignsApi } from "../lib/api";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const CampaignPage = () => {
  const navigate = useNavigate();
  const brandId = localStorage.getItem("fruitee_activeBrandId");
  const campaignId = localStorage.getItem("fruitee_activeCampaignId");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!campaignId);
  const [formData, setFormData] = useState({
    campaignName: "",
    startDate: "",
  });

  // Load existing campaign data on mount
  useEffect(() => {
    if (!campaignId) return;
    const loadCampaign = async () => {
      try {
        const res = await campaignsApi.get(campaignId);
        if (res.success && res.data) {
          setFormData({
            campaignName: res.data.name || "",
            startDate: res.data.start_date ? res.data.start_date.split("T")[0] : "",
          });
        }
      } catch { /* new campaign */ }
      setLoading(false);
    };
    loadCampaign();
  }, [campaignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!isNotEmpty(formData.campaignName)) e2.campaignName = "Campaign name is required";
    if (!isNotEmpty(formData.startDate)) {
      e2.startDate = "Start date is required";
    } else if (!isValidDate(formData.startDate)) {
      e2.startDate = "Please enter a valid date (year between 1900-2100)";
    } else if (!isFutureOrToday(formData.startDate)) {
      e2.startDate = "Start date cannot be in the past";
    }
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    if (!brandId) { navigate("/brands"); return; }

    setSaving(true);
    try {
      let res;
      if (campaignId) {
        res = await campaignsApi.update(campaignId, {
          name: formData.campaignName,
          start_date: new Date(formData.startDate).toISOString(),
        });
      } else {
        res = await campaignsApi.create(brandId, {
          name: formData.campaignName,
          start_date: new Date(formData.startDate).toISOString(),
        });
        if (res.success && res.data) {
          localStorage.setItem("fruitee_activeCampaignId", res.data.id);
        }
      }
      navigate("/campaign-type");
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="campaign-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            {campaignId ? "Edit Campaign" : "Create Your Campaign"}
          </h1>
          <p className="text-muted-foreground">
            Set up your campaign details
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
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
                min={new Date().toISOString().split("T")[0]}
                className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.startDate ? "border-red-400" : ""}`}
                value={formData.startDate}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val) {
                    const parts = val.split("-");
                    if (parts[0] && parts[0].length > 4) {
                      parts[0] = parts[0].slice(0, 4);
                      val = parts.join("-");
                    }
                  }
                  setFormData({ ...formData, startDate: val });
                }}
                data-testid="start-date-input"
              />
              <FieldError message={errors.startDate} />
            </div>
          </div>

          {/* Action Buttons */}
          {errors.api && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm" data-testid="api-error">{errors.api}</div>
          )}
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
              disabled={saving}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Creating..." : "Save & Continue"}
            </Button>
          </div>
        </form>
        )}
      </div>
    </Layout>
  );
};

export default CampaignPage;
