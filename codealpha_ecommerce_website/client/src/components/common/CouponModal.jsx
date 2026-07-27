import React, { useEffect } from 'react';
import { FiX, FiTag, FiCheck, FiPercent, FiCopy } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../contexts/ToastContext';

const availableCoupons = [
  {
    code: 'BASKETLY10',
    discount: '10% OFF',
    description: 'Save 10% on all fresh grocery and daily essential orders.',
    minOrder: 199,
  },
  {
    code: 'WELCOME20',
    discount: '20% OFF',
    description: 'Welcome bonus: Get 20% OFF on your organic produce order.',
    minOrder: 299,
  },
  {
    code: 'FRESH30',
    discount: '₹50 Flat OFF',
    description: 'Flat ₹50 OFF on orders above ₹499.',
    minOrder: 499,
  },
];

const CouponModal = ({ isOpen, onClose }) => {
  const { applyCoupon, appliedCoupon } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = (code) => {
    const res = applyCoupon(code);
    if (res.success) {
      addToast(res.message, 'success');
      onClose();
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiTag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Store Coupons & Promo Codes</h3>
              <p className="text-xs text-slate-400">Select a coupon to claim instant cart discount</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Coupons List */}
        <div className="space-y-3">
          {availableCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <div
                key={coupon.code}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isApplied
                    ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-indigo-500/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-mono font-extrabold text-xs border border-indigo-500/40">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-black text-emerald-400">{coupon.discount}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{coupon.description}</p>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Valid on orders above ₹{coupon.minOrder}
                  </span>
                </div>

                <button
                  onClick={() => handleApply(coupon.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  }`}
                >
                  {isApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CouponModal;
