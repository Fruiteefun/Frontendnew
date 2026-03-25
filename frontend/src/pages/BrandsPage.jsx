import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Tag, ChevronRight, Megaphone, Trash2, Loader2 } from "lucide-react";
import { brandsApi } from "../lib/api";

const BrandsPage = () => {
  const navigate = useNavigate();
  const [newBrandName, setNewBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandsApi.list(1, 50);
        if (res.success) {
          // Handle different response formats: data.result, data.items, or data as array
          const brandsData = res.data?.result || res.data?.items || (Array.isArray(res.data) ? res.data : []);
          setBrands(brandsData);
        }
      } catch {
        // Fallback — no brands yet
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setCreating(true);
    try {
      const res = await brandsApi.create({ name: newBrandName });
      if (res.success) {
        const newBrand = res.data;
        setBrands([...brands, newBrand]);
        setNewBrandName("");
        localStorage.setItem("fruitee_activeBrandId", newBrand.id);
        navigate("/brand-setup");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await brandsApi.delete(id);
      setBrands(brands.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBrandClick = (brand) => {
    localStorage.setItem("fruitee_activeBrandId", brand.id);
    navigate("/brand-campaigns");
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-4xl mx-auto" data-testid="brands-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
              Your Brands
            </h1>
            <p className="text-muted-foreground">
              Manage your brands and their campaigns
            </p>
          </div>
        </div>

        {/* Add Brand Form */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-8">
          <form onSubmit={handleAddBrand} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Add a new brand</label>
              <Input
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                data-testid="brand-name-input"
              />
            </div>
            <Button
              type="submit"
              disabled={creating}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold"
              data-testid="add-brand-btn"
            >
              {creating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
              {creating ? "Creating..." : "Add Brand"}
            </Button>
          </form>
        </div>

        {/* Brands Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : brands.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-soft text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <Tag className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="font-outfit text-lg font-semibold mb-2">No brands yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first brand above to get started with campaigns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-white rounded-3xl shadow-soft hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-orange-200 cursor-pointer group overflow-hidden"
                  data-testid={`brand-card-${brand.id}`}
                >
                  <div
                    className="p-6 flex items-center gap-4"
                    onClick={() => handleBrandClick(brand)}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-outfit text-lg font-semibold text-foreground truncate">
                        {brand.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Megaphone className="w-3 h-3" />
                          {brand.campaign_count || 0} campaign{(brand.campaign_count || 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 transition-colors flex-shrink-0" />
                  </div>
                  <div className="px-6 pb-4 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteBrand(brand.id); }}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      data-testid={`delete-brand-${brand.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrandsPage;
