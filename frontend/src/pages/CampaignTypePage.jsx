import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Megaphone, Rocket, CalendarDays, Tag, ArrowRight, ArrowLeft, Globe, Plus, X, Image, Loader2 } from "lucide-react";
import { isValidUrl } from "../lib/validation";
import { campaignsApi } from "../lib/api";

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-red-500 mt-1" data-testid="field-error">{message}</p> : null;

const CampaignTypePage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [campaignData, setCampaignData] = useState({
    website: "https://",
    details: "",
  });
  const [campaignImages, setCampaignImages] = useState([]);
  const [errors, setErrors] = useState({});

  const [products, setProducts] = useState([{ name: "", description: "", price: "" }]);
  const addProduct = () => setProducts([...products, { name: "", description: "", price: "" }]);
  const removeProduct = (i) => setProducts(products.filter((_, idx) => idx !== i));
  const updateProduct = (i, field, value) => {
    const updated = [...products];
    updated[i][field] = value;
    setProducts(updated);
  };

  const [events, setEvents] = useState([{ name: "", venue: "", dates: "", tickets: "" }]);
  const addEvent = () => setEvents([...events, { name: "", venue: "", dates: "", tickets: "" }]);
  const removeEvent = (i) => setEvents(events.filter((_, idx) => idx !== i));
  const updateEvent = (i, field, value) => {
    const updated = [...events];
    updated[i][field] = value;
    setEvents(updated);
  };

  const [promotions, setPromotions] = useState([{ name: "", description: "", code: "" }]);
  const addPromotion = () => setPromotions([...promotions, { name: "", description: "", code: "" }]);
  const removePromotion = (i) => setPromotions(promotions.filter((_, idx) => idx !== i));
  const updatePromotion = (i, field, value) => {
    const updated = [...promotions];
    updated[i][field] = value;
    setPromotions(updated);
  };

  const campaignTypes = [
    {
      id: "brand-awareness",
      icon: Megaphone,
      title: "Raising Brand Awareness",
      description: "Increase visibility, reach new audiences, and build recognition for your brand",
      gradient: "from-orange-400 to-orange-500",
    },
    {
      id: "product-launch",
      icon: Rocket,
      title: "Launching New Product(s) or Service(s)",
      description: "Generate buzz and drive interest around a new product or service launch",
      gradient: "from-pink-400 to-pink-500",
    },
    {
      id: "event-promo",
      icon: CalendarDays,
      title: "Advertising an Event",
      description: "Promote an upcoming event to maximise attendance and engagement",
      gradient: "from-teal-400 to-teal-500",
    },
    {
      id: "promotion",
      icon: Tag,
      title: "Launching a Promotion",
      description: "Drive sales and conversions with a limited-time offer or discount campaign",
      gradient: "from-purple-400 to-purple-500",
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && campaignImages.length < 5) {
      setCampaignImages([
        ...campaignImages,
        { id: Date.now(), file, preview: URL.createObjectURL(file) },
      ]);
    }
  };

  const removeImage = (id) => {
    setCampaignImages(campaignImages.filter((img) => img.id !== id));
  };

  const [saving, setSaving] = useState(false);

  // Map UI type IDs to API focus enum values (gap analysis #11)
  const focusMap = {
    "brand-awareness": "increase_brand_awareness",
    "product-launch": "launch_products",
    "event-promo": "promote_event",
    "promotion": "launch_promotion",
  };

  const handleContinue = async () => {
    if (!selectedType) return;
    const e = {};
    if (campaignData.website && campaignData.website !== "https://" && !isValidUrl(campaignData.website)) e.website = "Please enter a valid URL (https://...)";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const campaignId = localStorage.getItem("fruitee_activeCampaignId");
    if (!campaignId) { navigate("/campaign"); return; }

    setSaving(true);
    try {
      const updatePayload = {
        focus: focusMap[selectedType],
        description: campaignData.details || undefined,
        website: campaignData.website !== "https://" ? campaignData.website : undefined,
      };

      // Add products for product-launch
      if (selectedType === "product-launch" && products.some((p) => p.name)) {
        updatePayload.products = products
          .filter((p) => p.name)
          .map((p) => ({ name: p.name, description: p.description || p.name, price: p.price || null }));
      }

      // Add event for event-promo (API takes single event object)
      if (selectedType === "event-promo" && events[0]?.name) {
        const ev = events[0];
        updatePayload.event = {
          name: ev.name,
          venue: ev.venue || "TBD",
          ticket_prices: ev.tickets || "TBD",
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        };
      }

      // Add promotions for promotion
      if (selectedType === "promotion" && promotions.some((p) => p.name)) {
        updatePayload.promotions = promotions
          .filter((p) => p.name)
          .map((p) => ({ name: p.name, description: p.description || p.name, code: p.code || "PROMO" }));
      }

      await campaignsApi.update(campaignId, updatePayload);

      // Upload campaign images
      for (const img of campaignImages) {
        if (img.file) {
          await campaignsApi.uploadImage(campaignId, img.file);
        }
      }

      navigate("/business-plan");
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="campaign-type-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Select Campaign Type
          </h1>
          <p className="text-muted-foreground">
            Choose the objective that best fits your campaign
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {campaignTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <div
                key={type.id}
                className={`bg-white rounded-3xl shadow-soft transition-all duration-300 border-2 overflow-hidden ${
                  isSelected
                    ? "border-orange-400 shadow-floating"
                    : "border-transparent hover:border-orange-200 hover:shadow-md"
                }`}
                data-testid={`campaign-type-${type.id}`}
              >
                {/* Header - always visible */}
                <div
                  className="flex items-center gap-4 p-6 cursor-pointer"
                  onClick={() => setSelectedType(isSelected ? null : type.id)}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-outfit text-lg font-semibold text-foreground">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {type.description}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected ? "border-orange-400" : "border-gray-300"
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-orange-400" />}
                  </div>
                </div>

                {/* Expandable fields */}
                {isSelected && (
                  <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
                    {/* Campaign Website */}
                    <div className="space-y-2">
                      <Label>Campaign Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="https://example.com"
                          className={`h-12 pl-10 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 ${errors.website ? "border-red-400" : ""}`}
                          value={campaignData.website}
                          onChange={(e) => setCampaignData({ ...campaignData, website: e.target.value })}
                          data-testid="campaign-website-input"
                        />
                      </div>
                      <FieldError message={errors.website} />
                    </div>

                    {/* Campaign Images */}
                    <div className="space-y-2">
                      <Label>Campaign Image(s)</Label>
                      <div className="flex gap-3 flex-wrap">
                        {campaignImages.map((img) => (
                          <div key={img.id} className="relative">
                            <img
                              src={img.preview}
                              alt="Campaign"
                              className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}

                        {campaignImages.length < 5 && (
                          <label
                            htmlFor={`campaign-image-upload-${type.id}`}
                            className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors"
                          >
                            <Plus className="w-5 h-5 text-muted-foreground mb-0.5" />
                            <span className="text-[10px] text-muted-foreground">Add</span>
                            <input
                              id={`campaign-image-upload-${type.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              data-testid="campaign-image-upload"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="space-y-2">
                      <Label>Campaign Details</Label>
                      <Textarea
                        placeholder="Describe your campaign..."
                        className="min-h-[100px] rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                        value={campaignData.details}
                        onChange={(e) => setCampaignData({ ...campaignData, details: e.target.value })}
                        data-testid="campaign-details-textarea"
                      />
                    </div>

                    {/* Product Launch - Products */}
                    {type.id === "product-launch" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Products / Services</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={addProduct}
                            data-testid="add-product-btn"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Product
                          </Button>
                        </div>
                        {products.map((product, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 relative" data-testid={`product-${i}`}>
                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProduct(i)}
                                className="absolute top-3 right-3 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                data-testid={`remove-product-${i}`}
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </button>
                            )}
                            <Input
                              placeholder="Product Name"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={product.name}
                              onChange={(e) => updateProduct(i, "name", e.target.value)}
                              data-testid={`product-name-${i}`}
                            />
                            <Textarea
                              placeholder="Description"
                              className="min-h-[70px] rounded-lg border-gray-200 bg-white"
                              value={product.description}
                              onChange={(e) => updateProduct(i, "description", e.target.value)}
                              data-testid={`product-desc-${i}`}
                            />
                            <Input
                              placeholder="Price (e.g. $49.99)"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={product.price}
                              onChange={(e) => updateProduct(i, "price", e.target.value)}
                              data-testid={`product-price-${i}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Event Promo - Events */}
                    {type.id === "event-promo" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Events</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={addEvent}
                            data-testid="add-event-btn"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Event
                          </Button>
                        </div>
                        {events.map((event, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 relative" data-testid={`event-${i}`}>
                            {events.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEvent(i)}
                                className="absolute top-3 right-3 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                data-testid={`remove-event-${i}`}
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </button>
                            )}
                            <Input
                              placeholder="Event Name"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={event.name}
                              onChange={(e) => updateEvent(i, "name", e.target.value)}
                              data-testid={`event-name-${i}`}
                            />
                            <Input
                              placeholder="Venue"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={event.venue}
                              onChange={(e) => updateEvent(i, "venue", e.target.value)}
                              data-testid={`event-venue-${i}`}
                            />
                            <Input
                              placeholder="Dates (e.g. June 15-17, 2026)"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={event.dates}
                              onChange={(e) => updateEvent(i, "dates", e.target.value)}
                              data-testid={`event-dates-${i}`}
                            />
                            <Input
                              placeholder="Ticket Prices (e.g. $50 - $200)"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={event.tickets}
                              onChange={(e) => updateEvent(i, "tickets", e.target.value)}
                              data-testid={`event-tickets-${i}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Promotion - Promos */}
                    {type.id === "promotion" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-semibold">Promotions</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={addPromotion}
                            data-testid="add-promotion-btn"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Promotion
                          </Button>
                        </div>
                        {promotions.map((promo, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 relative" data-testid={`promotion-${i}`}>
                            {promotions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePromotion(i)}
                                className="absolute top-3 right-3 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center"
                                data-testid={`remove-promotion-${i}`}
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </button>
                            )}
                            <Input
                              placeholder="Promo Name"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={promo.name}
                              onChange={(e) => updatePromotion(i, "name", e.target.value)}
                              data-testid={`promo-name-${i}`}
                            />
                            <Textarea
                              placeholder="Description"
                              className="min-h-[70px] rounded-lg border-gray-200 bg-white"
                              value={promo.description}
                              onChange={(e) => updatePromotion(i, "description", e.target.value)}
                              data-testid={`promo-desc-${i}`}
                            />
                            <Input
                              placeholder="Promo Code (e.g. SUMMER25)"
                              className="h-11 rounded-lg border-gray-200 bg-white"
                              value={promo.code}
                              onChange={(e) => updatePromotion(i, "code", e.target.value)}
                              data-testid={`promo-code-${i}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        {errors.api && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4" data-testid="api-error">{errors.api}</div>
        )}
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
            onClick={handleContinue}
            disabled={!selectedType || saving}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-50"
            data-testid="continue-btn"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {saving ? "Saving..." : "Continue"}
            {!saving && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignTypePage;
