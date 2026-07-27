import React from 'react';
import { useCompare } from '../../contexts/CompareContext';
import { FiX, FiColumns, FiTrash2 } from 'react-icons/fi';

const CompareBar = () => {
  const { compareItems, removeFromCompare, clearCompare, setIsCompareModalOpen, maxCompareLimit } =
    useCompare();

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-slate-900/95 border border-indigo-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl transition-all animate-slideUp">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left Info & Product Thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-800 flex-shrink-0">
            <div className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5">
              <FiColumns className="w-4 h-4" />
              <span>
                Compare ({compareItems.length}/{maxCompareLimit})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.map((item) => (
              <div
                key={item._id}
                className="relative group flex items-center gap-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-1.5 pr-3 flex-shrink-0"
              >
                <img
                  src={
                    item.images?.[0] ||
                    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={item.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <span className="text-xs font-bold text-white max-w-[90px] truncate">
                  {item.name}
                </span>
                <button
                  onClick={() => removeFromCompare(item._id)}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                  title="Remove from comparison"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FiColumns className="w-4 h-4" />
            <span>Compare Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
