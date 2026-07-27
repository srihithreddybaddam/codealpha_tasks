import React, { useEffect } from 'react';
import { FiX, FiAward, FiGift, FiClock, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { useRewardPoints } from '../../contexts/RewardPointsContext';

const RewardPointsModal = () => {
  const {
    balance,
    lifetimeEarned,
    redeemedPoints,
    history,
    isRewardModalOpen,
    setIsRewardModalOpen,
  } = useRewardPoints();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsRewardModalOpen(false);
    };
    if (isRewardModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRewardModalOpen, setIsRewardModalOpen]);

  if (!isRewardModalOpen) return null;

  return (
    <div
      onClick={() => setIsRewardModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Aetheria Rewards Program</h3>
              <p className="text-xs text-slate-400">Earn 10 points for every ₹100 spent</p>
            </div>
          </div>

          <button
            onClick={() => setIsRewardModalOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Current Balance</span>
            <div className="text-2xl font-black text-amber-400">{balance}</div>
            <span className="text-[10px] text-slate-500 font-bold">= ₹{balance} OFF</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Lifetime Earned</span>
            <div className="text-2xl font-black text-emerald-400">{lifetimeEarned}</div>
            <span className="text-[10px] text-slate-500 font-bold">Total Points</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Redeemed</span>
            <div className="text-2xl font-black text-indigo-400">{redeemedPoints}</div>
            <span className="text-[10px] text-slate-500 font-bold">Saved Money</span>
          </div>
        </div>

        {/* Reward Rules Info Box */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-indigo-400">
            <FiGift className="w-4 h-4" />
            <span>How Rewards Work</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Redeem points anytime during checkout. Every 1 Reward Point equals <strong>₹1.00 Instant Discount</strong> on your cart total!
          </p>
        </div>

        {/* History Log */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Points Activity</span>
          </h4>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No points activity recorded yet.</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.type === 'EARNED' ? (
                      <FiPlusCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <FiMinusCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <h5 className="font-bold text-white leading-snug">{item.description}</h5>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                  </div>

                  <span
                    className={`font-black text-sm ${
                      item.type === 'EARNED' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.type === 'EARNED' ? `+${item.points}` : `-${item.points}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={() => setIsRewardModalOpen(false)}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          Close Rewards
        </button>
      </div>
    </div>
  );
};

export default RewardPointsModal;
