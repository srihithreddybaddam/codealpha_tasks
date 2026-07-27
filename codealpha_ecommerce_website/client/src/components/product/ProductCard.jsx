import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiStar,
  FiHeart,
  FiEye,
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiXCircle,
  FiZap,
  FiCheckSquare,
  FiSquare,
  FiShare2,
} from 'react-icons/fi';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useProduct } from '../../hooks/useProduct';
import { useCompare } from '../../contexts/CompareContext';
import { useToast } from '../../contexts/ToastContext';
import ShareModal from '../common/ShareModal';

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { setQuickViewProduct } = useProduct();
  const { toggleCompare, isCompared, maxCompareLimit } = useCompare();
  const { addToast } = useToast();

  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const cartItem = cart.find((item) => item._id === product._id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const inCompare = isCompared(product._id);

  const isOrganic =
    product.category?.toLowerCase().includes('organic') ||
    product.name?.toLowerCase().includes('organic') ||
    product.tags?.some((t) => t.toLowerCase().includes('organic'));

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product._id);
      addToast(`${product.name} removed from Wishlist`, 'info');
    } else {
      addToWishlist(product);
      addToast(`${product.name} saved to Wishlist!`, 'success');
    }
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = toggleCompare(product);
    if (!success && !inCompare) {
      addToast(`You can compare maximum ${maxCompareLimit} products at a time.`, 'warning');
    } else if (!inCompare) {
      addToast(`Added ${product.name} to comparison!`, 'info');
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to Bag!`, 'success');
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product._id, cartQuantity + 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity <= 1) {
      removeFromCart(product._id);
      addToast(`${product.name} removed from Bag`, 'info');
    } else {
      updateQuantity(product._id, cartQuantity - 1);
    }
  };

  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const mainImage =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80';

  return (
    <>
      <div className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        {/* Top Badges & Compare Checkbox Bar */}
        <div className="flex items-center justify-between mb-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.discount > 0 && (
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                {product.discount}% OFF
              </span>
            )}
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FiZap className="w-2.5 h-2.5 text-amber-400" />
              <span>10-MIN</span>
            </span>
            {isOrganic && (
              <span className="bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                ORGANIC
              </span>
            )}
          </div>

          {/* Compare Checkbox */}
          <button
            onClick={handleCompareToggle}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border transition-all cursor-pointer ${
              inCompare
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-white'
            }`}
            title="Add to Product Compare"
          >
            {inCompare ? <FiCheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <FiSquare className="w-3.5 h-3.5" />}
            <span>Compare</span>
          </button>
        </div>

        {/* Clickable Image Container */}
        <Link
          to={`/products/${product._id}`}
          className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-3 cursor-pointer block"
        >
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Action Overlay Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={handleWishlistToggle}
              aria-label="Wishlist"
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-rose-500 hover:text-white'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleQuickView}
              aria-label="Quick View"
              className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:bg-indigo-600 hover:text-white backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
            >
              <FiEye className="w-4 h-4" />
            </button>

            <button
              onClick={handleShareClick}
              aria-label="Share Product"
              className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:bg-cyan-600 hover:text-white backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stock Status Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            {product.stock <= 5 && product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md">
                Low Stock ({product.stock} left)
              </span>
            ) : product.stock === 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/90 text-white backdrop-blur-md">
                <FiXCircle className="w-3 h-3" /> Out of Stock
              </span>
            ) : null}
          </div>
        </Link>

        {/* Info Content */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-400 mb-1">
              <span className="uppercase tracking-wider truncate max-w-[120px]">{product.category}</span>
              <span className="text-slate-500 font-normal truncate max-w-[100px]">{product.brand}</span>
            </div>

            <Link to={`/products/${product._id}`}>
              <h3 className="text-sm font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          <div>
            {/* Rating */}
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold my-2">
              <FiStar className="fill-current w-3.5 h-3.5" />
              <span>{product.rating || 4.8}</span>
              <span className="text-[11px] text-slate-500 font-normal">
                ({product.numReviews || 45})
              </span>
            </div>

            {/* Pricing & Interactive Add to Bag / Controller */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <div className="text-lg font-extrabold text-white">
                  ₹{discountedPrice}
                </div>
                {product.discount > 0 && (
                  <div className="text-[11px] text-slate-500 line-through -mt-1">
                    ₹{product.price.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Add to Bag vs Inline Controller [-] Q [+] */}
              {cartQuantity > 0 ? (
                <div className="flex items-center border border-indigo-500/60 rounded-xl overflow-hidden bg-slate-800">
                  <button
                    onClick={handleDecrease}
                    className="px-2.5 py-1.5 text-indigo-400 hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                    title="Decrease Quantity"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-black text-white">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="px-2.5 py-1.5 text-indigo-400 hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                    title="Increase Quantity"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <FiShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Product Modal Popup */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
