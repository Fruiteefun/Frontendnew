import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Play, Pause, Share2, Download, Copy, Check, ArrowRight } from "lucide-react";

const DigitalTwinIntroPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://fruitee.app/twin/yourhandle";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden mb-4">
              {/* Placeholder image */}
              <img
                src="https://images.unsplash.com/photo-1524158572048-994dc70d2b58?w=800&h=450&fit=crop"
                alt="Digital Twin Preview"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Play Button Overlay */}
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

              {/* Video Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300"
                    style={{ width: isPlaying ? "45%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Video Controls */}
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
                Copy your unique link to share your digital twin with your audience
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

              {/* Social Share Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F]/10"
                >
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-[#000000] text-[#000000] hover:bg-[#000000]/10"
                >
                  TikTok
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]/10"
                >
                  YouTube
                </Button>
              </div>
            </div>

            {/* Stats Preview */}
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
            onClick={() => {
              const progress = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
              progress["intro-video"] = true;
              progress.dashboard = true;
              localStorage.setItem("fruitee_influencer_progress", JSON.stringify(progress));
              localStorage.setItem("fruitee_influencer_registered", "true");
              navigate("/dashboard");
            }}
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
