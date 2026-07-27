import React, { useState, useRef, useEffect } from 'react';
import {
  FiBell,
  FiCheckCircle,
  FiPackage,
  FiTag,
  FiAward,
  FiTrendingDown,
  FiInfo,
  FiCheck,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationCenterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  // Click outside and Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const iconMap = {
    order: <FiPackage className="w-4 h-4 text-emerald-400" />,
    price_drop: <FiTrendingDown className="w-4 h-4 text-amber-400" />,
    membership: <FiAward className="w-4 h-4 text-purple-400" />,
    offer: <FiTag className="w-4 h-4 text-cyan-400" />,
    system: <FiInfo className="w-4 h-4 text-indigo-400" />,
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Notifications"
        title="Basketly Notification Center"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Compact Glassmorphism Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden text-left animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <FiBell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">Basketly Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold border border-indigo-500/30">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-slate-400 hover:text-indigo-400 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Mark all read"
                >
                  <FiCheck className="w-3.5 h-3.5" /> Read All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-2.5 bg-slate-800/40 border-b border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'order', label: 'Orders' },
              { id: 'offer', label: 'Offers' },
              { id: 'system', label: 'System' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80 scrollbar-thin">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <FiCheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-60" />
                <p className="font-bold text-white">No notifications right now</p>
                <p className="text-[11px] text-slate-500">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-800/60 group ${
                    n.unread ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 flex-shrink-0 mt-0.5">
                    {iconMap[n.type] || <FiInfo className="w-4 h-4 text-indigo-400" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                      <div className="flex items-center gap-2">
                        {n.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                          title="Delete notification"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{n.message}</p>
                    <span className="text-[9px] text-slate-500 font-semibold block pt-0.5">
                      {n.group || 'Today'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-400 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Clear Notifications
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-indigo-400 hover:underline font-bold text-[11px]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenterDropdown;
