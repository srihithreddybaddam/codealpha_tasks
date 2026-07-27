import React, { createContext, useState, useContext } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-400'
                : 'bg-slate-900/95 border-indigo-500/50 text-indigo-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <FiCheckCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'error' && <FiAlertCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'info' && <FiInfo className="w-5 h-5 flex-shrink-0" />}
              <span className="text-xs font-bold text-white leading-tight">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return fallback noop if outside provider
    return {
      addToast: (msg) => console.log('Toast:', msg),
      removeToast: () => {},
    };
  }
  return context;
};
