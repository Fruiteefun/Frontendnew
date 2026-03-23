import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Play, Pause, Share2, Download, Copy, Check, ArrowRight } from "lucide-react";

const DigitalTwinIntroPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const isRegistered = localStorage.getItem("fruitee_influencer_registered") === "true";

  // Track which platforms have been posted to
  const [postedPlatforms, setPostedPlatforms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fruitee_posted_platforms") || "{}");
    } catch {
      return {};
    }
  });

  const shareUrl = "https://fruitee.app/twin/yourhandle";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostTo = (platform) => {
    const updated = { ...postedPlatforms, [platform]: true };
    setPostedPlatforms(updated);
    localStorage.setItem("fruitee_posted_platforms", JSON.stringify(updated));
  };

  const handleGoToDashboard = () => {
    const progress = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
    progress["intro-video"] = true;
    progress.dashboard = true;
    localStorage.setItem("fruitee_influencer_progress", JSON.stringify(progress));
    localStorage.setItem("fruitee_influencer_registered", "true");
    navigate("/dashboard");
  };

  const platforms = [
    {
      key: "instagram",
      label: "Instagram",
      color: "#E4405F",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ),
    },
    {
      key: "tiktok",
      label: "TikTok",
      color: "#000000",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.44a8.16 8.16 0 0 0 3.76.92V6.69z"/>
        </svg>
      ),
    },
    {
      key: "youtube",
      label: "YouTube",
      color: "#FF0000",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/>
        </svg>
      ),
    },
  ];

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-4xl mx-auto" data-testid="digital-twin-intro-page">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full text-teal-600 text-sm font-medium mb-4">
            <Check className="w-4 h-4" />
            Twin Created Successfully!
          </div>
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Meet Your Digital Twin
          </h1>
          <p className="text-muted-foreground">
            Your AI-powered digital twin is ready to connect with your audience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <h2 className="font-outfit text-xl font-semibold mb-4">
              Intro Video Preview
            </h2>

            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1524158572048-994dc70d2b58?w=800&h=450&fit=crop"
                alt="Digital Twin Preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-floating hover:scale-105 transition-transform"
                  data-testid="play-video-btn"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-foreground" />
                  ) : (
                    <Play className="w-8 h-8 text-foreground ml-1" />
                  )}
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300"
                    style={{ width: isPlaying ? "45%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-orange-200 hover:bg-orange-50"
                data-testid="download-video-btn"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white"
                data-testid="share-video-btn"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Share Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h2 className="font-outfit text-xl font-semibold mb-4">
                Share Your Twin
              </h2>
              <p className="text-muted-foreground mb-4">
                Post your intro video to your social media accounts
              </p>

              {/* Share Link */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-muted-foreground truncate">
                  {shareUrl}
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="h-12 px-4 rounded-xl border-orange-200 hover:bg-orange-50"
                  data-testid="copy-link-btn"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-teal-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Social Platform Buttons */}
              <div className="flex gap-3">
                {platforms.map((p) => {
                  const isPosted = !!postedPlatforms[p.key];
                  return (
                    <Button
                      key={p.key}
                      variant="outline"
                      onClick={() => !isPosted && handlePostTo(p.key)}
                      className={`flex-1 h-12 rounded-xl transition-all duration-300 ${
                        isPosted
                          ? "bg-teal-500 border-teal-500 text-white hover:bg-teal-600"
                          : `border-[${p.color}] text-[${p.color}] hover:bg-[${p.color}]/10`
                      }`}
                      style={
                        isPosted
                          ? {}
                          : { borderColor: p.color, color: p.color }
                      }
                      data-testid={`post-${p.key}-btn`}
                    >
                      {isPosted ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Posted
                        </>
                      ) : (
                        <>
                          <span className="mr-2">{p.icon}</span>
                          {p.label}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-6">
              <h3 className="font-outfit font-semibold mb-4">
                What's Next?
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <span>
                    The video will be posted to your accounts, introducing your Twin to your followers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <span>
                    Fruitee will market your profile to businesses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <span>
                    Track your performance on the dashboard
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/digital-twin-progress")}
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            data-testid="back-btn"
          >
            Back
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300"
            data-testid="go-to-dashboard-btn"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DigitalTwinIntroPage;
