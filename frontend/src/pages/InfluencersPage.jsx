import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, ArrowRight, ArrowLeft, Check, Users, Heart } from "lucide-react";

const InfluencersPage = () => {
  const navigate = useNavigate();
  const [selectedInfluencers, setSelectedInfluencers] = useState([]);
  const [filters, setFilters] = useState({
    campaignLength: "1-month",
    minFollowers: "",
    minEngagement: "",
    budgetRange: [0, 15000],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const influencers = [
    {
      id: 1,
      name: "Sophia Rivera",
      handle: "@sophrivera",
      niche: "Lifestyle",
      followers: "1.2M",
      engagement: "4.8%",
      price: 8000,
      image: "https://images.unsplash.com/photo-1524158572048-994dc70d2b58?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Marco Chen",
      handle: "@marcochen",
      niche: "Tech",
      followers: "850K",
      engagement: "5.2%",
      price: 5500,
      image: "https://images.unsplash.com/photo-1676252651721-6a06e6df805d?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Emma Laurent",
      handle: "@emmalaurent",
      niche: "Fashion",
      followers: "2.1M",
      engagement: "3.9%",
      price: 13000,
      image: "https://images.unsplash.com/photo-1638409867784-4ed76ed742a1?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Alex Torres",
      handle: "@alextorres",
      niche: "Fitness",
      followers: "640K",
      engagement: "6.1%",
      price: 3800,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Diana Voss",
      handle: "@dianavoss",
      niche: "Beauty",
      followers: "1.8M",
      engagement: "4.5%",
      price: 11000,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Zara Mitchell",
      handle: "@zaramitchell",
      niche: "Travel",
      followers: "920K",
      engagement: "5.8%",
      price: 6200,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
    },
  ];

  const toggleInfluencer = (id) => {
    if (selectedInfluencers.includes(id)) {
      setSelectedInfluencers(selectedInfluencers.filter((i) => i !== id));
    } else {
      setSelectedInfluencers([...selectedInfluencers, id]);
    }
  };

  const handleContinue = () => {
    if (selectedInfluencers.length > 0) {
      navigate("/payment");
    }
  };

  return (
    <Layout userType="business">
      <div className="p-8" data-testid="influencers-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Influencer Selection
          </h1>
          <p className="text-muted-foreground">
            Find the perfect creators for your campaign
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-soft sticky top-8 space-y-6">
              <h2 className="font-outfit text-xl font-semibold">Filters</h2>

              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search influencers..."
                    className="pl-10 h-10 rounded-xl border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="search-input"
                  />
                </div>
              </div>

              {/* Campaign Length */}
              <div className="space-y-2">
                <Label>Campaign Length</Label>
                <div className="flex flex-wrap gap-2">
                  {["1-week", "1-month", "3-months"].map((length) => (
                    <button
                      key={length}
                      onClick={() =>
                        setFilters({ ...filters, campaignLength: length })
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filters.campaignLength === length
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {length === "1-week"
                        ? "1 Week"
                        : length === "1-month"
                        ? "1 Month"
                        : "3 Months"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-4">
                <Label>Budget Range</Label>
                <div className="text-center">
                  <span className="text-lg font-semibold">
                    ${filters.budgetRange[0].toLocaleString()} - $
                    {filters.budgetRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={filters.budgetRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, budgetRange: value })
                  }
                  max={20000}
                  min={0}
                  step={500}
                  data-testid="budget-slider"
                />
              </div>

              {/* Min Followers */}
              <div className="space-y-2">
                <Label>Min. Followers</Label>
                <Select
                  value={filters.minFollowers}
                  onValueChange={(value) =>
                    setFilters({ ...filters, minFollowers: value })
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl border-gray-200">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="100k">100K+</SelectItem>
                    <SelectItem value="500k">500K+</SelectItem>
                    <SelectItem value="1m">1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Engagement */}
              <div className="space-y-2">
                <Label>Min. Engagement Rate</Label>
                <Select
                  value={filters.minEngagement}
                  onValueChange={(value) =>
                    setFilters({ ...filters, minEngagement: value })
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl border-gray-200">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="3">3%+</SelectItem>
                    <SelectItem value="5">5%+</SelectItem>
                    <SelectItem value="7">7%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Influencer Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {influencers.map((influencer) => {
                const isSelected = selectedInfluencers.includes(influencer.id);

                return (
                  <div
                    key={influencer.id}
                    onClick={() => toggleInfluencer(influencer.id)}
                    className={`bg-white rounded-3xl overflow-hidden shadow-soft cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? "border-orange-400 shadow-floating"
                        : "border-transparent hover:shadow-md"
                    }`}
                    data-testid={`influencer-card-${influencer.id}`}
                  >
                    {/* Image */}
                    <div className="relative aspect-square">
                      <img
                        src={influencer.image}
                        alt={influencer.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-medium">
                        {influencer.niche}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-outfit text-lg font-semibold">
                        {influencer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {influencer.handle}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                            <Users className="w-4 h-4" />
                          </div>
                          <p className="font-semibold">{influencer.followers}</p>
                          <p className="text-xs text-muted-foreground">
                            Followers
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                            <Heart className="w-4 h-4" />
                          </div>
                          <p className="font-semibold">{influencer.engagement}</p>
                          <p className="text-xs text-muted-foreground">
                            Engagement
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-outfit font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                          ${influencer.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / month
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
                onClick={() => navigate("/business-plan")}
                data-testid="back-btn"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={selectedInfluencers.length === 0}
                className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-50"
                data-testid="select-continue-btn"
              >
                Select & Continue ({selectedInfluencers.length} selected)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InfluencersPage;
