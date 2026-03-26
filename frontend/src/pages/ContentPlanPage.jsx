import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  FileText,
  Video,
  Clock,
  Sparkles,
  Rocket,
} from "lucide-react";

const ContentPlanPage = () => {
  const userType = localStorage.getItem("userRole") || "business";
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026

  const contentItems = [
    {
      date: 3,
      type: "post",
      title: "Product Launch Banner",
      time: "9:00 AM",
      status: "draft",
    },
    {
      date: 5,
      type: "reel",
      title: "Behind the Scenes Story",
      time: "2:00 PM",
      status: "draft",
    },
    {
      date: 8,
      type: "post",
      title: "Customer Testimonial",
      time: "11:00 AM",
      status: "generated",
    },
    {
      date: 10,
      type: "reel",
      title: "Industry Tips Thread",
      time: "10:00 AM",
      status: "generating",
    },
    {
      date: 12,
      type: "post",
      title: "Weekend Sale Promo",
      time: "8:00 AM",
      status: "draft",
    },
    {
      date: 15,
      type: "reel",
      title: "New Feature Announcement",
      time: "3:00 PM",
      status: "failed",
    },
    {
      date: 18,
      type: "post",
      title: "Team Spotlight Photo",
      time: "12:00 PM",
      status: "draft",
    },
    {
      date: 20,
      type: "reel",
      title: "Weekly Recap Carousel",
      time: "5:00 PM",
      status: "generated",
    },
    {
      date: 22,
      type: "post",
      title: "Infographic: ROI Tips",
      time: "10:00 AM",
      status: "draft",
    },
    {
      date: 25,
      type: "reel",
      title: "Community Q&A",
      time: "1:00 PM",
      status: "draft",
    },
    {
      date: 28,
      type: "post",
      title: "Month-End Celebration",
      time: "4:00 PM",
      status: "draft",
    },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "generated":
        return "bg-teal-100 text-teal-700";
      case "generating":
        return "bg-orange-100 text-orange-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => {
    return type === "post" ? "bg-yellow-400" : "bg-pink-400";
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <Layout userType={userType}>
      <div className="p-8" data-testid="content-plan-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
              Content Plan
            </h1>
            <p className="text-muted-foreground">
              Plan your posts and reels for the month
            </p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
              data-testid="prev-month-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-outfit text-xl font-semibold min-w-[180px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
              data-testid="next-month-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden mb-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="py-4 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty days */}
            {emptyDays.map((_, index) => (
              <div
                key={`empty-${index}`}
                className="min-h-[140px] p-2 bg-muted/20 border-b border-r border-gray-50"
              />
            ))}

            {/* Actual days */}
            {days.map((day) => {
              const content = contentItems.find((item) => item.date === day);

              return (
                <div
                  key={day}
                  className="min-h-[140px] p-2 border-b border-r border-gray-50 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {day}
                  </span>

                  {content && (
                    <div
                      className={`mt-2 p-2 rounded-xl ${
                        content.type === "post"
                          ? "bg-yellow-50"
                          : "bg-pink-50"
                      }`}
                      data-testid={`content-item-${day}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getTypeColor(
                            content.type
                          )}`}
                        />
                        <span className="text-xs font-medium uppercase">
                          {content.type}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {content.time}
                      </div>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                          content.status
                        )}`}
                      >
                        {content.status.charAt(0).toUpperCase() +
                          content.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground">Post</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400" />
              <span className="text-sm text-muted-foreground">Reel</span>
            </div>
            <div className="border-l border-gray-200 h-6 mx-2" />
            <div className="flex items-center gap-4">
              {["draft", "generated", "generating", "failed"].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                      status
                    )}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 rounded-xl border-gray-200 hover:bg-muted"
              onClick={() => navigate("/payment")}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-90 text-white font-semibold"
              data-testid="generate-content-btn"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate All Content
            </Button>
            <Button
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-semibold shadow-lg shadow-green-500/20"
              data-testid="start-campaign-btn"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Campaign
            </Button>
            <Button
              onClick={() => navigate("/brand-campaigns")}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20"
              data-testid="continue-dashboard-btn"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentPlanPage;
