import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";

// Influencer Pages
import InfluencerProfilePage from "./pages/InfluencerProfilePage";
import InfluencerPreferencesPage from "./pages/InfluencerPreferencesPage";
import CreateDigitalTwinPage from "./pages/CreateDigitalTwinPage";
import DigitalTwinProgressPage from "./pages/DigitalTwinProgressPage";
import DigitalTwinIntroPage from "./pages/DigitalTwinIntroPage";
import InfluencerSettingsPage from "./pages/InfluencerSettingsPage";

// Business Pages
import BusinessProfilePage from "./pages/BusinessProfilePage";
import BusinessPreferencesPage from "./pages/BusinessPreferencesPage";
import BrandsPage from "./pages/BrandsPage";
import BrandSetupPage from "./pages/BrandSetupPage";
import CampaignTypePage from "./pages/CampaignTypePage";
import BusinessPlanPage from "./pages/BusinessPlanPage";
import InfluencersPage from "./pages/InfluencersPage";
import PaymentPage from "./pages/PaymentPage";
import ContentPlanPage from "./pages/ContentPlanPage";
import BusinessSettingsPage from "./pages/BusinessSettingsPage";

// Shared Pages
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div className="App min-h-screen bg-background">
      <BrowserRouter>
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Influencer Flow */}
          <Route path="/influencer-profile" element={<InfluencerProfilePage />} />
          <Route path="/influencer-preferences" element={<InfluencerPreferencesPage />} />
          <Route path="/create-digital-twin" element={<CreateDigitalTwinPage />} />
          <Route path="/digital-twin-progress" element={<DigitalTwinProgressPage />} />
          <Route path="/digital-twin-intro" element={<DigitalTwinIntroPage />} />
          <Route path="/influencer-settings" element={<InfluencerSettingsPage />} />

          {/* Business Flow */}
          <Route path="/profile" element={<BusinessProfilePage />} />
          <Route path="/business-preferences" element={<BusinessPreferencesPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand-setup" element={<BrandSetupPage />} />
          <Route path="/campaign-type" element={<CampaignTypePage />} />
          <Route path="/business-plan" element={<BusinessPlanPage />} />
          <Route path="/influencers" element={<InfluencersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/content-plan" element={<ContentPlanPage />} />
          <Route path="/business-settings" element={<BusinessSettingsPage />} />

          {/* Shared */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
