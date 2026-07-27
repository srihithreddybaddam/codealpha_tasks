import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheck, FiShare2, FiSend, FiMail, FiTwitter, FiFacebook } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
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

  if (!isOpen || !product) return null;

  const currentUrl = window.location.href;
  const shareTitle = `Check out ${product.name} on Aetheria Marketplace!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    addToast('Product link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${currentUrl}`)}`,
    },
    {
      name: 'Telegram',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'Twitter / X',
      color: 'bg-slate-800 hover:bg-slate-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Email',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiShare2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Share Product</h3>
              <p className="text-xs text-slate-400">Share with family & friends</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <img
            src={
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
            }
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase">
              {product.category} • ₹{product.price}
            </span>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Copy Direct Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-2xl px-3.5 py-2.5 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Share via App</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {shareOptions.map((opt) => (
              <a
                key={opt.name}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2.5 px-3 rounded-2xl ${opt.color} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer`}
              >
                <span>{opt.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
