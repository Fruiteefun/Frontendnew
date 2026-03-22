import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, ArrowLeft, Megaphone, ChevronRight, Calendar, Trash2, Palette, Settings } from "lucide-react";

const BrandCampaignsPage = () => {
  const navigate = useNavigate();
  const brandId = localStorage.getItem("fruitee_activeBrandId");
  const [brandName, setBrandName] = useState("");

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem(`fruitee_campaigns_${brandId}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Get brand name
    const brands = JSON.parse(localStorage.getItem("fruitee_brands") || "[]");
    const brand = brands.find((b) => b.id === brandId);
    if (brand) setBrandName(brand.name);
  }, [brandId]);

  useEffect(() => {
    localStorage.setItem(`fruitee_campaigns_${brandId}`, JSON.stringify(campaigns));
  }, [campaigns, brandId]);

  const handleCreateCampaign = () => {
    const newCampaign = {
      id: Date.now().toString(),
      name: "",
      startDate: "",
      status: "Draft",
    };
    setCampaigns([...campaigns, newCampaign]);
    localStorage.setItem("fruitee_activeCampaignId", newCampaign.id);
    navigate("/campaign");
  };

  const handleCampaignClick = (campaign) => {
    localStorage.setItem("fruitee_activeCampaignId", campaign.id);
    navigate("/campaign");
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  const handleEditBrand = () => {
    navigate("/brand-setup");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-4xl mx-auto" data-testid="brand-campaigns-page">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate("/brands")}
            className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-orange-50 transition-colors"
            data-testid="back-to-brands"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-outfit text-4xl font-bold text-foreground">
              {brandName}
            </h1>
            <p className="text-muted-foreground">
              Manage campaigns for this brand
            </p>
          </div>
        </div>

        {/* Brand Quick Actions */}
        <div className="flex gap-3 mb-8 mt-4">
          <Button
            variant="outline"
            onClick={handleEditBrand}
            className="rounded-xl border-gray-200 hover:border-orange-200 hover:bg-orange-50"
            data-testid="edit-brand-profile"
          >
            <Palette className="w-4 h-4 mr-2 text-orange-500" />
            Edit Brand Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/business-preferences")}
            className="rounded-xl border-gray-200 hover:border-orange-200 hover:bg-orange-50"
            data-testid="edit-brand-preferences"
          >
            <Settings className="w-4 h-4 mr-2 text-orange-500" />
            Edit Brand Preferences
          </Button>
        </div>

        {/* Create Campaign Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-outfit text-xl font-semibold">Campaigns</h2>
          <Button
            onClick={handleCreateCampaign}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold"
            data-testid="create-campaign-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-soft text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="font-outfit text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first campaign to start reaching audiences.
            </p>
            <Button
              onClick={handleCreateCampaign}
              className="rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold"
              data-testid="create-first-campaign-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-orange-200 cursor-pointer group"
                data-testid={`campaign-card-${campaign.id}`}
              >
                <div
                  className="p-5 flex items-center gap-4"
                  onClick={() => handleCampaignClick(campaign)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {campaign.name || "Untitled Campaign"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {campaign.startDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {campaign.startDate}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        campaign.status === "Active"
                          ? "bg-teal-100 text-teal-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 transition-colors flex-shrink-0" />
                </div>
                <div className="px-5 pb-3 flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(campaign.id); }}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrandCampaignsPage;
