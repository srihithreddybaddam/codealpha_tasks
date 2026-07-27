import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiTag, FiTrendingUp, FiShoppingBag, FiChevronRight, FiGrid } from 'react-icons/fi';

const popularSearches = [
  'Mangoes',
  'Basmati Rice',
  'Organic Milk',
  'Wheat Atta',
  'Green Tea',
  'Dry Fruits',
  'Dark Chocolate',
  'Shampoo',
];

const LiveSearchSuggestions = ({
  query,
  suggestions = [],
  categories = [],
  brands = [],
  onSelectSuggestion,
  onClose,
}) => {
  if (!query.trim()) {
    return (
      <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-4 space-y-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>Popular & Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSelectSuggestion(`/products?search=${encodeURIComponent(term)}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all font-semibold cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Highlight matching characters in query
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-indigo-500/30 text-indigo-300 font-extrabold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-3 space-y-3 backdrop-blur-xl max-h-[520px] overflow-y-auto scrollbar-thin">
      {/* 1. MATCHING CATEGORIES & BRANDS */}
      {(categories.length > 0 || brands.length > 0) && (
        <div className="p-2.5 bg-slate-800/50 rounded-xl space-y-2 border border-slate-700/60">
          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Categories:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectSuggestion(`/products?category=${encodeURIComponent(cat)}`)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <FiTag className="w-3 h-3" />
                  {highlightText(cat, query)}
                </button>
              ))}
            </div>
          )}

          {brands.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Brands:
              </span>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => onSelectSuggestion(`/products?search=${encodeURIComponent(b)}`)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                >
                  {highlightText(b, query)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MATCHING PRODUCT SUGGESTIONS WITH THUMBNAILS */}
      {suggestions.length > 0 ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 pt-1">
            <span>Matching Products ({suggestions.length})</span>
            <button
              onClick={() => onSelectSuggestion(`/products?search=${encodeURIComponent(query)}`)}
              className="text-indigo-400 hover:underline font-bold"
            >
              See All →
            </button>
          </div>
          {suggestions.slice(0, 6).map((prod) => {
            const discountedPrice = prod.discount
              ? (prod.price * (1 - prod.discount / 100)).toFixed(2)
              : prod.price.toFixed(2);
            return (
              <Link
                key={prod._id}
                to={`/products/${prod._id}`}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 transition-colors group cursor-pointer border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      prod.images?.[0] ||
                      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {highlightText(prod.name, query)}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {prod.category} • {prod.brand}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div className="text-xs font-extrabold text-white">
                    ₹{discountedPrice}
                  </div>
                  <FiChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            );
          })}

          {/* 3. PROMINENT "SEE ALL RESULTS" FOOTER BUTTON */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => onSelectSuggestion(`/products?search=${encodeURIComponent(query)}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <FiGrid className="w-4 h-4" />
              <span>See All Results for "{query}" ({suggestions.length}+ items)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-slate-400 font-medium space-y-2">
          <p>No direct products matching "{query}".</p>
          <button
            onClick={() => onSelectSuggestion(`/products?search=${encodeURIComponent(query)}`)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Explore Store Catalog
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveSearchSuggestions;
