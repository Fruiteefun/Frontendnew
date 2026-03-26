import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowRight, ArrowLeft, Plus, X, Target, Users, Swords, TrendingUp, Save, Loader2, Sparkles } from "lucide-react";
import { isNumericOrFormatted } from "../lib/validation";
import { campaignsApi } from "../lib/api";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

// Parse "Key: Value\nKey2: Value2" formatted strings back into field values
const parseSection = (text, keys) => {
  const result = {};
  if (!text) return result;
  for (const key of keys) {
    const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, "i");
    const match = text.match(regex);
    if (match) result[key] = match[1].trim();
  }
  return result;
};

const BusinessPlanPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: "",
      positioning: "",
      platforms: "",
      contentStyle: "",
      keyTactic: "",
    },
  ]);
  const [formData, setFormData] = useState({
    territory: "",
    marketSizeValue: "",
    marketSizeCustomers: "",
    targetAge: "",
    targetGender: "",
    targetInterests: "",
    targetIncome: "",
    targetLifestyle: "",
    advantageOverCompetitors: "",
    expectedFollowers: "",
    expectedLikes: "",
    expectedCustomers: "",
  });

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([
        ...competitors,
        {
          id: Date.now(),
          name: "",
          positioning: "",
          platforms: "",
          contentStyle: "",
          keyTactic: "",
        },
      ]);
    }
  };

  const removeCompetitor = (id) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((c) => c.id !== id));
    }
  };

  const updateCompetitor = (id, field, value) => {
    setCompetitors(
      competitors.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const campaignId = localStorage.getItem("fruitee_activeCampaignId");

  // Populate form from API plan data (4 strings → individual fields)
  const populateFromPlan = (plan) => {
    if (plan.target_market) {
      const tm = parseSection(plan.target_market, ["Territory", "Market Size (Value)", "Market Size (Customers)"]);
      setFormData((prev) => ({
        ...prev,
        territory: tm["Territory"] || plan.target_market || prev.territory,
        marketSizeValue: tm["Market Size (Value)"] || prev.marketSizeValue,
        marketSizeCustomers: tm["Market Size (Customers)"] || prev.marketSizeCustomers,
      }));
    }
    if (plan.target_customer) {
      const tc = parseSection(plan.target_customer, ["Age", "Gender", "Interests", "Income Level", "Lifestyle"]);
      setFormData((prev) => ({
        ...prev,
        targetAge: tc["Age"] || prev.targetAge,
        targetGender: tc["Gender"] || prev.targetGender,
        targetInterests: tc["Interests"] || prev.targetInterests,
        targetIncome: tc["Income Level"] || prev.targetIncome,
        targetLifestyle: tc["Lifestyle"] || plan.target_customer || prev.targetLifestyle,
      }));
    }
    if (plan.competition_analysis) {
      // Parse competitors from the competition_analysis string
      const compBlocks = plan.competition_analysis.split(/Competitor \d+:/i).filter(Boolean);
      if (compBlocks.length > 0) {
        const parsed = compBlocks.map((block, i) => {
          const lines = block.trim().split("\n").map(l => l.trim());
          const name = lines[0] || "";
          const pos = parseSection(block, ["Positioning"]);
          const plat = parseSection(block, ["Platforms"]);
          const style = parseSection(block, ["Content Style"]);
          const tactic = parseSection(block, ["Key Tactic"]);
          return {
            id: Date.now() + i,
            name,
            positioning: pos["Positioning"] || "",
            platforms: plat["Platforms"] || "",
            contentStyle: style["Content Style"] || "",
            keyTactic: tactic["Key Tactic"] || "",
          };
        });
        if (parsed.some(c => c.name)) setCompetitors(parsed);
      }
      const advMatch = plan.competition_analysis.match(/Advantage:\s*(.+)/i);
      if (advMatch) setFormData((prev) => ({ ...prev, advantageOverCompetitors: advMatch[1].trim() }));
    }
    if (plan.growth_target) {
      const gt = parseSection(plan.growth_target, ["Expected Followers", "Expected Likes", "Expected Customers"]);
      setFormData((prev) => ({
        ...prev,
        expectedFollowers: gt["Expected Followers"] || prev.expectedFollowers,
        expectedLikes: gt["Expected Likes"] || prev.expectedLikes,
        expectedCustomers: gt["Expected Customers"] || prev.expectedCustomers,
      }));
    }
  };

  // Load existing plan on mount — auto-generate if none exists
  useEffect(() => {
    const loadPlan = async () => {
      if (!campaignId) { setLoading(false); return; }
      try {
        const res = await campaignsApi.getPlan(campaignId);
        if (res.success && res.data) {
          populateFromPlan(res.data);
          setLoading(false);
          return;
        }
      } catch { /* no plan yet */ }

      // No plan exists — try to auto-generate
      setGenerating(true);
      try {
        const genRes = await campaignsApi.generatePlan(campaignId);
        if (genRes.success && genRes.data) {
          populateFromPlan(genRes.data);
        } else {
          // Try fetching after generate (might be async)
          await new Promise(r => setTimeout(r, 2000));
          const retryRes = await campaignsApi.getPlan(campaignId);
          if (retryRes.success && retryRes.data) {
            populateFromPlan(retryRes.data);
          }
        }
      } catch {
        // Generate service unavailable — user can fill manually
      }
      setGenerating(false);
      setLoading(false);
    };
    loadPlan();
  }, [campaignId]);

  // Generate plan from previous screen data
  const handleGenerate = async () => {
    if (!campaignId) return;
    setGenerating(true);
    setErrors({});
    try {
      const res = await campaignsApi.generatePlan(campaignId);
      if (res.success && res.data) {
        populateFromPlan(res.data);
      } else {
        // Generation might be async — poll for the result
        await new Promise(r => setTimeout(r, 3000));
        const planRes = await campaignsApi.getPlan(campaignId);
        if (planRes.success && planRes.data) {
          populateFromPlan(planRes.data);
        } else {
          setErrors({ api: "Plan generation is processing. Please try refreshing in a moment." });
        }
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("500") || msg.includes("Internal")) {
        setErrors({ api: "Plan generation service is temporarily unavailable. You can fill in the fields manually." });
      } else {
        setErrors({ api: msg || "Failed to generate plan" });
      }
    }
    setGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (formData.expectedFollowers && !isNumericOrFormatted(formData.expectedFollowers))
      errs.expectedFollowers = "Please enter a valid number";
    if (formData.expectedLikes && !isNumericOrFormatted(formData.expectedLikes))
      errs.expectedLikes = "Please enter a valid number";
    if (formData.expectedCustomers && !isNumericOrFormatted(formData.expectedCustomers))
      errs.expectedCustomers = "Please enter a valid number";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const cId = campaignId;
    if (!cId) { navigate("/campaign"); return; }

    setSaving(true);
    try {
      // Serialize 12+ UI fields into 4 API strings (gap analysis #2-4)
      const targetMarket = [
        formData.territory && `Territory: ${formData.territory}`,
        formData.marketSizeValue && `Market Size (Value): ${formData.marketSizeValue}`,
        formData.marketSizeCustomers && `Market Size (Customers): ${formData.marketSizeCustomers}`,
      ].filter(Boolean).join("\n") || "Not specified";

      const targetCustomer = [
        formData.targetAge && `Age: ${formData.targetAge}`,
        formData.targetGender && `Gender: ${formData.targetGender}`,
        formData.targetInterests && `Interests: ${formData.targetInterests}`,
        formData.targetIncome && `Income Level: ${formData.targetIncome}`,
        formData.targetLifestyle && `Lifestyle: ${formData.targetLifestyle}`,
      ].filter(Boolean).join("\n") || "Not specified";

      const competitorLines = competitors
        .filter((c) => c.name)
        .map((c, i) => [
          `Competitor ${i + 1}: ${c.name}`,
          c.positioning && `  Positioning: ${c.positioning}`,
          c.platforms && `  Platforms: ${c.platforms}`,
          c.contentStyle && `  Content Style: ${c.contentStyle}`,
          c.keyTactic && `  Key Tactic: ${c.keyTactic}`,
        ].filter(Boolean).join("\n"));
      const competitionAnalysis = [
        ...competitorLines,
        formData.advantageOverCompetitors && `\nAdvantage: ${formData.advantageOverCompetitors}`,
      ].filter(Boolean).join("\n\n") || "Not specified";

      const growthTarget = [
        formData.expectedFollowers && `Expected Followers: ${formData.expectedFollowers}`,
        formData.expectedLikes && `Expected Likes: ${formData.expectedLikes}`,
        formData.expectedCustomers && `Expected Customers: ${formData.expectedCustomers}`,
      ].filter(Boolean).join("\n") || "Not specified";

      await campaignsApi.updatePlan(cId, {
        target_market: targetMarket,
        target_customer: targetCustomer,
        competition_analysis: competitionAnalysis,
        growth_target: growthTarget,
      });

      navigate("/influencers");
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="business-plan-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Campaign Plan
          </h1>
          <p className="text-muted-foreground">
            Define your market, customers, competitors and growth targets
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Target Market */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Target Market
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="territory">Territory</Label>
                <Input
                  id="territory"
                  placeholder="e.g. Global, Online, EU, North America"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.territory}
                  onChange={(e) =>
                    setFormData({ ...formData, territory: e.target.value })
                  }
                  data-testid="territory-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketSizeValue">Market Size (Value)</Label>
                <Input
                  id="marketSizeValue"
                  placeholder="e.g. $2.5B"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.marketSizeValue}
                  onChange={(e) =>
                    setFormData({ ...formData, marketSizeValue: e.target.value })
                  }
                  data-testid="market-size-value-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketSizeCustomers">Market Size (Customers)</Label>
                <Input
                  id="marketSizeCustomers"
                  placeholder="e.g. 12M potential customers"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.marketSizeCustomers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketSizeCustomers: e.target.value,
                    })
                  }
                  data-testid="market-size-customers-input"
                />
              </div>
            </div>
          </div>

          {/* Target Customer Profile */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Target Customer Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetAge">Age</Label>
                <Input
                  id="targetAge"
                  placeholder="e.g., 25-34"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.targetAge}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAge: e.target.value })
                  }
                  data-testid="target-age-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetGender">Gender</Label>
                <Input
                  id="targetGender"
                  placeholder="e.g., All, Male, Female"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.targetGender}
                  onChange={(e) =>
                    setFormData({ ...formData, targetGender: e.target.value })
                  }
                  data-testid="target-gender-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetInterests">Interests</Label>
              <Input
                id="targetInterests"
                placeholder="e.g., Technology, Fashion, Fitness..."
                className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.targetInterests}
                onChange={(e) =>
                  setFormData({ ...formData, targetInterests: e.target.value })
                }
                data-testid="target-interests-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetIncome">Income Level</Label>
                <Input
                  id="targetIncome"
                  placeholder="e.g. $50K-$100K"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.targetIncome}
                  onChange={(e) =>
                    setFormData({ ...formData, targetIncome: e.target.value })
                  }
                  data-testid="target-income-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetLifestyle">Lifestyle Traits</Label>
              <Textarea
                id="targetLifestyle"
                placeholder="Describe target customer lifestyle — health-conscious, urban, eco-friendly..."
                className="min-h-[80px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.targetLifestyle}
                onChange={(e) =>
                  setFormData({ ...formData, targetLifestyle: e.target.value })
                }
                data-testid="target-lifestyle-input"
              />
            </div>
          </div>

          {/* Competitors Profile */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
                  <Swords className="w-5 h-5 text-orange-500" />
                  Competitors Profile
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add up to 5 competitors with their social media strategy
                </p>
              </div>
            </div>

            {competitors.map((competitor, index) => (
              <div
                key={competitor.id}
                className="bg-muted/30 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Competitor {index + 1}</h3>
                  {competitors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompetitor(competitor.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Competitor Name</Label>
                    <Input
                      placeholder="Company name"
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      value={competitor.name}
                      onChange={(e) =>
                        updateCompetitor(competitor.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Positioning</Label>
                    <Input
                      placeholder="Market positioning"
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      value={competitor.positioning}
                      onChange={(e) =>
                        updateCompetitor(
                          competitor.id,
                          "positioning",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Platforms Used</Label>
                    <Input
                      placeholder="e.g., Instagram, TikTok"
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      value={competitor.platforms}
                      onChange={(e) =>
                        updateCompetitor(
                          competitor.id,
                          "platforms",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Style</Label>
                    <Input
                      placeholder="e.g., Educational, Fun"
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      value={competitor.contentStyle}
                      onChange={(e) =>
                        updateCompetitor(
                          competitor.id,
                          "contentStyle",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Key Tactic</Label>
                    <Input
                      placeholder="e.g., Influencer partnerships"
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      value={competitor.keyTactic}
                      onChange={(e) =>
                        updateCompetitor(
                          competitor.id,
                          "keyTactic",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            {competitors.length < 5 && (
              <Button
                type="button"
                variant="outline"
                onClick={addCompetitor}
                className="w-full h-12 rounded-xl border-dashed border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                data-testid="add-competitor-btn"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Competitor ({competitors.length}/5)
              </Button>
            )}

            <div className="space-y-2 pt-4">
              <Label htmlFor="advantage">Advantage Over Competitors</Label>
              <Textarea
                id="advantage"
                placeholder="What makes your brand stand out from competitors?"
                className="min-h-[100px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.advantageOverCompetitors}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    advantageOverCompetitors: e.target.value,
                  })
                }
                data-testid="advantage-textarea"
              />
            </div>
          </div>

          {/* Growth Target */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Growth Target (Social Media Campaign)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="expectedFollowers">
                  Expected Additional Followers
                </Label>
                <Input
                  id="expectedFollowers"
                  placeholder="e.g., 10,000"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.expectedFollowers ? "border-red-400" : ""}`}
                  value={formData.expectedFollowers}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[\d,.\s]*$/.test(val)) {
                      setFormData({ ...formData, expectedFollowers: val });
                    }
                  }}
                  data-testid="expected-followers-input"
                />
                <FieldError message={errors.expectedFollowers} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedLikes">Expected Additional Likes</Label>
                <Input
                  id="expectedLikes"
                  placeholder="e.g., 50,000"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.expectedLikes ? "border-red-400" : ""}`}
                  value={formData.expectedLikes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[\d,.\s]*$/.test(val)) {
                      setFormData({ ...formData, expectedLikes: val });
                    }
                  }}
                  data-testid="expected-likes-input"
                />
                <FieldError message={errors.expectedLikes} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedCustomers">
                  Expected Additional Customers
                </Label>
                <Input
                  id="expectedCustomers"
                  placeholder="e.g., 500"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.expectedCustomers ? "border-red-400" : ""}`}
                  value={formData.expectedCustomers}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[\d,.\s]*$/.test(val)) {
                      setFormData({ ...formData, expectedCustomers: val });
                    }
                  }}
                  data-testid="expected-customers-input"
                />
                <FieldError message={errors.expectedCustomers} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {errors.api && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4" data-testid="api-error">{errors.api}</div>
          )}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate(-1)}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
        )}
      </div>
    </Layout>
  );
};

export default BusinessPlanPage;
