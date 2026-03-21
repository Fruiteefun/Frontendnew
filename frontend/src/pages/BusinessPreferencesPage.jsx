import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { ArrowRight, Save, ShieldCheck, Tag, AlertTriangle, MessageCircle, Compass, Users, Radio, Handshake } from "lucide-react";

const BusinessPreferencesPage = () => {
  const navigate = useNavigate();

  const [consents, setConsents] = useState({
    aiContent: true,
    aiDisclaimer: true,
    aiInfluencers: true,
    aiPublished: true,
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [participationConsent, setParticipationConsent] = useState(true);
  const [matchingConsents, setMatchingConsents] = useState({
    preferences: true,
    matching: true,
  });

  const categories = [
    "Fashion & Apparel",
    "Beauty & Personal Care",
    "Health, Fitness & Wellness",
    "Food & Beverage",
    "Travel & Experiences",
    "Lifestyle & Home",
    "Services – Domestic (e.g., Home Services, Dog Walker, Electrician, Carer, Car Repair)",
    "Services – Business (e.g., Accounting, Finance, Legal, Property, Consulting, Recruitment, B2B)",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/brands");
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
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="business-preferences-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Business Preferences
          </h1>
          <p className="text-muted-foreground">
            Customise how your brand participates in campaigns
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. AI Usage & Legal Consent */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              1. AI Usage & Legal Consent
            </h2>
            <p className="text-sm text-muted-foreground">
              Please confirm your consent for how your business information, brand assets, and identity may be used in AI-generated campaigns.
            </p>
            <div className="space-y-4">
              <ConsentCheck
                label="I consent to the use of my business details in AI-generated marketing content"
                checked={consents.aiContent}
                onChange={(v) => setConsents({ ...consents, aiContent: v })}
                testId="consent-ai-content"
              />
              <ConsentCheck
                label="I understand AI-generated content is provided for marketing assistance and does not constitute legal, financial, or contractual advice on behalf of my business"
                checked={consents.aiDisclaimer}
                onChange={(v) => setConsents({ ...consents, aiDisclaimer: v })}
                testId="consent-ai-disclaimer"
              />
              <ConsentCheck
                label="I understand that campaigns may feature AI-assisted or digitally represented influencers who have provided their consent."
                checked={consents.aiInfluencers}
                onChange={(v) => setConsents({ ...consents, aiInfluencers: v })}
                testId="consent-ai-influencers"
              />
              <ConsentCheck
                label="I understand previously published AI-generated campaign content may remain live where legally required."
                checked={consents.aiPublished}
                onChange={(v) => setConsents({ ...consents, aiPublished: v })}
                testId="consent-ai-published"
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
              Which categories are you open to running campaigns in?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <RadioOption
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              How would you like content featuring your brand to feel?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toneOptions.map((tone) => (
                <RadioOption
                  key={tone}
                  label={tone}
                  selected={selectedTone === tone}
                  onClick={() => setSelectedTone(tone)}
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
              What type of themes or topics define your brand's social media presence?
            </p>
            <div className="space-y-4">
              {pillarOptions.map((pillar) => (
                <RadioOption
                  key={pillar}
                  label={pillar}
                  selected={selectedPillar === pillar}
                  onClick={() => setSelectedPillar(pillar)}
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
              Which best describes the audience that you wish to target?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audienceOptions.map((audience) => (
                <RadioOption
                  key={audience}
                  label={audience}
                  selected={selectedAudience === audience}
                  onClick={() => setSelectedAudience(audience)}
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
              label="I understand that I can pause future participation at any time. Campaigns already confirmed or in progress may continue to completion to ensure fairness for all parties."
              checked={participationConsent}
              onChange={setParticipationConsent}
              testId="consent-participation"
            />
          </div>

          {/* 9. Campaign Matching Understanding */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-5">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Handshake className="w-5 h-5 text-orange-500" />
              9. Campaign Matching Understanding
            </h2>
            <div className="space-y-4">
              <ConsentCheck
                label="I understand my preferences are used for automated campaign matching and visibility"
                checked={matchingConsents.preferences}
                onChange={(v) => setMatchingConsents({ ...matchingConsents, preferences: v })}
                testId="consent-matching-preferences"
              />
              <ConsentCheck
                label="I understand campaigns are shown to relevant influencers based on matching preferences"
                checked={matchingConsents.matching}
                onChange={(v) => setMatchingConsents({ ...matchingConsents, matching: v })}
                testId="consent-matching-shown"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/profile")}
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

export default BusinessPreferencesPage;
