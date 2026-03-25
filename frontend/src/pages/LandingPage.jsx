import React from "react";
import { useNavigate } from "react-router-dom";
import { FruiteeLogo } from "../components/FruiteeLogo";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="landing-page">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 opacity-30 pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-pink-300 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="fixed bottom-0 left-0 w-96 h-96 opacity-20 pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-300 to-yellow-200 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo — large, above the badge */}
          <div className="mb-4">
            <FruiteeLogo size="hero" className="mx-auto" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft border border-orange-100 mb-3">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Social Media Campaign Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground mb-3">
            Make Social{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent italic">
              Effortless
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Not an AI reel tool — a growth engine
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/signin")}
            className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/30"
            data-testid="get-started-btn"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
