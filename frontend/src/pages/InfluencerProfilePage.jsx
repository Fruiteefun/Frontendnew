import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Camera, ArrowRight } from "lucide-react";
import { isNotEmpty, isMinAge, isValidHandle, isValidDate } from "../lib/validation";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const InfluencerProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  const initialFullName = location.state?.fullName || "";

  const [formData, setFormData] = useState({
    displayName: "",
    fullName: initialFullName,
    dateOfBirth: "",
    gender: "",
    language: "",
    country: "",
    city: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!isNotEmpty(formData.displayName)) e.displayName = "Display name is required";
    if (!isNotEmpty(formData.fullName)) e.fullName = "Full name is required";
    if (!isNotEmpty(formData.dateOfBirth)) {
      e.dateOfBirth = "Date of birth is required";
    } else if (!isValidDate(formData.dateOfBirth)) {
      e.dateOfBirth = "Please enter a valid date (year between 1900-2100)";
    } else if (!isMinAge(formData.dateOfBirth, 16)) {
      e.dateOfBirth = "You must be at least 16 years old to use Fruitee";
    }
    if (!isNotEmpty(formData.gender)) e.gender = "Please select your gender";
    if (!isNotEmpty(formData.language)) e.language = "Please select a language";
    if (!isNotEmpty(formData.country)) e.country = "Please select a country";
    if (!isNotEmpty(formData.city)) e.city = "City is required";
    if (formData.instagram && !isValidHandle(formData.instagram)) e.instagram = "Invalid handle format";
    if (formData.tiktok && !isValidHandle(formData.tiktok)) e.tiktok = "Invalid handle format";
    if (formData.youtube && !isValidHandle(formData.youtube)) e.youtube = "Invalid handle format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Mark profile stage as complete
    const progress = JSON.parse(localStorage.getItem("fruitee_influencer_progress") || "{}");
    progress.profile = true;
    localStorage.setItem("fruitee_influencer_progress", JSON.stringify(progress));
    navigate("/influencer-preferences");
  };

  // Max date = 16 years ago from today
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <Layout userType="influencer">
      <div className="p-8 max-w-2xl mx-auto" data-testid="influencer-profile-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Profile Setup
          </h1>
          <p className="text-muted-foreground">
            Set up your influencer profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`w-32 h-32 rounded-full border-4 border-dashed border-orange-200 flex items-center justify-center overflow-hidden bg-muted ${
                  profileImage ? "border-solid border-orange-400" : ""
                }`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="profile-image-input"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Select Image</p>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="@yourhandle"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.displayName ? "border-red-400" : ""}`}
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  data-testid="display-name-input"
                />
                <FieldError message={errors.displayName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.fullName ? "border-red-400" : ""}`}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  data-testid="full-name-input"
                />
                <FieldError message={errors.fullName} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  max={maxDateStr}
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.dateOfBirth ? "border-red-400" : ""}`}
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val) {
                      const parts = val.split("-");
                      if (parts[0] && parts[0].length > 4) {
                        parts[0] = parts[0].slice(0, 4);
                        val = parts.join("-");
                      }
                    }
                    setFormData({ ...formData, dateOfBirth: val });
                  }}
                  data-testid="dob-input"
                />
                <FieldError message={errors.dateOfBirth} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger className={`h-12 rounded-xl border-gray-200 bg-white/50 ${errors.gender ? "border-red-400" : ""}`} data-testid="gender-select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.gender} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger className={`h-12 rounded-xl border-gray-200 bg-white/50 ${errors.language ? "border-red-400" : ""}`} data-testid="language-select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.language} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger className={`h-12 rounded-xl border-gray-200 bg-white/50 ${errors.country ? "border-red-400" : ""}`} data-testid="country-select">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.country} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="New York"
                className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.city ? "border-red-400" : ""}`}
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                data-testid="city-input"
              />
              <FieldError message={errors.city} />
            </div>
          </div>

          {/* Connect Social Media */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              Connect to your social media
            </h2>
            <p className="text-sm text-muted-foreground">Link your accounts to verify your reach</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Instagram", gradient: "from-purple-500 via-pink-500 to-orange-400", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { name: "TikTok", gradient: "from-gray-800 to-black", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.44a8.16 8.16 0 0 0 3.76.92V6.69z"/></svg> },
                { name: "YouTube", gradient: "from-red-500 to-red-600", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/></svg> },
                { name: "TikTok Shop", gradient: "from-teal-500 to-teal-600", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.44a8.16 8.16 0 0 0 3.76.92V6.69z"/></svg> },
              ].map((platform) => (
                <Button
                  key={platform.name}
                  type="button"
                  className={`h-14 rounded-xl bg-gradient-to-r ${platform.gradient} text-white font-medium flex items-center gap-3 justify-center hover:opacity-90 transition-all`}
                  data-testid={`connect-${platform.name.toLowerCase().replace(/\s/g, '-')}-btn`}
                >
                  {platform.icon}
                  Connect {platform.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/signin")}
              data-testid="back-btn"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="continue-btn"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default InfluencerProfilePage;
