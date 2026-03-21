import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, ArrowRight, Heart, Users, TrendingUp, DollarSign, Star } from "lucide-react";

const InfluencersPage = () => {
  const navigate = useNavigate();
  const [selectedInfluencers, setSelectedInfluencers] = useState([]);
  const [filters, setFilters] = useState({
    campaignLength: "1-month",
    budgetMin: "500",
    budgetMax: "5,000",
    minFollowers: "100K",
    minEngagement: "3%",
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
      price: "$8,000",
      rating: 4,
      image: "https://images.unsplash.com/photo-1524158572048-994dc70d2b58?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Marco Chen",
      handle: "@marcochen",
      niche: "Tech",
      followers: "850K",
      engagement: "5.2%",
      price: "$5,500",
      rating: 4,
      image: "https://images.unsplash.com/photo-1676252651721-6a06e6df805d?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Emma Laurent",
      handle: "@emmalaurent",
      niche: "Fashion",
      followers: "2.1M",
      engagement: "3.9%",
      price: "$13,000",
      rating: 4,
      image: "https://images.unsplash.com/photo-1638409867784-4ed76ed742a1?w=400&h=500&fit=crop",
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-6xl mx-auto" data-testid="influencers-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Influencer Selection
          </h1>
          <p className="text-muted-foreground">
            Find the perfect creators for your campaign
          </p>
        </div>

        {/* Horizontal Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
              <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
              <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
              <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
              <line x1="18" x2="22" y1="16" y2="16" />
            </svg>
            <span className="font-semibold text-foreground">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Campaign Length */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Campaign Length</label>
              <div className="flex gap-1">
                {["1 Week", "1 Month", "3 Months"].map((len) => {
                  const val = len.toLowerCase().replace(" ", "-");
                  return (
                    <button
                      key={val}
                      onClick={() => setFilters({ ...filters, campaignLength: val })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.campaignLength === val
                          ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                          : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                      }`}
                      data-testid={`filter-length-${val}`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Budget Range</label>
              <div className="flex gap-2">
                <Input
                  value={filters.budgetMin}
                  onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
                  className="h-9 rounded-lg border-gray-200 text-xs"
                  placeholder="$500"
                  data-testid="filter-budget-min"
                />
                <Input
                  value={filters.budgetMax}
                  onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                  className="h-9 rounded-lg border-gray-200 text-xs"
                  placeholder="$5,000"
                  data-testid="filter-budget-max"
                />
              </div>
            </div>

            {/* Min Followers */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min. Followers</label>
              <Input
                value={filters.minFollowers}
                onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
                className="h-9 rounded-lg border-gray-200 text-xs"
                placeholder="100K"
                data-testid="filter-min-followers"
              />
            </div>

            {/* Min Engagement */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Min. Engagement Rate</label>
              <Input
                value={filters.minEngagement}
                onChange={(e) => setFilters({ ...filters, minEngagement: e.target.value })}
                className="h-9 rounded-lg border-gray-200 text-xs"
                placeholder="3%"
                data-testid="filter-min-engagement"
              />
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search influencers..."
                  className="h-9 pl-8 rounded-lg border-gray-200 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Influencer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
                {/* Image with overlay */}
                <div className="relative h-56">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Heart icon */}
                  <button
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? "bg-pink-500" : "bg-white/30 backdrop-blur-sm"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleInfluencer(influencer.id); }}
                  >
                    <Heart className={`w-5 h-5 ${isSelected ? "text-white fill-white" : "text-white"}`} />
                  </button>
                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-outfit text-lg font-bold text-white">{influencer.name}</h3>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      <span className="text-sm text-white/80">{influencer.handle}</span>
                    </div>
                  </div>
                </div>

                {/* Niche tag + rating */}
                <div className="px-4 pt-3 flex items-center justify-between">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                    {influencer.niche}
                  </span>
                  <div className="flex">{renderStars(influencer.rating)}</div>
                </div>

                {/* Stats */}
                <div className="px-4 py-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <Users className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{influencer.followers}</p>
                    <p className="text-[10px] text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{influencer.engagement}</p>
                    <p className="text-[10px] text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{influencer.price}</p>
                    <p className="text-[10px] text-muted-foreground">/ month</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            onClick={() => navigate("/business-plan")}
            data-testid="back-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedInfluencers.length === 0}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 disabled:opacity-50"
            data-testid="select-continue-btn"
          >
            Select & Continue ({selectedInfluencers.length} selected)
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InfluencersPage;
