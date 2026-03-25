import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { BookOpen, Save, ArrowLeft, Loader2 } from "lucide-react";
import { brandsApi } from "../lib/api";

const BrandBioPage = () => {
  const navigate = useNavigate();
  const brandId = localStorage.getItem("fruitee_activeBrandId");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    visualIdentity: "",
    customerExperience: "",
  });

  // Load existing brand bio
  useEffect(() => {
    const loadBio = async () => {
      if (!brandId) { setLoading(false); return; }
      try {
        const res = await brandsApi.getBio(brandId);
        if (res.success && res.data) {
          setFormData({
            description: res.data.description || "",
            visualIdentity: res.data.visual_identity || "",
            customerExperience: "",
          });
        }
      } catch {
        // No bio yet
      } finally {
        setLoading(false);
      }
    };
    loadBio();
  }, [brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandId) { navigate("/brands"); return; }
    setSaving(true);
    setApiError("");
    try {
      // Gap analysis #9: 3 UI fields → 2 API fields. Append customerExperience to description.
      const fullDescription = formData.customerExperience
        ? `${formData.description}\n\nCustomer Experience: ${formData.customerExperience}`
        : formData.description;

      await brandsApi.updateBio(brandId, {
        description: fullDescription,
        visual_identity: formData.visualIdentity,
      });
      navigate("/brand-campaigns");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="brand-bio-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Brand Bio
          </h1>
          <p className="text-muted-foreground">
            Tell us more about your brand's identity and personality
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm" data-testid="api-error">
              {apiError}
            </div>
          )}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Brand Identity
            </h2>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your brand's story, mission, and what makes it unique"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="description-textarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualIdentity">Visual Identity</Label>
              <Textarea
                id="visualIdentity"
                placeholder="Describe your visual style — logo feel, colors, fonts, and overall aesthetic (e.g. modern, minimal, bold, playful)"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.visualIdentity}
                onChange={(e) => setFormData({ ...formData, visualIdentity: e.target.value })}
                data-testid="visual-identity-textarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerExperience">Customer Experience</Label>
              <Textarea
                id="customerExperience"
                placeholder="What kind of experience do you want customers to have with your brand?"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.customerExperience}
                onChange={(e) => setFormData({ ...formData, customerExperience: e.target.value })}
                data-testid="customer-experience-textarea"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
      </div>
    </Layout>
  );
};

export default BrandBioPage;
