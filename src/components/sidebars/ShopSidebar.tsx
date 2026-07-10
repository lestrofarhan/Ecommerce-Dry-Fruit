// components/shop/ShopSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { productService } from "@/services/productService";

interface ShopSidebarProps {
  onCategoryChange?: (category: string | null) => void;
  onPriceChange?: (price: number) => void;
  selectedCategory?: string | null;
}

const DEFAULT_CATEGORIES = ["Dry Fruits", "Shilajeet", "Oils"];

export default function ShopSidebar({
  onCategoryChange,
  onPriceChange,
  selectedCategory,
}: ShopSidebarProps) {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<number>(500);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch categories from the API and merge without duplicates
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getCategories();

        let combinedCategories = [...DEFAULT_CATEGORIES];
        if (
          response &&
          response.success &&
          Array.isArray(response.categories)
        ) {
          combinedCategories = [...combinedCategories, ...response.categories];
        }

        // Deep deduplication matching values uniformly
        const uniqueMap = new Map<string, string>();
        combinedCategories.forEach((cat) => {
          const lower = cat.toLowerCase().trim();
          if (!uniqueMap.has(lower)) {
            uniqueMap.set(lower, cat); // Retains original casing style
          }
        });

        const finalizedList = Array.from(uniqueMap.values());
        setCategories(finalizedList);

        // 2. Safely sync URL param against the fully computed list to prevent case mismatch bugs
        const urlCategory = searchParams.get("category")?.toLowerCase().trim();
        if (urlCategory) {
          const matchedCategory = finalizedList.find(
            (c) => c.toLowerCase().trim() === urlCategory,
          );
          if (matchedCategory) {
            onCategoryChange?.(matchedCategory);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories");

        // Fallback sync using local defaults if the network fails completely
        const urlCategory = searchParams.get("category")?.toLowerCase().trim();
        if (urlCategory) {
          const matchedCategory = DEFAULT_CATEGORIES.find(
            (c) => c.toLowerCase().trim() === urlCategory,
          );
          if (matchedCategory) onCategoryChange?.(matchedCategory);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchParams, onCategoryChange]);

  const handleCategoryChange = (category: string) => {
    // Acts strictly like checkboxes: clicking an already selected box sets it to null (shows all)
    onCategoryChange?.(selectedCategory === category ? null : category);
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    onPriceChange?.(value);
  };

  return (
    <div className="space-y-8 sticky top-6">
      {/* Categories Checkboxes */}
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400 mb-4">
          Categories
        </h4>
        {loading && categories.length === 3 ? (
          <p className="text-xs text-zinc-500 mb-3">Syncing categories...</p>
        ) : error ? (
          <p className="text-xs text-red-500 mb-3">{error}</p>
        ) : null}

        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 text-xs font-medium text-zinc-700 cursor-pointer select-none group"
            >
              <input
                type="checkbox"
                checked={
                  selectedCategory?.toLowerCase().trim() ===
                  cat.toLowerCase().trim()
                }
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 rounded border-zinc-300 bg-white text-emerald-600 focus:ring-0 accent-emerald-700 cursor-pointer"
              />
              <span className="group-hover:text-zinc-900 transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider Tool */}
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400 mb-4">
          Price Range
        </h4>
        <input
          type="range"
          min="20"
          max="500"
          value={priceRange}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800"
        />
        <div className="flex justify-between items-center text-[11px] text-zinc-500 font-medium mt-2">
          <span>$20</span>
          <span>${priceRange}+</span>
        </div>
      </div>

      {/* Minimum Star Rating Selection */}
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400 mb-3">
          Minimum Rating
        </h4>
        <button className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-900 transition-colors group py-1">
          {[...Array(4)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400"
            />
          ))}
          <Star className="w-3.5 h-3.5 fill-zinc-200 stroke-zinc-300" />
          <span className="text-[11px] text-zinc-500 ml-1 group-hover:text-zinc-800 transition-colors">
            & Up
          </span>
        </button>
      </div>
    </div>
  );
}
