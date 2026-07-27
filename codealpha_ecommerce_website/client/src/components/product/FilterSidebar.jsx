import React from 'react';
import { FiFilter, FiRotateCcw, FiStar, FiZap, FiCheck } from 'react-icons/fi';
import { useProduct } from '../../hooks/useProduct';

const FilterSidebar = ({ categories = [], isOpen, onClose, brands = [] }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    selectedBrand,
    setSelectedBrand,
    selectedRating,
    setSelectedRating,
    inStockOnly,
    setInStockOnly,
    selectedDiscount,
    setSelectedDiscount,
    expressOnly,
    setExpressOnly,
    organicOnly,
    setOrganicOnly,
    resetFilters,
  } = useProduct();

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-64 bg-slate-900 border-r lg:border border-slate-800 p-6 rounded-none lg:rounded-2xl shadow-xl lg:shadow-sm transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-300 overflow-y-auto space-y-6 flex-shrink-0`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-extrabold text-white">Filter & Sort</h3>
        </div>

        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
          title="Reset All Filters"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. SORT DROPDOWN */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
          Sort Products
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Popularity / Bestsellers</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="a-z">Name: A to Z</option>
        </select>
      </div>

      {/* 2. CATEGORY FILTER */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Categories
          </h4>
          {selectedCategory !== 'all' && (
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800">
              Active
            </span>
          )}
        </div>

        <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : cat.name;
            const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase();
            return (
              <button
                key={catName}
                onClick={() => handleCategoryChange(catName)}
                className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md border border-indigo-500'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{catName}</span>
                {cat.count !== undefined && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-400">
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRICE RANGE SLIDER */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-extrabold text-indigo-400">
            ₹{Array.isArray(priceRange) ? priceRange[1] : priceRange}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="50000"
          step="500"
          value={Array.isArray(priceRange) ? priceRange[1] : priceRange}
          onChange={(e) =>
            setPriceRange([
              Array.isArray(priceRange) ? priceRange[0] : 0,
              Number(e.target.value),
            ])
          }
          className="w-full accent-indigo-600 cursor-pointer"
        />
      </div>

      {/* 4. BRAND FILTER */}
      {brands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Brand
          </h4>
          <select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 5. SPECIAL BADGE TOGGLES (EXPRESS & ORGANIC) */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-2">
          Special Filters
        </h4>
        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 cursor-pointer p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <input
            type="checkbox"
            checked={!!expressOnly}
            onChange={(e) => setExpressOnly && setExpressOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <FiZap className="w-3.5 h-3.5 text-amber-400" /> Express 10-Min Delivery
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 cursor-pointer p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <input
            type="checkbox"
            checked={!!organicOnly}
            onChange={(e) => setOrganicOnly && setOrganicOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-emerald-300 font-bold">Organic Certified Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 cursor-pointer p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* 6. RATING FILTER */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
              className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all cursor-pointer ${
                selectedRating === r
                  ? 'bg-amber-950/40 text-amber-400 font-bold border border-amber-500/50'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center text-amber-400">
                {Array.from({ length: r }).map((_, i) => (
                  <FiStar key={i} className="fill-current w-3.5 h-3.5" />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. DISCOUNT FILTER */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
          Minimum Discount
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[10, 15, 20, 25].map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscount(selectedDiscount === disc ? 0 : disc)}
              className={`text-xs py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                selectedDiscount === disc
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {disc}% OFF+
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
