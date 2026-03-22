import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Progress } from "../components/ui/progress";
import { Loader2, Sparkles, Brain, Video, Check } from "lucide-react";

const DigitalTwinProgressPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Sparkles, label: "Analyzing photo...", duration: 3 },
    { icon: Brain, label: "Processing voice patterns...", duration: 4 },
    { icon: Video, label: "Generating digital twin...", duration: 5 },
    { icon: Check, label: "Finalizing...", duration: 2 },
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      elapsed += 0.1;
      const progressPercent = (elapsed / totalDuration) * 100;
      setProgress(Math.min(progressPercent, 100));

      // Calculate current step
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (elapsed < accumulatedTime) {
          stepIndex = i;
          break;
        }
        if (i === steps.length - 1) {
          stepIndex = steps.length - 1;
        }
      }
      setCurrentStep(stepIndex);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(() => {
          const progress = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
          progress.generation = true;
          localStorage.setItem("fruitee_influencer_progress", JSON.stringify(progress));
          navigate("/digital-twin-intro");
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Layout userType="influencer">
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]" data-testid="digital-twin-progress-page">
        <div className="max-w-lg w-full text-center">
          {/* Animated Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse opacity-20" />
            <div className="absolute inset-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.2s" }} />
            <div className="absolute inset-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-outfit text-3xl font-bold text-foreground mb-2">
            Creating Your Digital Twin
          </h1>
          <p className="text-muted-foreground mb-8">
            This may take a few moments...
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
                const isActive = index === currentStep;
                const isComplete = index < currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-50 to-pink-50"
                        : ""
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
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DigitalTwinProgressPage;
