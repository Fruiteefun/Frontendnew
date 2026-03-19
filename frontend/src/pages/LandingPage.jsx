import React from "react";
import { Link } from "react-router-dom";
import { FruiteeLogo } from "../components/FruiteeLogo";
import {
  LogIn,
  User,
  Sparkles,
  Loader,
  Video,
  LayoutDashboard,
  Building2,
  Settings,
  Tag,
  Palette,
  Target,
  FileText,
  Users,
  CreditCard,
  Calendar,
  ArrowRight,
} from "lucide-react";

const NavigationCard = ({ path, to, icon: Icon, title, subtitle, gradient }) => {
  const linkPath = path || to;
  return (
  <Link
    to={linkPath}
    data-testid={`nav-card-${linkPath.replace("/", "")}`}
    className="group bg-white rounded-3xl border border-orange-50/50 shadow-soft hover:shadow-floating transition-all duration-300 p-6 flex items-center gap-4"
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${gradient}`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="font-outfit font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
  </Link>
  );
};

const LandingPage = () => {
  const influencerFlow = [
    {
      path: "/influencer-profile",
      icon: User,
      title: "Influencer Profile",
      subtitle: "Influencer setup",
      gradient: "bg-gradient-to-br from-orange-400 to-orange-500",
    },
    {
      path: "/create-digital-twin",
      icon: Sparkles,
      title: "Create Digital Twin",
      subtitle: "Upload & record",
      gradient: "bg-gradient-to-br from-pink-400 to-pink-500",
    },
    {
      path: "/digital-twin-progress",
      icon: Loader,
      title: "Twin Generation",
      subtitle: "Processing",
      gradient: "bg-gradient-to-br from-teal-400 to-teal-500",
    },
    {
      path: "/digital-twin-intro",
      icon: Video,
      title: "Intro Video",
      subtitle: "Share your twin",
      gradient: "bg-gradient-to-br from-purple-400 to-purple-500",
    },
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Analytics",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-500",
    },
  ];

  const businessFlow = [
    {
      path: "/profile",
      icon: Building2,
      title: "Business Profile",
      subtitle: "Your details",
      gradient: "bg-gradient-to-br from-orange-400 to-orange-500",
    },
    {
      path: "/business-preferences",
      icon: Settings,
      title: "Business Preferences",
      subtitle: "Campaign settings",
      gradient: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    },
    {
      path: "/brands",
      icon: Tag,
      title: "Brands",
      subtitle: "Manage brands",
      gradient: "bg-gradient-to-br from-pink-400 to-pink-500",
    },
    {
      path: "/brand-setup",
      icon: Palette,
      title: "Brand Setup",
      subtitle: "Assets & colours",
      gradient: "bg-gradient-to-br from-teal-400 to-teal-500",
    },
    {
      path: "/campaign-type",
      icon: Target,
      title: "Campaign Type",
      subtitle: "Choose objective",
      gradient: "bg-gradient-to-br from-red-400 to-red-500",
    },
    {
      path: "/business-plan",
      icon: FileText,
      title: "Campaign Plan",
      subtitle: "Strategy",
      gradient: "bg-gradient-to-br from-purple-400 to-purple-500",
    },
    {
      path: "/influencers",
      icon: Users,
      title: "Influencer Selection",
      subtitle: "Find creators",
      gradient: "bg-gradient-to-br from-indigo-400 to-indigo-500",
    },
    {
      path: "/payment",
      icon: CreditCard,
      title: "Payment",
      subtitle: "Choose plan",
      gradient: "bg-gradient-to-br from-green-400 to-green-500",
    },
    {
      path: "/content-plan",
      icon: Calendar,
      title: "Content",
      subtitle: "Plan posts",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-500",
    },
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
      subtitle: "Analytics",
      gradient: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-64 h-64 opacity-30 pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-pink-300 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="fixed bottom-0 left-0 w-96 h-96 opacity-20 pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-300 to-yellow-200 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <FruiteeLogo size="large" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft border border-orange-100 mb-6">
            <span className="text-lg">🚀</span>
            <span className="text-sm font-medium text-muted-foreground">
              Social Media Campaign Platform
            </span>
          </div>
          <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground mb-4">
            Make Social{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent italic">
              Effortless
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Navigate through all screens below
          </p>
        </header>

        {/* Sign In Card */}
        <div className="mb-12">
          <NavigationCard
            to="/signin"
            icon={LogIn}
            title="Sign In / Sign Up"
            subtitle="Authentication"
            gradient="bg-gradient-to-br from-orange-400 to-pink-500"
          />
        </div>

        {/* Influencer Flow */}
        <section className="mb-12">
          <h2 className="font-outfit text-xl font-semibold text-muted-foreground mb-6">
            Influencer Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {influencerFlow.map((item) => (
              <NavigationCard key={item.path} {...item} />
            ))}
          </div>
        </section>

        {/* Business Flow */}
        <section>
          <h2 className="font-outfit text-xl font-semibold text-muted-foreground mb-6">
            Business Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessFlow.map((item) => (
              <NavigationCard key={item.path} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
