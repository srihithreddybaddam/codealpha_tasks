import React, { useEffect } from 'react';
import { useCompare } from '../../contexts/CompareContext';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../contexts/ToastContext';
import { FiX, FiCheck, FiStar, FiZap, FiShoppingBag, FiAward, FiArrowLeft } from 'react-icons/fi';

const CompareModal = () => {
  const { compareItems, removeFromCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } =
    useCompare();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCompareModalOpen(false);
    };
    if (isCompareModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCompareModalOpen, setIsCompareModalOpen]);

  if (!isCompareModalOpen) return null;

  const minPrice =
    compareItems.length > 0
      ? Math.min(
          ...compareItems.map((p) =>
            p.discount ? p.price * (1 - p.discount / 100) : p.price
          )
        )
      : 0;

  const maxRating =
    compareItems.length > 0
      ? Math.max(...compareItems.map((p) => p.rating || 0))
      : 0;

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    addToast(`${product.name} added to Bag!`, 'success');
  };

  return (
    <div
      onClick={() => setIsCompareModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold mr-2 cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Product Specs & Value Comparison</h2>
              <p className="text-xs text-slate-400">
                Comparing {compareItems.length} selected items side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-bold text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        {compareItems.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-sm font-bold text-slate-300">
              No products selected for comparison yet.
            </p>
            <p className="text-xs text-slate-500">
              Check the "Compare" box on any product card to compare specs side-by-side.
            </p>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-xs cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto p-6 scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr>
                  <th className="p-4 w-40 text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-slate-800/40 rounded-l-2xl">
                    Feature / Product
                  </th>
                  {compareItems.map((prod) => (
                    <th key={prod._id} className="p-4 min-w-[200px] align-top bg-slate-800/20 border-l border-slate-800">
                      <div className="relative group text-center space-y-2">
                        <button
                          onClick={() => removeFromCompare(prod._id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-md cursor-pointer"
                          title="Remove item"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={
                            prod.images?.[0] ||
                            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80'
                          }
                          alt={prod.name}
                          className="w-24 h-24 rounded-2xl object-cover mx-auto bg-slate-800 border border-slate-700"
                        />
                        <h3 className="text-xs font-black text-white line-clamp-2 leading-snug">
                          {prod.name}
                        </h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {/* 1. Price Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Price</td>
                  {compareItems.map((prod) => {
                    const price = prod.discount
                      ? prod.price * (1 - prod.discount / 100)
                      : prod.price;
                    const isLowest = Math.abs(price - minPrice) < 0.01;
                    return (
                      <td key={prod._id} className="p-4 border-l border-slate-800">
                        <div className="font-extrabold text-base text-white">
                          ₹{price.toFixed(2)}
                        </div>
                        {isLowest && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                            BEST PRICE
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Rating Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Rating</td>
                  {compareItems.map((prod) => {
                    const r = prod.rating || 4.5;
                    const isTop = r === maxRating;
                    return (
                      <td key={prod._id} className="p-4 border-l border-slate-800">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <FiStar className="fill-current w-4 h-4" />
                          <span>{r}</span>
                        </div>
                        {isTop && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold">
                            TOP RATED
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Brand & Category */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Brand / Category</td>
                  {compareItems.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-800 font-semibold text-slate-300">
                      <div>{prod.brand}</div>
                      <div className="text-[10px] text-indigo-400">{prod.category}</div>
                    </td>
                  ))}
                </tr>

                {/* 4. Delivery Speed */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Delivery Speed</td>
                  {compareItems.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-800 text-emerald-400 font-bold">
                      <div className="flex items-center gap-1">
                        <FiZap className="text-amber-400 w-3.5 h-3.5" />
                        <span>10 Mins Hyperlocal</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Stock Status */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Stock Availability</td>
                  {compareItems.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-800">
                      {prod.stock > 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <FiCheck className="w-4 h-4" /> In Stock ({prod.stock})
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Return Policy */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Return Policy</td>
                  {compareItems.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-800 text-slate-400">
                      7 Days Doorstep Replacement
                    </td>
                  ))}
                </tr>

                {/* 7. Action Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-300">Action</td>
                  {compareItems.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-800">
                      <button
                        onClick={() => handleAddToCart(prod)}
                        disabled={prod.stock === 0}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 cursor-pointer"
                      >
                        <FiShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareModal;
