import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiTrash2, FiShoppingBag, FiArrowRight, FiEye } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';

const RecentlyViewedSection = ({ className = '', limit = 10, title = 'Recently Viewed Products' }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  const displayList = recentlyViewed.slice(0, limit);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
            <p className="text-xs text-slate-400">
              Products you browsed recently on Basketly
            </p>
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <button
            onClick={clearRecentlyViewed}
            className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Content */}
      {displayList.length === 0 ? (
        <div className="py-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-400 inline-flex items-center justify-center border border-slate-700">
            <FiEye className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">No Recently Viewed Products</h3>
            <p className="text-xs text-slate-400">
              Explore our marketplace store to view fresh organic produce, groceries, and essentials.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayList.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedSection;
