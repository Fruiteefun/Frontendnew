import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Eye,
  Users,
  Heart,
  Share2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { influencerMetricsApi, influencerMetricsApi as metricsApi } from "../lib/api";

const DashboardPage = () => {
  const userType = localStorage.getItem("userRole") || "business";
  const [periodFilter, setPeriodFilter] = useState("last-month");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (userType === "influencer") {
          const [metricsRes, campaignsRes] = await Promise.all([
            influencerMetricsApi.get(),
            influencerMetricsApi.getCampaigns(1, 20),
          ]);
          if (metricsRes.success) setMetrics(metricsRes.data);
          if (campaignsRes.success) setCampaigns(campaignsRes.data?.result || []);
        }
      } catch { /* network error */ }
      setLoading(false);
    };
    loadDashboardData();
  }, [userType]);

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const stats = metrics
    ? [
        {
          title: "Total Views",
          value: formatNumber(metrics.total_views),
          icon: Eye,
          color: "from-orange-400 to-orange-500",
        },
        {
          title: "Total Likes",
          value: formatNumber(metrics.total_likes),
          icon: Heart,
          color: "from-pink-400 to-pink-500",
        },
        {
          title: "Engagement Rate",
          value: `${(metrics.total_engagement_rate || 0).toFixed(1)}%`,
          icon: TrendingUp,
          color: "from-teal-400 to-teal-500",
        },
        {
          title: "Total Revenue",
          value: `£${(metrics.total_revenue || 0).toLocaleString()}`,
          icon: DollarSign,
          color: "from-green-400 to-green-500",
        },
      ]
    : [];

  const secondaryStats = metrics
    ? [
        { title: "Comments", value: formatNumber(metrics.total_comments), icon: Share2, color: "from-purple-400 to-purple-500" },
        { title: "Shares", value: formatNumber(metrics.total_shares), icon: Users, color: "from-blue-400 to-blue-500" },
        { title: "Saves", value: formatNumber(metrics.total_saves), icon: BarChart3, color: "from-yellow-400 to-yellow-500" },
        { title: "Campaigns", value: metrics.num_of_campaigns || 0, icon: TrendingUp, color: "from-indigo-400 to-indigo-500" },
      ]
    : [];

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
      <div className="p-8 pr-24" data-testid="dashboard-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your social media performance in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Period:</Label>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-40 h-10 rounded-xl border-gray-200 bg-white" data-testid="period-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-3xl p-6 shadow-soft"
                data-testid={`stat-${stat.title.toLowerCase().replace(/ /g, "-")}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-outfit font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {secondaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-2xl p-4 shadow-soft flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-outfit font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <h2 className="font-outfit text-xl font-semibold mb-4">Your Campaigns</h2>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">No campaigns yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your campaign activity and performance metrics will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign, i) => (
                <div key={campaign.id || i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground">{campaign.name || `Campaign ${i + 1}`}</p>
                    <p className="text-sm text-muted-foreground">{campaign.status || "Active"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatNumber(campaign.total_views || 0)} views</p>
                    <p className="text-sm text-muted-foreground">{(campaign.engagement_rate || 0).toFixed(1)}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
