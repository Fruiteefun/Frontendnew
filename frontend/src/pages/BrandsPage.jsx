import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, ArrowRight, MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

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

  const handleSelectBrand = (brandId) => {
    navigate("/brand-setup");
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
        <div className="bg-white rounded-3xl p-8 shadow-soft mb-8">
          <h2 className="font-outfit text-xl font-semibold mb-4">Add a Brand</h2>
          <form onSubmit={handleAddBrand} className="flex gap-4">
            <Input
              placeholder="Enter brand name..."
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
        <div className="bg-white rounded-3xl p-8 shadow-soft">
          <h2 className="font-outfit text-xl font-semibold mb-6">Your Brands</h2>

          {brands.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <Plus className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-muted-foreground">
                No brands yet. Add your first brand above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-soft transition-all cursor-pointer"
                  onClick={() => handleSelectBrand(brand.id)}
                  data-testid={`brand-item-${brand.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {brand.campaigns} campaigns • Created {brand.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBrand(brand.id);
                      }}
                    >
                      Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBrand(brand.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/business-preferences")}
            className="h-12 px-8 rounded-full border-gray-200 hover:bg-muted"
            data-testid="back-btn"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/brand-setup")}
            className="h-12 px-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300"
            data-testid="continue-btn"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default BrandsPage;
