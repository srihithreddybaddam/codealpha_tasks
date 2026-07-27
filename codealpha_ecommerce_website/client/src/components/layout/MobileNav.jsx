import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingBag, FiHeart, FiUser, FiInfo, FiMail } from 'react-icons/fi';
import BasketlyLogo from '../common/BasketlyLogo';

const MobileNav = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Store', path: '/products', icon: FiGrid },
    { name: 'Cart', path: '/cart', icon: FiShoppingBag },
    { name: 'Wishlist', path: '/wishlist', icon: FiHeart },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'About', path: '/about', icon: FiInfo },
    { name: 'Contact', path: '/contact', icon: FiMail },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col justify-between animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <BasketlyLogo size="sm" />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                >
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/login"
            onClick={onClose}
            className="w-full btn-gradient-primary py-3 text-sm text-center"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
