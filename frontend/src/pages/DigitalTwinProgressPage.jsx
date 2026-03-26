import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Loader2, Sparkles, Brain, Video, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { userApi } from "../lib/api";

const DigitalTwinProgressPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [allComplete, setAllComplete] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { icon: Sparkles, label: "Analyzing photo...", completeLabel: "Photo analyzed", key: "clone_job_status" },
    { icon: Brain, label: "Processing voice patterns...", completeLabel: "Voice patterns processed", key: "voice_job_status" },
    { icon: Video, label: "Generating avatar video...", completeLabel: "Avatar video generated", key: "avatar_video_job_status" },
    { icon: Check, label: "Finalizing...", completeLabel: "Complete", key: null },
  ];

  useEffect(() => {
    let interval;
    const pollStatus = async () => {
      try {
        const res = await userApi.getMe();
        if (!res.success || !res.data) return;

        const profile = res.data.influencer_profile || {};
        const cloneStatus = profile.clone_job_status || "pending";
        const voiceStatus = profile.voice_job_status || "pending";
        const videoStatus = profile.avatar_video_job_status || "pending";

        // Determine step and progress
        let step = 0;
        let pct = 10;

        if (cloneStatus === "completed" || cloneStatus === "complete") {
          step = 1;
          pct = 33;
        }
        if (voiceStatus === "completed" || voiceStatus === "complete") {
          step = 2;
          pct = 66;
        }
        if (videoStatus === "completed" || videoStatus === "complete") {
          step = 4;
          pct = 100;
          setAllComplete(true);
          clearInterval(interval);
        }

        // Handle processing states
        if (cloneStatus === "processing") { step = 0; pct = 20; }
        if (voiceStatus === "processing") { step = 1; pct = 50; }
        if (videoStatus === "processing") { step = 2; pct = 80; }

        // Handle failure
        if (cloneStatus === "failed") { setError("Photo analysis failed. Please try uploading again."); clearInterval(interval); return; }
        if (voiceStatus === "failed") { setError("Voice processing failed. Please try recording again."); clearInterval(interval); return; }
        if (videoStatus === "failed") { setError("Video generation failed. Please try again."); clearInterval(interval); return; }

        setCurrentStep(step);
        setProgress(pct);
      } catch {
        // Network error — keep polling
      }
    };

    // Initial check
    pollStatus();
    // Poll every 5 seconds
    interval = setInterval(pollStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout userType="influencer">
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]" data-testid="digital-twin-progress-page">
        <div className="w-full max-w-lg text-center">
          {/* Animated Logo */}
          <div className="mb-8">
            <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30 ${
              !allComplete ? "animate-pulse" : ""
            }`}>
              {allComplete ? (
                <Check className="w-12 h-12 text-white" />
              ) : (
                <Sparkles className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            {allComplete ? "Your Twin is Ready!" : "Creating Your Digital Twin"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {allComplete
              ? "Your digital twin has been successfully created"
              : "Please wait while we process your photo and voice..."}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm" data-testid="progress-error">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-3 rounded-full bg-gray-100" />
            <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
          </div>

          {/* Steps */}
          <div className="space-y-4 text-left mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep && !allComplete;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                    isComplete
                      ? "bg-teal-50"
                      : isCurrent
                      ? "bg-orange-50"
                      : "bg-gray-50 opacity-50"
                  }`}
                  data-testid={`step-${index}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isComplete
                        ? "bg-teal-500"
                        : isCurrent
                        ? "bg-gradient-to-r from-orange-400 to-pink-500"
                        : "bg-gray-200"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <StepIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isComplete
                        ? "text-teal-700"
                        : isCurrent
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

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/create-digital-twin")}
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {allComplete && (
              <Button
                onClick={() => navigate("/digital-twin-intro")}
                className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20 transition-all duration-300"
                data-testid="continue-btn"
              >
                View Your Twin
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            {error && (
              <Button
                onClick={() => navigate("/create-digital-twin")}
                className="h-14 px-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg shadow-orange-500/20"
                data-testid="retry-btn"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DigitalTwinProgressPage;
