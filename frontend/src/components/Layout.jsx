import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FruiteeLogo } from "./FruiteeLogo";
import {
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
  LogOut,
  Cog,
} from "lucide-react";

const influencerNavItems = [
  { path: "/influencer-profile", label: "Profile", icon: User },
  { path: "/influencer-preferences", label: "Preferences", icon: Settings },
  { path: "/create-digital-twin", label: "Create Twin", icon: Sparkles },
  { path: "/digital-twin-progress", label: "Generation", icon: Loader },
  { path: "/digital-twin-intro", label: "Intro Video", icon: Video },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const businessNavItems = [
  { path: "/profile", label: "Profile", icon: Building2 },
  { path: "/business-preferences", label: "Preferences", icon: Settings },
  { path: "/brands", label: "Brands", icon: Tag },
  { path: "/brand-setup", label: "Brand Setup", icon: Palette },
  { path: "/campaign-type", label: "Campaign Type", icon: Target },
  { path: "/business-plan", label: "Campaign Plan", icon: FileText },
  { path: "/influencers", label: "Influencers", icon: Users },
  { path: "/payment", label: "Payment", icon: CreditCard },
  { path: "/content-plan", label: "Content Plan", icon: Calendar },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export const Layout = ({ children, userType = "business" }) => {
  const location = useLocation();
  const navItems = userType === "influencer" ? influencerNavItems : businessNavItems;
  const settingsPath = userType === "influencer" ? "/influencer-settings" : "/business-settings";
  const isSettingsActive = location.pathname === settingsPath;

  return (
    <div className="min-h-screen bg-background flex" data-testid="app-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-6 flex flex-col" data-testid="sidebar">
        <Link to="/" className="mb-8">
          <FruiteeLogo />
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.path.replace("/", "")}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border">
          <Link
            to="/signin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            data-testid="nav-logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="relative min-h-full">
          {/* Top Right Settings Icon */}
          <div className="fixed top-6 right-8 z-[100]">
            <Link
              to={settingsPath}
              data-testid="settings-icon"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isSettingsActive
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white shadow-soft hover:shadow-md text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cog className="w-5 h-5" />
            </Link>
          </div>

          {/* Decorative watermark */}
          <div className="fixed top-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-500 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
