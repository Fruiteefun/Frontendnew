import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Rocket,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { campaignsApi } from "../lib/api";

const ContentPlanPage = () => {
  const userType = localStorage.getItem("userRole") || "business";
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const campaignId = localStorage.getItem("fruitee_activeCampaignId") || "";

  useEffect(() => {
    const loadContentPlan = async () => {
      if (!campaignId) { setLoading(false); return; }
      try {
        const res = await campaignsApi.getContentPlan(campaignId);
        if (res.success && res.data) {
          const items = (res.data.items || res.data.contents || res.data || []);
          if (Array.isArray(items)) {
            setContentItems(items.map((item) => ({
              date: item.scheduled_date ? new Date(item.scheduled_date).getDate() : item.date,
              type: item.content_type || item.type || "post",
              title: item.title || item.caption || "Untitled",
              time: item.scheduled_time || item.time || "",
              status: item.status || "draft",
            })));
          }
        }
      } catch { /* no content plan yet */ }
      setLoading(false);
    };
    loadContentPlan();
  }, [campaignId]);

  const handleGenerate = async () => {
    if (!campaignId) return;
    setGenerating(true);
    try {
      await campaignsApi.generateContentPlan(campaignId);
      // Reload the content plan
      const res = await campaignsApi.getContentPlan(campaignId);
      if (res.success && res.data) {
        const items = (res.data.items || res.data.contents || res.data || []);
        if (Array.isArray(items)) {
          setContentItems(items.map((item) => ({
            date: item.scheduled_date ? new Date(item.scheduled_date).getDate() : item.date,
            type: item.content_type || item.type || "post",
            title: item.title || item.caption || "Untitled",
            time: item.scheduled_time || item.time || "",
            status: item.status || "draft",
          })));
        }
      }
    } catch { /* generation may take time */ }
    setGenerating(false);
  };

  const handleStartCampaign = async () => {
    if (!campaignId) return;
    try {
      await campaignsApi.start(campaignId);
      navigate("/dashboard");
    } catch { /* ignore */ }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "draft": return "bg-yellow-100 text-yellow-700";
      case "generated": case "completed": return "bg-teal-100 text-teal-700";
      case "generating": case "processing": return "bg-orange-100 text-orange-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => type === "post" ? "bg-yellow-400" : "bg-pink-400";

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const navigateMonth = (direction) => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  if (loading) {
    return (
      <Layout userType={userType}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType={userType}>
      <div className="p-8" data-testid="content-plan-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">Content Plan</h1>
            <p className="text-muted-foreground">Plan your posts and reels for the month</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateMonth(-1)} className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-muted transition-colors" data-testid="prev-month-btn">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-outfit text-xl font-semibold min-w-[180px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={() => navigateMonth(1)} className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center hover:bg-muted transition-colors" data-testid="next-month-btn">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden mb-8">
          <div className="grid grid-cols-7 border-b border-gray-100">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-4 text-center text-sm font-medium text-muted-foreground">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[140px] p-2 bg-muted/20 border-b border-r border-gray-50" />
            ))}
            {days.map((day) => {
              const content = contentItems.find((item) => item.date === day);
              return (
                <div key={day} className="min-h-[140px] p-2 border-b border-r border-gray-50 hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">{day}</span>
                  {content && (
                    <div className={`mt-2 p-2 rounded-xl ${content.type === "post" ? "bg-yellow-50" : "bg-pink-50"}`} data-testid={`content-item-${day}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getTypeColor(content.type)}`} />
                        <span className="text-xs font-medium uppercase">{content.type}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">{content.title}</p>
                      {content.time && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />{content.time}
                        </div>
                      )}
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(content.status)}`}>
                        {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {contentItems.length === 0 && (
          <div className="text-center py-8 mb-8 bg-white rounded-3xl shadow-soft">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No content planned yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {campaignId ? "Click 'Generate Content Plan' to auto-create your content schedule" : "Create a campaign first to start planning content"}
            </p>
          </div>
        )}

        {/* Legend & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span className="text-sm text-muted-foreground">Post</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-400" /><span className="text-sm text-muted-foreground">Reel</span></div>
          </div>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" className="h-12 px-6 rounded-xl border-gray-200 hover:bg-muted" onClick={() => navigate(-1)} data-testid="back-btn">
              <ArrowLeft className="w-5 h-5 mr-2" />Back
            </Button>
            {campaignId && (
              <Button onClick={handleGenerate} disabled={generating} className="h-12 px-6 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-90 text-white font-semibold" data-testid="generate-content-btn">
                {generating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {generating ? "Generating..." : "Generate Content Plan"}
              </Button>
            )}
            {contentItems.length > 0 && (
              <Button onClick={handleStartCampaign} className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-semibold shadow-lg shadow-green-500/20" data-testid="start-campaign-btn">
                <Rocket className="w-5 h-5 mr-2" />Start Campaign
              </Button>
            )}
            <Button onClick={() => navigate("/dashboard")} className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20" data-testid="continue-dashboard-btn">
              Continue to Dashboard<ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContentPlanPage;
