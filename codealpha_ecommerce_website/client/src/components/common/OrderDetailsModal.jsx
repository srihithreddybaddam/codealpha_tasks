import React, { useEffect } from 'react';
import {
  FiX,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiFileText,
  FiRefreshCw,
  FiClock,
  FiPhone,
  FiMessageSquare,
  FiShoppingBag,
  FiShield,
} from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../contexts/ToastContext';

const timelineStages = [
  { key: 'confirmed', label: 'Order Confirmed', time: 'Just Now' },
  { key: 'verified', label: 'Payment Verified', time: '1 min ago' },
  { key: 'preparing', label: 'Preparing Order', time: '3 mins ago' },
  { key: 'packed', label: 'Packed', time: '5 mins ago' },
  { key: 'out', label: 'Out For Delivery', time: '7 mins ago' },
  { key: 'arriving', label: 'Arriving Soon', time: '9 mins ago' },
  { key: 'delivered', label: 'Delivered', time: '10 mins' },
];

const getStageIndex = (status) => {
  if (status === 'Delivered') return 6;
  if (status === 'Out For Delivery') return 4;
  if (status === 'Packed') return 3;
  if (status === 'Cancelled') return -1;
  return 2;
};

const OrderDetailsModal = ({ isOpen, onClose, order, onOpenInvoice, onOpenReturn }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.removeEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const orderId = order._id || order.id || order.orderNumber || 'ord-1001';
  const orderItems = order.items || order.orderItems || [];
  const currentStageIdx = getStageIndex(order.status);
  const shipping = order.shippingAddress || {};

  const handleReorder = () => {
    orderItems.forEach((item) => addToCart(item, item.quantity || 1));
    addToast('Order items added to Shopping Bag!', 'success');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-left overflow-y-auto scrollbar-thin"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Order Details</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold border border-indigo-500/30 uppercase">
                  #{orderId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Today'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* 7-STAGE LIVE DELIVERY TIMELINE */}
        {order.status !== 'Cancelled' && (
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <FiTruck className="text-emerald-400" /> Live Delivery Timeline Status
              </span>
              <span className="text-[10px] font-extrabold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                ETA: 10 Mins
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 relative">
              {timelineStages.map((stage, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = currentStageIdx === idx;
                return (
                  <div key={stage.key} className="flex flex-col items-center text-center space-y-1.5 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 ring-4 ring-amber-500/30 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isPassed ? <FiCheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] font-extrabold leading-tight ${
                        isCurrent ? 'text-amber-400' : isPassed ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DELIVERY PARTNER CARD */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xs">
              R
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Rajesh Kumar</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold">★ 4.9</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                Express Delivery Runner • Vehicle: <strong className="text-slate-200">TS-09-EX-4092</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('Calling Delivery Runner: +91 98765 43210...', 'info')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
              title="Call Delivery Runner"
            >
              <FiPhone className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('Opening Delivery Chat...', 'info')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors cursor-pointer"
              title="Message Delivery Runner"
            >
              <FiMessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Items Ordered ({orderItems.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {orderItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.image ||
                      item.images?.[0] ||
                      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-800"
                  />
                  <div>
                    <h5 className="font-bold text-white line-clamp-1">{item.name}</h5>
                    <span className="text-[10px] text-slate-400">
                      Qty: {item.quantity || 1} • ₹{item.price} each
                    </span>
                  </div>
                </div>
                <span className="font-black text-white">
                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SHIPPING & PAYMENT INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FiMapPin className="text-indigo-400" /> Delivery Address
            </span>
            <p className="font-bold text-white">{shipping.fullName || 'Customer'}</p>
            <p className="text-slate-300">{shipping.street || '123 Innovation Way'}</p>
            <p className="text-slate-300">{shipping.city}, {shipping.pincode || '94105'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
              <FiShield className="text-emerald-400" /> Payment Summary
            </span>
            <p className="font-bold text-white">Method: {order.paymentMethod || 'UPI / Card Online'}</p>
            <p className="text-slate-300">Status: <strong className="text-emerald-400">PAID & VERIFIED</strong></p>
            <p className="font-black text-indigo-400 text-sm pt-1">
              Grand Total: ₹{(order.grandTotal || order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {onOpenInvoice && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInvoice(order);
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiFileText className="text-indigo-400" /> Download Tax Invoice
              </button>
            )}

            {onOpenReturn && order.status === 'Delivered' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReturn(order);
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FiRefreshCw /> Return / Exchange
              </button>
            )}
          </div>

          <button
            onClick={handleReorder}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FiShoppingBag /> Reorder All Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
