import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useDropzone } from "react-dropzone";
import { Upload, X, ArrowRight, ArrowLeft, Plus } from "lucide-react";

const BrandSetupPage = () => {
  const navigate = useNavigate();
  const [brandAssets, setBrandAssets] = useState([]);
  const [brandColors, setBrandColors] = useState([
    { id: 1, color: "#FF6B6B", name: "Primary" },
    { id: 2, color: "#FFE66D", name: "Secondary" },
  ]);
  const [newColor, setNewColor] = useState("#4ECDC4");
  const [formData, setFormData] = useState({
    tagline: "",
    voiceTone: "",
    keywords: "",
  });

  const onDrop = useCallback((acceptedFiles) => {
    const newAssets = acceptedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setBrandAssets([...brandAssets, ...newAssets]);
  }, [brandAssets]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeAsset = (id) => {
    setBrandAssets(brandAssets.filter((asset) => asset.id !== id));
  };

  const addColor = () => {
    setBrandColors([
      ...brandColors,
      { id: Date.now(), color: newColor, name: `Color ${brandColors.length + 1}` },
    ]);
    setNewColor("#000000");
  };

  const removeColor = (id) => {
    setBrandColors(brandColors.filter((c) => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/campaign-type");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="brand-setup-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Brand Setup
          </h1>
          <p className="text-muted-foreground">
            Upload your brand assets and define your brand identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Brand Assets Upload */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Brand Assets</h2>
            <p className="text-sm text-muted-foreground">
              Upload your logo, product images, and other brand visuals
            </p>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
              }`}
              data-testid="assets-dropzone"
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-orange-500" />
              </div>
              <p className="font-medium text-foreground mb-1">
                {isDragActive ? "Drop files here" : "Click or drag to upload"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, SVG — max 10 MB each
              </p>
            </div>

            {/* Uploaded Assets */}
            {brandAssets.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {brandAssets.map((asset) => (
                  <div key={asset.id} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                      <img
                        src={asset.preview}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAsset(asset.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {asset.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Brand Colors</h2>
            <p className="text-sm text-muted-foreground">
              Add your brand's color palette
            </p>

            {/* Color Swatches */}
            <div className="flex flex-wrap gap-4">
              {brandColors.map((colorItem) => (
                <div key={colorItem.id} className="relative group">
                  <div
                    className="w-16 h-16 rounded-2xl shadow-soft cursor-pointer"
                    style={{ backgroundColor: colorItem.color }}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(colorItem.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {colorItem.color}
                  </p>
                </div>
              ))}

              {/* Add Color */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-16 h-16 rounded-2xl cursor-pointer border-0 p-0"
                    data-testid="color-picker"
                  />
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="flex items-center gap-1 text-xs text-orange-600 mt-1 hover:text-orange-700"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Brand Voice */}
          <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
            <h2 className="font-outfit text-xl font-semibold">Brand Voice</h2>

            <div className="space-y-2">
              <Label htmlFor="tagline">Brand Tagline</Label>
              <Input
                id="tagline"
                placeholder="Your catchy tagline..."
                className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                data-testid="tagline-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voiceTone">Voice & Tone</Label>
              <Input
                id="voiceTone"
                placeholder="e.g., Professional, Friendly, Bold, Playful..."
                className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.voiceTone}
                onChange={(e) =>
                  setFormData({ ...formData, voiceTone: e.target.value })
                }
                data-testid="voice-tone-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Brand Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g., Innovation, Quality, Trust (comma separated)"
                className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                data-testid="keywords-input"
              />
            </div>
          </div>

          {/* Brand Identity Preview */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8">
            <h2 className="font-outfit text-xl font-semibold mb-4">
              Brand Identity Preview
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                {brandAssets.length > 0 ? (
                  <img
                    src={brandAssets[0].preview}
                    alt="Brand Logo"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">B</span>
                  </div>
                )}
                <div>
                  <h3 className="font-outfit font-bold text-xl">Your Brand</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.tagline || "Your tagline goes here"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {brandColors.map((c) => (
                  <div
                    key={c.id}
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
              onClick={() => navigate("/brands")}
              data-testid="back-btn"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
              data-testid="save-continue-btn"
            >
              Save & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BrandSetupPage;
