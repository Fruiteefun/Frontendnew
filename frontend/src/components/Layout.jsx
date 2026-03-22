import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FruiteeLogo } from "./FruiteeLogo";
import {
  User,
  Sparkles,
  Loader,
  Video,
  LayoutDashboard,
  Settings,
  Tag,
  LogOut,
  Cog,
  CheckCircle2,
  Lock,
  Pencil,
} from "lucide-react";

// Registration flow stages (in order)
const influencerRegStages = [
  { key: "profile", path: "/influencer-profile", label: "Profile", icon: User },
  { key: "preferences", path: "/influencer-preferences", label: "Preferences", icon: Settings },
  { key: "create-twin", path: "/create-digital-twin", label: "Create Twin", icon: Sparkles },
  { key: "generation", path: "/digital-twin-progress", label: "Generation", icon: Loader },
  { key: "intro-video", path: "/digital-twin-intro", label: "Intro Video", icon: Video },
  { key: "dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

// Post-registration (signed-in) nav
const influencerSignedInNav = [
  { path: "/influencer-profile", label: "Edit Profile", icon: Pencil },
  { path: "/influencer-preferences", label: "Edit Preferences", icon: Pencil },
  { path: "/create-digital-twin", label: "Edit Twin", icon: Pencil },
  { path: "/digital-twin-progress", label: "Twin Generation", icon: Loader },
  { path: "/digital-twin-intro", label: "Intro Video", icon: Video },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

// Business nav — always the same two top-level items
const businessNav = [
  { path: "/profile", label: "Edit Business Profile", icon: Pencil },
  { path: "/brands", label: "Brands", icon: Tag },
];

function getInfluencerProgress() {
  try {
    return JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
  } catch {
    return {};
  }
}

function isInfluencerRegistered() {
  return localStorage.getItem("fruitee_influencer_registered") === "true";
}

export const Layout = ({ children, userType = "business" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isInfluencer = userType === "influencer";
  const registered = isInfluencer && isInfluencerRegistered();
  const progress = isInfluencer ? getInfluencerProgress() : {};

  const settingsPath = isInfluencer ? "/influencer-settings" : "/business-settings";
  const isSettingsActive = location.pathname === settingsPath;

  // Determine which stage index is accessible (first incomplete)
  const getMaxAccessibleIndex = () => {
    for (let i = 0; i < influencerRegStages.length; i++) {
      if (!progress[influencerRegStages[i].key]) return i;
    }
    return influencerRegStages.length - 1;
  };

  const renderInfluencerRegistrationNav = () => {
    const maxIdx = getMaxAccessibleIndex();
    const currentPath = location.pathname;

    return influencerRegStages.map((stage, idx) => {
      const Icon = stage.icon;
      const isCompleted = !!progress[stage.key];
      const isActive = currentPath === stage.path;
      const isLocked = idx > maxIdx;

      const handleClick = (e) => {
        if (isLocked) {
          e.preventDefault();
        }
      };

      return (
        <Link
          key={stage.path}
          to={isLocked ? "#" : stage.path}
          onClick={handleClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-500/20"
              : isCompleted
              ? "text-teal-600 hover:bg-teal-50"
              : isLocked
              ? "text-gray-300 cursor-not-allowed"
              : "text-muted-foreground hover:bg-orange-50 hover:text-foreground"
          }`}
          data-testid={`nav-${stage.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {isCompleted && !isActive ? (
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
          {stage.label}
        </Link>
      );
    });
  };

  const renderSignedInInfluencerNav = () => {
    return influencerSignedInNav.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-500/20"
              : "text-muted-foreground hover:bg-orange-50 hover:text-foreground"
          }`}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <Icon className="w-4 h-4" />
          {item.label}
        </Link>
      );
    });
  };

  const renderBusinessNav = () => {
    return businessNav.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-500/20"
              : "text-muted-foreground hover:bg-orange-50 hover:text-foreground"
          }`}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <Icon className="w-4 h-4" />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-background" data-testid="layout">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white/60 backdrop-blur-lg border-r border-orange-100/50 flex flex-col fixed h-full z-50">
        <div className="p-4">
          <Link to="/" data-testid="logo-link">
            <FruiteeLogo size="small" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {isInfluencer
            ? registered
              ? renderSignedInInfluencerNav()
              : renderInfluencerRegistrationNav()
            : renderBusinessNav()}
        </nav>

        <div className="p-3 border-t border-orange-100/50">
          <Link
            to="/signin"
            onClick={() => {
              localStorage.removeItem("fruitee_influencer_registered");
              localStorage.removeItem("fruitee_influencer_progress");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[200px] min-h-screen relative">
        {/* Settings Icon */}
        <Link
          to={settingsPath}
          className={`fixed top-4 right-6 z-[100] w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isSettingsActive
              ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md"
              : "bg-white/80 text-muted-foreground hover:bg-white hover:text-foreground shadow-soft"
          }`}
          data-testid="settings-icon"
        >
          <Cog className="w-5 h-5" />
        </Link>

        {children}
      </main>
    </div>
  );
};

export default Layout;
