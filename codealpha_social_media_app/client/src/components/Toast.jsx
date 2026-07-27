import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-bounce">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-semibold text-white transition-all ${
          isSuccess ? 'bg-green-600' : 'bg-error'
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {isSuccess ? 'check_circle' : 'error'}
        </span>
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
