import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { ShieldCheck, Tag, AlertTriangle, MessageCircle, Compass, Users, Radio, Handshake, Globe2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { influencerOnboardApi } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const InfluencerPreferencesPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [consents, setConsents] = useState({
    name: true,
    likeness: true,
    voice: true,
    categories: true,
    pause: true,
    aiIdentified: true,
    published: true,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTones, setSelectedTones] = useState([]);
  const [selectedPillars, setSelectedPillars] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [participationConsent, setParticipationConsent] = useState(true);
  const [matchingConsents, setMatchingConsents] = useState({
    aligned: true,
    automated: true,
  });
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);

  const categories = [
    "Fashion & Apparel",
    "Beauty & Personal Care",
    "Health, Fitness & Wellness",
    "Food & Beverage",
    "Travel & Experiences",
    "Lifestyle & Home",
    "Services – Domestic",
    "Services – Business",
  ];

  const restrictedCategories = [
    "Gambling",
    "Crypto / Web3",
    "Political content",
    "Religious promotion",
    "Adult products or services",
    "Weight-loss supplements",
    "Alcohol-related campaigns",
    "Tobacco / nicotine / vaping",
    "Illegal products, services, or content that incites hatred or violence",
  ];

  const toneOptions = [
    "Professional / Educational",
    "Inspirational",
    "Polished / Premium",
    "Playful / Lighthearted",
    "No strong preference",
  ];

  const pillarOptions = [
    "Educational: Through tutorials, tips, and insights",
    "Promotional: Showcases products or services to drive sales",
    "Community: Team spotlights and user-generated content (UGC)",
    "Inspirational/Entertaining: Stories, quotes, or entertaining content",
    "Industry Trends/News: Discusses current trends or news to show relevance",
  ];

  const audienceOptions = [
    "Young adults (18-30)",
    "Adults (30-50)",
    "Broad / mixed audience",
    "Teens / Students",
    "Parents / Families",
    "Professionals / Career-focused",
  ];

  const regionOptions = [
    "Global / No restriction",
    "Europe",
    "UK",
    "Middle East",
    "North America",
    "Asia",
    "Prefer to remain local to my current region",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError("");

    // Validate required selections
    const missing = [];
    if (selectedCategories.length === 0) missing.push("categories");
    if (selectedTones.length === 0) missing.push("tones");
    if (selectedPillars.length === 0) missing.push("brand positioning");
    if (selectedAudiences.length === 0) missing.push("audience types");
    if (selectedRegions.length === 0) missing.push("regions");
    if (missing.length > 0) {
      setApiError(`Please select at least one option for: ${missing.join(", ")}`);
      setSaving(false);
      return;
    }

    try {
      await influencerOnboardApi.submit({
        consent_name: consents.name,
        consent_likeness: consents.likeness,
        consent_voice: consents.voice,
        consent_category_limits: consents.categories,
        consent_pause_participation: consents.pause,
        consent_identified_as_ai: consents.aiIdentified,
        consent_remains_live: consents.published,
        allowed_categories: selectedCategories,
        preferred_tones: selectedTones,
        brand_positioning: selectedPillars,
        audience_type: selectedAudiences,
        understands_pausing_participation: participationConsent,
        category_preferences: {},
        understands_shown_campaigns: matchingConsents.aligned,
        understands_automated_matching: matchingConsents.automated,
        allowed_regions: selectedRegions,
      });
      await refreshUser();
      navigate("/earnings-preview");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const RadioOption = ({ label, selected, onClick, testId }) => (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onClick}
      data-testid={testId}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? "border-orange-400" : "border-gray-300 group-hover:border-orange-300"
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );

  const CheckboxOption = ({ label, checked, onClick, testId }) => (
    <div
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onClick}
      data-testid={testId}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked ? "border-orange-400 bg-orange-400" : "border-gray-300 group-hover:border-orange-300"
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );

  const toggleSelection = (arr, setArr, value) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const ConsentCheck = ({ label, checked, onChange, testId }) => (
    <div
      className="flex items-start gap-3 cursor-pointer group"
      onClick={() => onChange(!checked)}
      data-testid={testId}
    >
      <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
        checked ? "border-orange-400 bg-orange-400" : "border-gray-300 group-hover:border-orange-300"
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-sm text-foreground leading-relaxed">{label}</span>
    </div>
  );

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-3xl mx-auto" data-testid="influencer-preferences-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Influencer Preferences
          </h1>
          <p className="text-muted-foreground">
            Customize your preferences to receive the most relevant campaigns
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm" data-testid="api-error">
              {apiError}
            </div>
          )}
          {/* 1. AI Usage & Legal Consent */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              1. AI Usage & Legal Consent
            </h2>
            <p className="text-sm text-muted-foreground">
              Required – all must be ticked. Please confirm your consent for how your identity may be used in AI-generated campaigns.
            </p>
            <div className="space-y-4">
              <ConsentCheck
                label="I consent to the use of my name in AI-generated content"
                checked={consents.name}
                onChange={(v) => setConsents({ ...consents, name: v })}
                testId="consent-name"
              />
              <ConsentCheck
                label="I consent to the use of my likeness (face/avatar) in AI-generated content"
                checked={consents.likeness}
                onChange={(v) => setConsents({ ...consents, likeness: v })}
                testId="consent-likeness"
              />
              <ConsentCheck
                label="I consent to the use of my voice in AI-generated content (where applicable)"
                checked={consents.voice}
                onChange={(v) => setConsents({ ...consents, voice: v })}
                testId="consent-voice"
              />
              <ConsentCheck
                label="I understand my likeness will only be used within the categories I actively select"
                checked={consents.categories}
                onChange={(v) => setConsents({ ...consents, categories: v })}
                testId="consent-categories"
              />
              <ConsentCheck
                label="I understand I can pause participation at any time, which stops future content generation"
                checked={consents.pause}
                onChange={(v) => setConsents({ ...consents, pause: v })}
                testId="consent-pause"
              />
              <ConsentCheck
                label="I understand and agree that my Digital Twin will always be clearly identified as AI-assisted or AI-generated where applicable"
                checked={consents.aiIdentified}
                onChange={(v) => setConsents({ ...consents, aiIdentified: v })}
                testId="consent-ai-identified"
              />
              <ConsentCheck
                label="I understand previously published AI-generated campaign content may remain live where legally required"
                checked={consents.published}
                onChange={(v) => setConsents({ ...consents, published: v })}
                testId="consent-published"
              />
            </div>
          </div>

          {/* 2. Categories */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              2. Categories You Wish to Participate In
            </h2>
            <p className="text-sm text-muted-foreground">
              Which categories are you open to appearing in content for?
            </p>
            <div className="space-y-4">
              {categories.map((cat) => (
                <CheckboxOption
                  key={cat}
                  label={cat}
                  checked={selectedCategories.includes(cat)}
                  onClick={() => toggleSelection(selectedCategories, setSelectedCategories, cat)}
                  testId={`category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ))}
            </div>
          </div>

          {/* 3. Restricted & Excluded Categories */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              3. Restricted & Excluded Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Fruitee does not create or publish content related to the following categories:
            </p>
            <div className="space-y-3">
              {restrictedCategories.map((cat) => (
                <div key={cat} className="flex items-start gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-sm text-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Preferred Content Tone */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              4. Preferred Content Tone
            </h2>
            <p className="text-sm text-muted-foreground">
              How would you like content featuring you to feel?
            </p>
            <div className="space-y-4">
              {toneOptions.map((tone) => (
                <CheckboxOption
                  key={tone}
                  label={tone}
                  checked={selectedTones.includes(tone)}
                  onClick={() => toggleSelection(selectedTones, setSelectedTones, tone)}
                  testId={`tone-${tone.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ))}
            </div>
          </div>

          {/* 5. Primary Content Pillars */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              5. Primary Content Pillars
            </h2>
            <p className="text-sm text-muted-foreground">
              What type of themes or topics are you comfortable creating?
            </p>
            <div className="space-y-4">
              {pillarOptions.map((pillar) => (
                <CheckboxOption
                  key={pillar}
                  label={pillar}
                  checked={selectedPillars.includes(pillar)}
                  onClick={() => toggleSelection(selectedPillars, setSelectedPillars, pillar)}
                  testId={`pillar-${pillar.split(':')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ))}
            </div>
          </div>

          {/* 6. Audience Type */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              6. Audience Type
            </h2>
            <p className="text-sm text-muted-foreground">
              Which audiences best describe your followers?
            </p>
            <div className="space-y-4">
              {audienceOptions.map((audience) => (
                <CheckboxOption
                  key={audience}
                  label={audience}
                  checked={selectedAudiences.includes(audience)}
                  onClick={() => toggleSelection(selectedAudiences, setSelectedAudiences, audience)}
                  testId={`audience-${audience.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ))}
            </div>
          </div>

          {/* 7. Participation Control */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Radio className="w-5 h-5 text-orange-500" />
              7. Participation Control
            </h2>
            <p className="text-sm text-muted-foreground">
              Please confirm your understanding of participation control.
            </p>
            <ConsentCheck
              label="I understand that I can pause future participation at any time. Campaigns that have already been confirmed or in progress will continue to completion to ensure fairness for all parties."
              checked={participationConsent}
              onChange={setParticipationConsent}
              testId="consent-participation"
            />
          </div>

          {/* 8. Campaign Matching Understanding */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Handshake className="w-5 h-5 text-orange-500" />
              8. Campaign Matching Understanding
            </h2>
            <p className="text-sm text-muted-foreground">
              Required acknowledgement.
            </p>
            <div className="space-y-4">
              <ConsentCheck
                label="I understand I will only be shown campaigns aligned with my selected preferences"
                checked={matchingConsents.aligned}
                onChange={(v) => setMatchingConsents({ ...matchingConsents, aligned: v })}
                testId="consent-matching-aligned"
              />
              <ConsentCheck
                label="I understand my preferences are used for automated matching"
                checked={matchingConsents.automated}
                onChange={(v) => setMatchingConsents({ ...matchingConsents, automated: v })}
                testId="consent-matching-automated"
              />
            </div>
          </div>

          {/* 9. Region Comfort */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-orange-500" />
              9. Regions
            </h2>
            <p className="text-sm text-muted-foreground">
              Which regions do your followers lie in?
            </p>
            <div className="space-y-4">
              {regionOptions.map((region) => (
                <CheckboxOption
                  key={region}
                  label={region}
                  checked={selectedRegions.includes(region)}
                  onClick={() => toggleSelection(selectedRegions, setSelectedRegions, region)}
                  testId={`region-${region.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                />
              ))}
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

export default InfluencerPreferencesPage;
