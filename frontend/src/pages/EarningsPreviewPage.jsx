import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { ArrowRight, ArrowLeft, TrendingUp, Lock, Crown, Star, Loader2, Info } from "lucide-react";
import { userApi } from "../lib/api";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const TIER_META = {
  tier_1: { name: "Nano", followers: "0 – 1K", engagement: "0% – 1%", icon: Star },
  tier_2: { name: "Rising Star", followers: "1K – 10K", engagement: "1% – 2%", icon: Star },
  tier_3: { name: "Creator", followers: "10K – 25K", engagement: "2% – 5%", icon: Star },
  tier_4: { name: "Influencer", followers: "25K – 100K", engagement: "3% – 6%", icon: Crown },
  tier_5: { name: "Star", followers: "100K – 500K", engagement: "4% – 8%", icon: Crown },
  tier_6: { name: "Celebrity", followers: "500K+", engagement: "5% – 10%", icon: Crown },
};

const EarningsPreviewPage = () => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTierKey, setCurrentTierKey] = useState("tier_1");
  const [platform, setPlatform] = useState("instagram");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch pricing data
        const pricingRes = await fetch(`${API_BASE}/api/v1/campaigns/pricing-list`);
        const pricingData = await pricingRes.json();
        if (pricingData.success) {
          setPricing(pricingData.data);
        }

        // Fetch user profile to determine current tier
        const userRes = await userApi.getMe();
        if (userRes.success && userRes.data?.influencer_profile) {
          const p = userRes.data.influencer_profile;
          // Determine tier from follower count (use instagram as primary)
          const followers = p.instagram_num_of_followers || p.tiktok_num_of_followers || p.youtube_num_of_followers || 0;
          if (followers >= 500000) setCurrentTierKey("tier_6");
          else if (followers >= 100000) setCurrentTierKey("tier_5");
          else if (followers >= 25000) setCurrentTierKey("tier_4");
          else if (followers >= 10000) setCurrentTierKey("tier_3");
          else if (followers >= 1000) setCurrentTierKey("tier_2");
          else setCurrentTierKey("tier_1");
        }
      } catch {
        // Default to tier_1
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const currentTierNum = parseInt(currentTierKey.split("_")[1]);

  // Use mid-range engagement (5-10) as the display price
  const getPrice = (tierKey, duration) => {
    if (!pricing || !pricing[platform]?.[tierKey]) return null;
    const tierData = pricing[platform][tierKey];
    const engRange = tierData["5-10"] || tierData["0-5"] || Object.values(tierData)[0];
    return engRange?.[duration]?.influencer_fee;
  };

  const formatPrice = (amount) => {
    if (!amount) return "—";
    return `£${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Layout userType="influencer">
        <div className="p-8 max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-3xl mx-auto" data-testid="earnings-preview-page">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Earnings Preview
          </h1>
          <p className="text-muted-foreground">
            See what you earn per campaign based on your tier
          </p>
        </div>

        {/* Current Tier Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200">
            <Crown className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">
              Your Current Tier: {TIER_META[currentTierKey]?.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {TIER_META[currentTierKey]?.followers} followers · {TIER_META[currentTierKey]?.engagement} engagement
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {["instagram", "tiktok", "youtube"].map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                platform === p
                  ? "bg-foreground text-white"
                  : "bg-white text-muted-foreground border border-gray-200 hover:border-gray-300"
              }`}
              data-testid={`platform-tab-${p}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="space-y-4">
          {Object.entries(TIER_META).map(([tierKey, meta]) => {
            const tierNum = parseInt(tierKey.split("_")[1]);
            const isCurrent = tierKey === currentTierKey;
            const isLocked = tierNum > currentTierNum;
            const isPast = tierNum < currentTierNum;
            const IconComponent = meta.icon;

            return (
              <div
                key={tierKey}
                className={`bg-white rounded-3xl shadow-soft overflow-hidden transition-all ${
                  isCurrent
                    ? "border-2 border-orange-400 shadow-floating"
                    : isLocked
                    ? "opacity-75"
                    : "border border-gray-100"
                }`}
                data-testid={`tier-card-${tierKey}`}
              >
                {/* Tier Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${
                  isCurrent ? "bg-gradient-to-r from-orange-50 to-pink-50" : ""
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCurrent
                        ? "bg-gradient-to-br from-orange-400 to-pink-500"
                        : isLocked
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-teal-400 to-teal-500"
                    }`}>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-gray-500" />
                      ) : (
                        <IconComponent className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-outfit text-lg font-semibold">{meta.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {meta.followers} · {meta.engagement}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                      Current Tier
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                      Unlockable
                    </span>
                  )}
                  {isPast && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-600 text-xs font-semibold rounded-full">
                      Completed
                    </span>
                  )}
                </div>

                {/* Pricing Grid */}
                <div className="px-6 pb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {[
                      { key: "one_week", label: "1 Week Campaign", desc: "5 posts & 2 reels" },
                      { key: "one_month", label: "1 Month Campaign", desc: "12 posts & 8 reels" },
                      { key: "three_month", label: "3 Month Campaign", desc: "30 posts & 20 reels" },
                    ].map((dur) => {
                      const price = getPrice(tierKey, dur.key);
                      return (
                        <div
                          key={dur.key}
                          className={`rounded-2xl p-4 ${
                            isCurrent
                              ? "bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100"
                              : "bg-gray-50 border border-gray-100"
                          }`}
                        >
                          <p className="text-xs font-medium text-muted-foreground mb-1">{dur.label}</p>
                          <p className={`text-2xl font-outfit font-bold ${
                            isLocked ? "text-gray-400" : "text-foreground"
                          }`}>
                            {formatPrice(price)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{dur.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Unlock message for locked tiers */}
                  {isLocked && (
                    <div className="mt-3 flex items-start gap-2 px-4 py-3 bg-blue-50 rounded-xl">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        Grow to {meta.engagement} engagement and {meta.followers} followers to unlock this tier
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How tiers work */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mt-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-outfit font-semibold text-foreground mb-1">How tiers work</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your tier is determined by your combination of follower count and engagement rate.
                As your stats grow, you automatically move to the next tier and earn more per campaign.
                Earnings are paid upon successful campaign completion.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            onClick={() => navigate("/influencer-preferences")}
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => navigate("/influencer-payment")}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
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

export default EarningsPreviewPage;
