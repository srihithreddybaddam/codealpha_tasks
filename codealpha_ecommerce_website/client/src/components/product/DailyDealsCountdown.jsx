import React, { useState, useEffect } from 'react';
import { FiClock, FiZap } from 'react-icons/fi';

const DailyDealsCountdown = ({ title = "Today's Lightning Deals", expiryHours = 8 }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    return expiryHours * 3600;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : expiryHours * 3600));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryHours]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <FiZap className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              Flash Offers
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Limited stock items discounted up to 25% OFF. Order before timer expires!
          </p>
        </div>
      </div>

      {/* Countdown Timer Boxes */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-400 font-mono font-black text-lg flex items-center justify-center shadow-md">
              {formatDigit(hours)}
            </span>
            <span className="text-[9px] font-extrabold uppercase text-slate-400 mt-1">HRS</span>
          </div>
          <span className="text-amber-400 font-bold text-lg mb-4">:</span>

          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-400 font-mono font-black text-lg flex items-center justify-center shadow-md">
              {formatDigit(minutes)}
            </span>
            <span className="text-[9px] font-extrabold uppercase text-slate-400 mt-1">MIN</span>
          </div>
          <span className="text-amber-400 font-bold text-lg mb-4">:</span>

          <div className="flex flex-col items-center">
            <span className="w-10 h-10 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-400 font-mono font-black text-lg flex items-center justify-center shadow-md">
              {formatDigit(seconds)}
            </span>
            <span className="text-[9px] font-extrabold uppercase text-slate-400 mt-1">SEC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDealsCountdown;
