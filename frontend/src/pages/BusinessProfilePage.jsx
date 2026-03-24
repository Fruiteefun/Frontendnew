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
import { Upload, ArrowRight, X, Globe, MapPin, Phone, Building2, Save, ArrowLeft } from "lucide-react";
import { isNotEmpty, isValidUrl, isValidPhone, isValidHandle } from "../lib/validation";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});

  const initialPhone = location.state?.phone || "";
  const initialName = location.state?.fullName || "";

  const [formData, setFormData] = useState({
    contactName: initialName,
    businessName: "",
    website: "https://",
    tiktokShop: "",
    country: "",
    city: "",
    phone: initialPhone,
    instagram: "",
    twitter: "",
    tiktok: "",
    youtube: "",
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!isNotEmpty(formData.businessName)) e.businessName = "Business name is required";
    if (formData.website && !isValidUrl(formData.website)) e.website = "Please enter a valid URL (https://...)";
    if (formData.phone && !isValidPhone(formData.phone)) e.phone = "Please enter a valid phone number";
    if (formData.instagram && !isValidHandle(formData.instagram)) e.instagram = "Invalid handle format";
    if (formData.tiktokShop && !isValidHandle(formData.tiktokShop)) e.tiktokShop = "Invalid handle format";
    if (formData.tiktok && !isValidHandle(formData.tiktok)) e.tiktok = "Invalid handle format";
    if (formData.youtube && !isValidHandle(formData.youtube)) e.youtube = "Invalid handle format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate("/brands");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="business-profile-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Business Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about your business to personalize your campaigns
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden ${
                    logo
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-gradient-to-br from-orange-100 to-pink-100"
                  }`}
                >
                  {logo ? (
                    <>
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setLogo(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-orange-400">F</span>
                  )}
                </div>
                <label
                  htmlFor="logo-upload"
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    data-testid="logo-upload-input"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Upload Business Logo</h3>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              Business Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Doe"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  data-testid="contact-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Fruitee Inc."
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.businessName ? "border-red-400" : ""}`}
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  data-testid="business-name-input"
                />
                <FieldError message={errors.businessName} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://fruitee.fun"
                    className={`h-12 pl-10 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.website ? "border-red-400" : ""}`}
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    data-testid="website-input"
                  />
                </div>
                <FieldError message={errors.website} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger className="h-12 pl-10 rounded-xl border-gray-200 bg-white/50" data-testid="country-select">
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
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="nl">Netherlands</SelectItem>
                      <SelectItem value="se">Sweden</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="ae">United Arab Emirates</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                      <SelectItem value="ie">Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City / Town</Label>
                <Input
                  id="city"
                  placeholder="e.g. London"
                  className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  data-testid="city-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  className={`h-12 pl-10 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.phone ? "border-red-400" : ""}`}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[+\d\s()\-]*$/.test(val)) {
                      setFormData({ ...formData, phone: val });
                    }
                  }}
                  data-testid="phone-input"
                />
              </div>
              <FieldError message={errors.phone} />
            </div>
          </div>

          {/* Social Media Handles */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              Social Media Handles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@yourhandle"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.instagram ? "border-red-400" : ""}`}
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  data-testid="instagram-input"
                />
                <FieldError message={errors.instagram} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktokShop">TikTok Shop</Label>
                <Input
                  id="tiktokShop"
                  placeholder="@yourshop"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.tiktokShop ? "border-red-400" : ""}`}
                  value={formData.tiktokShop}
                  onChange={(e) =>
                    setFormData({ ...formData, tiktokShop: e.target.value })
                  }
                  data-testid="tiktok-shop-input"
                />
                <FieldError message={errors.tiktokShop} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  placeholder="@yourhandle"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.tiktok ? "border-red-400" : ""}`}
                  value={formData.tiktok}
                  onChange={(e) =>
                    setFormData({ ...formData, tiktok: e.target.value })
                  }
                  data-testid="tiktok-input"
                />
                <FieldError message={errors.tiktok} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="@yourchannel"
                  className={`h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.youtube ? "border-red-400" : ""}`}
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube: e.target.value })
                  }
                  data-testid="youtube-input"
                />
                <FieldError message={errors.youtube} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate(-1)}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BusinessProfilePage;
