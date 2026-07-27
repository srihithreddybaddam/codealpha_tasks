import React from 'react';
import { FiTrendingUp, FiZap, FiHeart, FiEye, FiGrid } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';
import { useWishlist } from '../../hooks/useWishlist';
import { shuffleArray } from '../../utils/shuffle';

const RecommendedProductsSection = ({
  allProducts = [],
  currentCategory = '',
  title = 'Recommended For You',
  type = 'personalized',
  limit = 5,
  className = '',
}) => {
  const { recentlyViewed } = useRecentlyViewed();
  const { wishlist } = useWishlist();

  // Personalization Engine
  let recommendedList = [];

  if (type === 'inspired-by-wishlist' && wishlist.length > 0) {
    const wishlistCategories = new Set(wishlist.map((item) => item.category));
    const wishlistIds = new Set(wishlist.map((item) => item._id));

    recommendedList = allProducts.filter(
      (p) => wishlistCategories.has(p.category) && !wishlistIds.has(p._id)
    );
  } else if (type === 'based-on-recent' && recentlyViewed.length > 0) {
    const recentCategories = new Set(recentlyViewed.map((item) => item.category));
    const recentIds = new Set(recentlyViewed.map((item) => item._id));

    recommendedList = allProducts.filter(
      (p) => recentCategories.has(p.category) && !recentIds.has(p._id)
    );
  } else if (type === 'category' && currentCategory) {
    recommendedList = allProducts.filter(
      (p) => p.category?.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Fallback to top rated / best sellers if list is too small
  if (recommendedList.length < limit) {
    const existingIds = new Set(recommendedList.map((p) => p._id));
    const fallback = allProducts.filter((p) => !existingIds.has(p._id));
    recommendedList = [...recommendedList, ...shuffleArray(fallback)];
  }

  const finalDisplay = recommendedList.slice(0, limit);

  if (!finalDisplay.length) return null;

  const iconMap = {
    'inspired-by-wishlist': <FiHeart className="w-5 h-5 text-rose-400" />,
    'based-on-recent': <FiEye className="w-5 h-5 text-cyan-400" />,
    category: <FiGrid className="w-5 h-5 text-emerald-400" />,
    personalized: <FiZap className="w-5 h-5 text-amber-400" />,
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
            {iconMap[type] || <FiTrendingUp className="w-5 h-5 text-indigo-400" />}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
            <p className="text-xs text-slate-400">
              Smart recommendations tailored to your shopping preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {finalDisplay.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProductsSection;
