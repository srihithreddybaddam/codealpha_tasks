import React, { useState, useEffect, useRef } from 'react';
import {
  FiX,
  FiStar,
  FiHeart,
  FiShoppingBag,
  FiCheck,
  FiShield,
  FiTruck,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../contexts/ToastContext';

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct } = useProduct();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const thumbnailContainerRef = useRef(null);

  // Close on Escape Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', handleKeyDown);
      setQuantity(1);
      setSelectedImage(0);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.some((item) => item._id === quickViewProduct._id);

  const discountedPrice = quickViewProduct.discount
    ? (quickViewProduct.price * (1 - quickViewProduct.discount / 100)).toFixed(2)
    : quickViewProduct.price.toFixed(2);

  const images = quickViewProduct.images?.length
    ? quickViewProduct.images
    : ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80'];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    addToast(`${quickViewProduct.name} added to Bag!`, 'success');
    setQuickViewProduct(null);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(quickViewProduct._id);
      addToast(`${quickViewProduct.name} removed from Wishlist`, 'info');
    } else {
      addToWishlist(quickViewProduct);
      addToast(`${quickViewProduct.name} saved to Wishlist!`, 'success');
    }
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      thumbnailContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={() => setQuickViewProduct(null)}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-28 sm:pt-32 pb-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[78vh] sm:max-h-[82vh] flex flex-col my-auto transition-all"
      >
        {/* TOP NAVIGATION HEADER (BACK BUTTON, STATUS, AND CLOSE X) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-slate-800/90 border-b border-slate-700/80 sticky top-0 z-40 backdrop-blur-md">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-700/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
              Quick View Preview
            </span>
            <button
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close Modal"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-rose-600/90 border border-slate-700/60 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex flex-col md:flex-row gap-6 md:gap-8">
          {/* LEFT: SINGLE MAIN PREVIEW IMAGE + SMOOTH HORIZONTAL THUMBNAIL CAROUSEL */}
          <div className="w-full md:w-1/2 flex flex-col justify-start space-y-4">
            {/* Main Preview Container */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
              <img
                src={images[selectedImage] || images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {quickViewProduct.discount > 0 && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {quickViewProduct.discount}% OFF
                </span>
              )}
            </div>

            {/* HORIZONTAL THUMBNAIL CAROUSEL WITH LEFT/RIGHT CONTROLS */}
            {images.length > 1 && (
              <div className="relative flex items-center group pt-1">
                <button
                  onClick={() => scrollThumbnails('left')}
                  className="absolute -left-2 z-10 p-1.5 rounded-full bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-indigo-600 hover:text-white shadow-md transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={thumbnailContainerRef}
                  className="flex flex-row items-center gap-3 overflow-x-auto px-4 py-1.5 scrollbar-thin scroll-smooth w-full"
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        selectedImage === idx
                          ? 'border-indigo-500 scale-105 shadow-lg ring-2 ring-indigo-400/50'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollThumbnails('right')}
                  className="absolute -right-2 z-10 p-1.5 rounded-full bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-indigo-600 hover:text-white shadow-md transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span className="uppercase tracking-widest">{quickViewProduct.category}</span>
                <span className="text-slate-400 font-medium">SKU: {quickViewProduct.sku || 'AETH-001'}</span>
              </div>

              <h2 className="text-2xl font-black text-white leading-snug">
                {quickViewProduct.name}
              </h2>

              {/* Rating & Stock */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <FiStar className="fill-current" />
                  <span>{quickViewProduct.rating || 4.8}</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{quickViewProduct.numReviews || 48} reviews</span>
                <span className="text-slate-600">•</span>
                <span className="font-bold text-emerald-400">
                  {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black text-white">
                  ₹{discountedPrice}
                </span>
                {quickViewProduct.discount > 0 && (
                  <span className="text-sm text-slate-500 line-through font-semibold">
                    ₹{quickViewProduct.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Country of Origin</span>
                  <span className="font-bold text-white">India</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Shelf Life</span>
                  <span className="font-bold text-white">Fresh / Sealed Pack</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                {/* Quantity Controller */}
                <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-indigo-400 hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-indigo-400 hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock === 0}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>{quickViewProduct.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlistToggle}
                  aria-label="Wishlist"
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <FiTruck className="text-indigo-400" /> 10-Min Express
                </span>
                <span className="flex items-center gap-1.5">
                  <FiShield className="text-emerald-400" /> Inspected Quality
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCheck className="text-cyan-400" /> Easy Return
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
