import React, { useState } from 'react';
import { FiPlus, FiShoppingBag, FiCheck, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../contexts/ToastContext';

const FrequentlyBoughtTogether = ({ currentProduct, complementaryProducts = [] }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!currentProduct || !complementaryProducts.length) return null;

  const allItems = [currentProduct, ...complementaryProducts.slice(0, 2)];

  // State to track which items in bundle are selected (current product is selected by default)
  const [selectedIds, setSelectedIds] = useState(() =>
    allItems.map((p) => p._id)
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedItems = allItems.filter((p) => selectedIds.includes(p._id));

  // Compute total bundle price with extra 5% bundle savings
  const rawTotal = selectedItems.reduce((sum, item) => {
    const itemPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + itemPrice;
  }, 0);

  const bundleTotal = (rawTotal * 0.95).toFixed(2);
  const bundleSavings = (rawTotal * 0.05).toFixed(2);

  const handleAddBundleToCart = () => {
    if (!selectedItems.length) return;
    selectedItems.forEach((item) => {
      addToCart(item, 1);
    });
    addToast(
      `Added ${selectedItems.length} items to Bag with 5% extra bundle savings!`,
      'success'
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-black text-white">Frequently Bought Together</h2>
          <p className="text-xs text-slate-400">
            Combine pantry staples & save an extra 5% on bundle order
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase tracking-wider">
          Combo Savings
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Products Visual Row with Plus Sign */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 max-w-full">
          {allItems.map((prod, idx) => {
            const isSelected = selectedIds.includes(prod._id);
            const discountedPrice = prod.discount
              ? (prod.price * (1 - prod.discount / 100)).toFixed(2)
              : prod.price.toFixed(2);

            return (
              <React.Fragment key={prod._id}>
                {idx > 0 && <FiPlus className="w-5 h-5 text-slate-500 flex-shrink-0" />}

                <div
                  onClick={() => toggleSelect(prod._id)}
                  className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer w-36 flex-shrink-0 ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500/80 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="absolute top-2 left-2 z-10">
                    {isSelected ? (
                      <FiCheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <FiSquare className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <img
                    src={
                      prod.images?.[0] ||
                      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80'
                    }
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-800 mb-2"
                  />
                  <h4 className="text-xs font-bold text-white text-center line-clamp-1">
                    {prod.name}
                  </h4>
                  <span className="text-xs font-extrabold text-indigo-400 mt-1">
                    ₹{discountedPrice}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bundle Price & Add CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 w-full lg:w-64 flex-shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Total Bundle Price ({selectedItems.length} items):
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₹{bundleTotal}</span>
              {selectedItems.length > 1 && (
                <span className="text-xs text-emerald-400 font-bold">
                  Saved ₹{bundleSavings}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            disabled={!selectedItems.length}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Add Selected ({selectedItems.length}) to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
