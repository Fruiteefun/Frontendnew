import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { BookOpen, Save } from "lucide-react";

const BrandBioPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lookAndFeel: "",
    voice: "",
    personalityValues: "",
    customerExperience: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/brand-campaigns");
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
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Brand Identity
            </h2>

            <div className="space-y-2">
              <Label htmlFor="lookAndFeel">Brand Look & Feel</Label>
              <Textarea
                id="lookAndFeel"
                placeholder="Describe your visual style — logo feel, colors, fonts, and overall aesthetic (e.g. modern, minimal, bold, playful)"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.lookAndFeel}
                onChange={(e) => setFormData({ ...formData, lookAndFeel: e.target.value })}
                data-testid="look-and-feel-textarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Brand Voice</Label>
              <Textarea
                id="voice"
                placeholder="How should your brand sound? (e.g. friendly, professional, witty, premium, bold). Include example phrases if possible."
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.voice}
                onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                data-testid="voice-textarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalityValues">Brand Personality & Values</Label>
              <Textarea
                id="personalityValues"
                placeholder="What does your brand stand for? Describe its personality and core values (e.g. trustworthy, innovative, sustainable, fun)"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.personalityValues}
                onChange={(e) => setFormData({ ...formData, personalityValues: e.target.value })}
                data-testid="personality-values-textarea"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerExperience">Customer Experience</Label>
              <Textarea
                id="customerExperience"
                placeholder="Describe the experience you want customers to have (e.g. fast & convenient, premium & personalised, fun & engaging)"
                className="min-h-[120px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.customerExperience}
                onChange={(e) => setFormData({ ...formData, customerExperience: e.target.value })}
                data-testid="customer-experience-textarea"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/business-preferences")}
              data-testid="cancel-btn"
            >
              Cancel
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

export default BrandBioPage;
