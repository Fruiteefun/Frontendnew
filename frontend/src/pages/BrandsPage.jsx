import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, ArrowRight, Tag, ClipboardList, Save } from "lucide-react";

const BrandsPage = () => {
  const navigate = useNavigate();
  const [newBrandName, setNewBrandName] = useState("");
  const [brands, setBrands] = useState([]);

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (newBrandName.trim()) {
      setBrands([
        ...brands,
        {
          id: Date.now(),
          name: newBrandName,
          campaigns: 0,
          createdAt: new Date().toLocaleDateString(),
        },
      ]);
      setNewBrandName("");
    }
  };

  const handleDeleteBrand = (id) => {
    setBrands(brands.filter((brand) => brand.id !== id));
  };

  return (
    <Layout userType="business">
      <div className="p-8 max-w-3xl mx-auto" data-testid="brands-page">
        <div className="mb-8">
          <h1 className="font-outfit text-4xl font-bold text-foreground mb-2">
            Your Brands
          </h1>
          <p className="text-muted-foreground">
            Create and manage your brand names
          </p>
        </div>

        {/* Add Brand Form */}
        <div className="bg-white rounded-3xl p-8 shadow-soft mb-6">
          <h2 className="font-outfit text-lg font-semibold flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-orange-500" />
            Add a Brand
          </h2>
          <form onSubmit={handleAddBrand} className="flex gap-4">
            <Input
              placeholder="Enter brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 flex-1"
              data-testid="brand-name-input"
            />
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold"
              data-testid="add-brand-btn"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </form>
        </div>

        {/* Brands List */}
        <div className="bg-white rounded-3xl p-8 shadow-soft mb-8">
          <h2 className="font-outfit text-lg font-semibold flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-orange-500" />
            Your Brands
          </h2>

          {brands.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground">
                No brands yet. Add your first brand above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-soft transition-all"
                  data-testid={`brand-item-${brand.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {brand.campaigns} campaigns
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/business-preferences")}
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            data-testid="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={() => navigate("/brand-setup")}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
            data-testid="continue-btn"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Continue
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default BrandsPage;
