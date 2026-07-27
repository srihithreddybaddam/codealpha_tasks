import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ type = 'info', message, onClose, visible = true }) => {
  if (!visible || !message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-500',
      icon: FiCheckCircle,
    },
    error: {
      bg: 'bg-red-500',
      icon: FiAlertCircle,
    },
    info: {
      bg: 'bg-indigo-600',
      icon: FiInfo,
    },
  };

  const Config = typeConfig[type] || typeConfig.info;
  const Icon = Config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${Config.bg} text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-md border border-white/20 backdrop-blur-md`}>
        <Icon className="w-5 h-5 flex-shrink-0 text-white" />
        <p className="text-sm font-medium pr-2">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
