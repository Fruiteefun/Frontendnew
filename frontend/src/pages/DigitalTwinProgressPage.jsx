import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Loader2, Sparkles, Brain, Video, Check, ArrowRight } from "lucide-react";

const DigitalTwinProgressPage = () => {
  const navigate = useNavigate();
  const isRegistered = localStorage.getItem("fruitee_influencer_registered") === "true";
  const isRegenerating = localStorage.getItem("fruitee_twin_regenerating") === "true";

  // If returning user and NOT regenerating → static complete view
  const showStatic = isRegistered && !isRegenerating;

  const [progress, setProgress] = useState(showStatic ? 100 : 0);
  const [currentStep, setCurrentStep] = useState(showStatic ? 4 : 0);

  const steps = [
    { icon: Sparkles, label: "Analyzing photo...", completeLabel: "Photo analyzed" },
    { icon: Brain, label: "Processing voice patterns...", completeLabel: "Voice patterns processed" },
    { icon: Video, label: "Generating digital twin...", completeLabel: "Digital twin generated" },
    { icon: Check, label: "Finalizing...", completeLabel: "Complete" },
  ];

  const stepDurations = [3, 4, 5, 2];

  useEffect(() => {
    if (showStatic) return;

    const totalDuration = stepDurations.reduce((a, b) => a + b, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 0.1;
      const progressPercent = (elapsed / totalDuration) * 100;
      setProgress(Math.min(progressPercent, 100));

      let accumulatedTime = 0;
      let stepIndex = 0;
      for (let i = 0; i < stepDurations.length; i++) {
        accumulatedTime += stepDurations[i];
        if (elapsed < accumulatedTime) {
          stepIndex = i;
          break;
        }
        if (i === stepDurations.length - 1) stepIndex = stepDurations.length;
      }
      setCurrentStep(stepIndex);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        // Clear regenerating flag
        localStorage.removeItem("fruitee_twin_regenerating");
        // Mark generation complete
        const prog = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
        prog.generation = true;
        localStorage.setItem("fruitee_influencer_progress", JSON.stringify(prog));
        // Reset posted platforms since this is a new/regenerated twin
        localStorage.removeItem("fruitee_posted_platforms");
        setTimeout(() => navigate("/digital-twin-intro"), 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigate, showStatic]);

  return (
    <Layout userType="influencer">
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]" data-testid="digital-twin-progress-page">
        <div className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {showStatic ? (
              <div className="absolute inset-0 bg-teal-500 rounded-full flex items-center justify-center">
                <Check className="w-14 h-14 text-white" />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse opacity-20" />
                <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.2s" }} />
                <div className="absolute inset-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-outfit text-3xl font-bold text-foreground mb-2">
            {showStatic ? "Digital Twin Ready" : "Creating Your Digital Twin"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {showStatic
              ? "Your digital twin has been generated successfully"
              : "This may take a few moments..."}
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-3 bg-muted" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = showStatic ? true : index < currentStep;
                const isActive = !showStatic && index === currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      isActive ? "bg-gradient-to-r from-orange-50 to-pink-50" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isComplete
                          ? "bg-teal-500"
                          : isActive
                          ? "bg-gradient-to-r from-orange-400 to-pink-500"
                          : "bg-muted"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : isActive ? (
                        <Icon className="w-5 h-5 text-white animate-pulse" />
                      ) : (
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <span
                      className={`font-medium transition-all duration-300 ${
                        isComplete
                          ? "text-teal-600"
                          : isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isComplete ? step.completeLabel : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation for static view */}
          {showStatic && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => navigate("/digital-twin-intro")}
                className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
                data-testid="view-intro-btn"
              >
                View Intro Video
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DigitalTwinProgressPage;
