import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Globe, Upload, Plus, X, Image, Palette, Save } from "lucide-react";
import { isValidUrl } from "../lib/validation";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const BrandSetupPage = () => {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [brandLogo, setBrandLogo] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [brandColors, setBrandColors] = useState([]);
  const [newColor, setNewColor] = useState("#F97316");
  const [errors, setErrors] = useState({});

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandLogo({ file, preview: URL.createObjectURL(file) });
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
    if (newColor) {
      setBrandColors([...brandColors, { id: Date.now(), color: newColor }]);
    }
  };

  const removeColor = (id) => {
    setBrandColors(brandColors.filter((c) => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = {};
    if (websiteUrl && !isValidUrl(websiteUrl)) e2.website = "Please enter a valid URL (https://...)";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    navigate("/campaign");
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/brands")}
              data-testid="cancel-btn"
            >
              Cancel
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

export default BrandSetupPage;
