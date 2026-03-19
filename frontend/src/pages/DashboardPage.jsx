import React, { useState } from "react";
import { Layout } from "../components/Layout";
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
  Filter,
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

const DashboardPage = () => {
  const [timeFilter, setTimeFilter] = useState("all");

  const stats = [
    {
      title: "Total Reach",
      value: "78.2K",
      change: "+18.3%",
      trend: "up",
      icon: Eye,
      color: "from-orange-400 to-orange-500",
    },
    {
      title: "Followers Gained",
      value: "2,847",
      change: "+12.1%",
      trend: "up",
      icon: Users,
      color: "from-pink-400 to-pink-500",
    },
    {
      title: "Engagement Rate",
      value: "5.6%",
      change: "+0.8%",
      trend: "up",
      icon: Heart,
      color: "from-teal-400 to-teal-500",
    },
    {
      title: "Shares",
      value: "1,234",
      change: "-2.1%",
      trend: "down",
      icon: Share2,
      color: "from-purple-400 to-purple-500",
    },
  ];

  const engagementData = [
    { week: "Week 1", instagram: 2400, twitter: 1800, linkedin: 1200 },
    { week: "Week 2", instagram: 3200, twitter: 2400, linkedin: 1800 },
    { week: "Week 3", instagram: 4800, twitter: 3600, linkedin: 2400 },
    { week: "Week 4", instagram: 5600, twitter: 4200, linkedin: 3000 },
    { week: "Week 5", instagram: 7200, twitter: 4800, linkedin: 3200 },
    { week: "Week 6", instagram: 6400, twitter: 4400, linkedin: 2800 },
  ];

  const reachData = [
    { month: "Jan", reach: 12000 },
    { month: "Feb", reach: 19000 },
    { month: "Mar", reach: 32000 },
    { month: "Apr", reach: 45000 },
    { month: "May", reach: 58000 },
    { month: "Jun", reach: 72000 },
  ];

  const contentTypeData = [
    { name: "Reels", value: 45, color: "#FF6B95" },
    { name: "Posts", value: 30, color: "#FFE66D" },
    { name: "Stories", value: 15, color: "#4ECDC4" },
    { name: "Carousels", value: 10, color: "#FF8A3D" },
  ];

  const topContent = [
    { name: "Reel #1", views: 12500 },
    { name: "Post #3", views: 9800 },
    { name: "Carousel", views: 8200 },
    { name: "Story #5", views: 6500 },
    { name: "Reel #4", views: 5200 },
  ];

  return (
    <Layout userType="business">
      <div className="p-8" data-testid="dashboard-page">
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 h-10 rounded-xl border-gray-200" data-testid="time-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === "up";

            return (
              <div
                key={stat.title}
                className="bg-white rounded-3xl p-6 shadow-soft"
                data-testid={`stat-${stat.title.toLowerCase().replace(" ", "-")}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      isUp ? "text-teal-600" : "text-red-500"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-outfit font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Over Time */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              <h2 className="font-outfit text-xl font-semibold">
                Engagement Over Time
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DDD0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                  />
                  <YAxis
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E6DDD0",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="instagram"
                    stackId="1"
                    stroke="#FF6B95"
                    fill="#FF6B95"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="twitter"
                    stackId="1"
                    stroke="#4ECDC4"
                    fill="#4ECDC4"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="linkedin"
                    stackId="1"
                    stroke="#FFE66D"
                    fill="#FFE66D"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                { name: "Instagram", color: "#FF6B95" },
                { name: "Twitter", color: "#4ECDC4" },
                { name: "LinkedIn", color: "#FFE66D" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reach Growth */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-orange-500" />
              <h2 className="font-outfit text-xl font-semibold">Reach Growth</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reachData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DDD0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                  />
                  <YAxis
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E6DDD0",
                      borderRadius: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="url(#reachGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#FF8A3D", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#FF6B95" }}
                  />
                  <defs>
                    <linearGradient
                      id="reachGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#FF8A3D" />
                      <stop offset="100%" stopColor="#FF6B95" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Type Distribution */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-pink-500" />
              <h2 className="font-outfit text-xl font-semibold">
                Content Type Distribution
              </h2>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E6DDD0",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">
              {contentTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              <h2 className="font-outfit text-xl font-semibold">
                Top Performing Content
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topContent} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E6DDD0"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#888278", fontSize: 12 }}
                    axisLine={{ stroke: "#E6DDD0" }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E6DDD0",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="views"
                    fill="url(#barGradient)"
                    radius={[0, 8, 8, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#FF8A3D" />
                      <stop offset="100%" stopColor="#FF6B95" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
