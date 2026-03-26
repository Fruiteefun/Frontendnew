import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Globe, Upload, Plus, X, Image, Palette, Save, ArrowLeft, Loader2 } from "lucide-react";
import { isValidUrl, isValidHexColor } from "../lib/validation";
import { brandsApi, socialAuthApi } from "../lib/api";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const BrandSetupPage = () => {
  const navigate = useNavigate();
  const brandId = localStorage.getItem("fruitee_activeBrandId");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [brandColors, setBrandColors] = useState([]);
  const [newColor, setNewColor] = useState("#F97316");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
    tiktok_shop: false,
  });

  const handleSocialConnect = async (platform) => {
    if (!brandId) return;
    setConnecting(platform);
    try {
      // Save ALL form state before OAuth redirect
      localStorage.setItem("fruitee_brand_setup_draft", JSON.stringify({
        websiteUrl,
        brandColors,
        newColor,
        brandLogoPreview: brandLogo?.preview || "",
        productImagePreviews: productImages.map(img => img.preview || ""),
      }));
      const returnUrl = window.location.href.split("?")[0];
      const apiPlatform = platform.replace("_shop", "-shop");
      const res = await socialAuthApi.brandAuthUrl(brandId, apiPlatform, returnUrl);
      if (res.success && res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      } else {
        setErrors({ api: `Failed to get ${platform} auth URL` });
      }
    } catch (err) {
      setErrors({ api: `Failed to connect ${platform}: ${err.message}` });
    }
    setConnecting(null);
  };

  // Load existing brand data
  useEffect(() => {
    const loadBrand = async () => {
      if (!brandId) { setLoading(false); return; }

      let apiWebsite = "https://";
      let apiColors = [];
      let apiLogoPreview = "";

      try {
        const res = await brandsApi.get(brandId);
        if (res.success && res.data) {
          const b = res.data;
          apiWebsite = b.website || "https://";
          if (b.brand_colours?.length) {
            apiColors = b.brand_colours.map((c, i) => ({ id: i, color: c }));
          }
          if (b.logo_url) {
            apiLogoPreview = b.logo_url;
          }
          setConnectedPlatforms({
            instagram: !!b.is_instagram_connected,
            tiktok: !!b.is_tiktok_connected,
            youtube: !!b.is_youtube_connected,
            tiktok_shop: !!b.is_tiktok_shop_connected,
          });
        }
      } catch {
        // New brand — no data yet
      }

      // Restore draft saved before OAuth redirect — draft overrides API
      const draft = localStorage.getItem("fruitee_brand_setup_draft");
      if (draft) {
        try {
          const saved = JSON.parse(draft);
          setWebsiteUrl(saved.websiteUrl && saved.websiteUrl !== "https://" ? saved.websiteUrl : apiWebsite);
          if (saved.brandColors?.length) {
            setBrandColors(saved.brandColors);
          } else if (apiColors.length) {
            setBrandColors(apiColors);
          }
          if (saved.newColor) setNewColor(saved.newColor);
          if (saved.brandLogoPreview) {
            setBrandLogo({ preview: saved.brandLogoPreview });
          } else if (apiLogoPreview) {
            setBrandLogo({ preview: apiLogoPreview });
          }
          if (saved.productImagePreviews?.length) {
            setProductImages(saved.productImagePreviews.map((url, i) => ({ id: i, preview: url })));
          }
        } catch { /* ignore */ }
      } else {
        // No draft — use API data
        setWebsiteUrl(apiWebsite);
        if (apiColors.length) setBrandColors(apiColors);
        if (apiLogoPreview) setBrandLogo({ preview: apiLogoPreview });
      }

      setLoading(false);
    };
    loadBrand();
  }, [brandId]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandLogo({ file, preview: URL.createObjectURL(file) });
      setBrandLogoFile(file);
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && productImages.length < 3) {
      setProductImages([
        ...productImages,
        { id: Date.now(), file, preview: URL.createObjectURL(file) },
      ]);
    }
  };

  const removeProductImage = (id) => {
    setProductImages(productImages.filter((img) => img.id !== id));
  };

  const addColor = () => {
    if (newColor && isValidHexColor(newColor)) {
      setBrandColors([...brandColors, { id: Date.now(), color: newColor }]);
    }
  };

  const removeColor = (id) => {
    setBrandColors(brandColors.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (websiteUrl && websiteUrl !== "https://" && !isValidUrl(websiteUrl)) e2.website = "Please enter a valid URL (https://...)";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    if (!brandId) { navigate("/brands"); return; }

    setSaving(true);
    try {
      await brandsApi.update(brandId, {
        website: websiteUrl !== "https://" ? websiteUrl : undefined,
        brand_colours: brandColors.map((c) => c.color),
      });
      if (brandLogoFile) {
        await brandsApi.uploadLogo(brandId, brandLogoFile);
      }
      localStorage.removeItem("fruitee_brand_setup_draft");
      navigate("/brand-bio");
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="brand-setup-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Brand Profile
          </h1>
          <p className="text-muted-foreground">
            Add your brand assets and visual identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Website */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-4">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500" />
              Brand Website
            </h2>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="websiteUrl"
                  placeholder="https://yourbrand.com"
                  className={`h-12 pl-10 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.website ? "border-red-400" : ""}`}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  data-testid="website-url-input"
                />
              </div>
              <FieldError message={errors.website} />
            </div>
          </div>

          {/* Brand Logo */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-4">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" />
              Brand Logo
            </h2>
            <div className="flex items-start gap-4">
              {brandLogo ? (
                <div className="relative">
                  <img
                    src={brandLogo.preview}
                    alt="Brand Logo"
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setBrandLogo(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="brand-logo-upload"
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors"
                >
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input
                    id="brand-logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    data-testid="brand-logo-upload"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              PNG, JPG or SVG — recommended 512x512px
            </p>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
                <Image className="w-5 h-5 text-orange-500" />
                Product Images
              </h2>
              <span className="text-sm text-muted-foreground">{productImages.length} / 3</span>
            </div>

            <div className="flex gap-4 flex-wrap">
              {productImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    alt="Product"
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeProductImage(img.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}

              {productImages.length < 3 && (
                <label
                  htmlFor="product-image-upload"
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors"
                >
                  <Plus className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Add</span>
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProductImageUpload}
                    data-testid="product-image-upload"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload up to 3 product images
            </p>
          </div>

          {/* Brand Colours */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-4">
            <h2 className="font-outfit text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-500" />
              Brand Colours
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Pick a colour</Label>
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  data-testid="color-picker"
                />
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="h-10 w-28 rounded-xl border-gray-200 font-mono text-sm"
                  data-testid="color-hex-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addColor}
                  className="h-10 rounded-xl border-gray-200 hover:bg-orange-50"
                  data-testid="add-color-btn"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {brandColors.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {brandColors.map((c) => (
                    <div key={c.id} className="relative group">
                      <div
                        className="w-12 h-12 rounded-xl shadow-soft"
                        style={{ backgroundColor: c.color }}
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(c.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      <p className="text-[10px] text-center text-muted-foreground mt-1">{c.color}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No colours added yet. Use the picker above to add your brand colours.
                </p>
              )}
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
              Connect Social Media Accounts
            </h2>
            <p className="text-sm text-muted-foreground">Link your brand's social media accounts</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Instagram", key: "instagram", gradient: "from-purple-500 via-pink-500 to-orange-400", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
                { name: "TikTok", key: "tiktok", gradient: "from-gray-800 to-black", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.44a8.16 8.16 0 0 0 3.76.92V6.69z"/></svg> },
                { name: "YouTube", key: "youtube", gradient: "from-red-500 to-red-600", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/></svg> },
                { name: "TikTok Shop", key: "tiktok_shop", gradient: "from-teal-500 to-teal-600", icon: <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.44a8.16 8.16 0 0 0 3.76.92V6.69z"/></svg> },
              ].map((platform) => {
                const isConnected = connectedPlatforms[platform.key];
                return (
                  <Button
                    key={platform.name}
                    type="button"
                    onClick={() => !isConnected && handleSocialConnect(platform.key)}
                    disabled={connecting === platform.key}
                    className={`h-14 rounded-xl text-white font-medium flex items-center gap-3 justify-center transition-all ${
                      isConnected
                        ? "bg-teal-500 hover:bg-teal-600"
                        : `bg-gradient-to-r ${platform.gradient} hover:opacity-90`
                    }`}
                    data-testid={`connect-${platform.key}-btn`}
                  >
                    {connecting === platform.key ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isConnected ? (
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      platform.icon
                    )}
                    {isConnected ? `${platform.name} Connected` : `Connect ${platform.name}`}
                  </Button>
                );
              })}
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
              disabled={saving}
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BrandSetupPage;
