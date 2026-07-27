import React, { useState, useEffect } from 'react';
import { FiX, FiRefreshCw, FiCheckCircle, FiUpload, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

const returnReasons = [
  'Defective / Damaged Item',
  'Item Expired or Close to Expiry',
  'Incorrect Product Delivered',
  'Quality Not Up to Mark',
  'Changed Mind / No Longer Needed',
];

const ReturnModal = ({ isOpen, onClose, order }) => {
  const { addToast } = useToast();
  const [requestType, setRequestType] = useState('return'); // 'return', 'exchange', 'replacement'
  const [reason, setReason] = useState(returnReasons[0]);
  const [comments, setComments] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const orderId = order._id || order.id || 'ord-1001';

  // 7-Day return policy calculation
  const deliveryDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const now = new Date();
  const daysDiff = Math.max(0, 7 - Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    const requestObj = {
      id: `RET-${Date.now()}`,
      orderId,
      requestType,
      reason,
      comments,
      photoUrl,
      status: 'Submitted',
      date: new Date().toISOString().split('T')[0],
    };

    // Save to Local Storage
    const existing = JSON.parse(localStorage.getItem('basketly_return_requests') || '[]');
    localStorage.setItem('basketly_return_requests', JSON.stringify([requestObj, ...existing]));

    setSubmittedStatus('Submitted');
    addToast(`Return request #${requestObj.id} submitted successfully!`, 'success');
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
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FiRefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Return & Exchange Request</h3>
              <p className="text-xs text-slate-400">Order #{orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Return Period Badge */}
        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
          <span className="font-bold text-indigo-300">7-Day Doorstep Guarantee</span>
          <span className="font-black text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {daysDiff} Days Remaining
          </span>
        </div>

        {submittedStatus ? (
          <div className="p-6 text-center space-y-3 bg-emerald-950/30 border border-emerald-800 rounded-2xl">
            <FiCheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-black text-white">Request Submitted!</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your request for order #{orderId} has been logged. Our executive will inspect & collect the item within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Request Type Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Request Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'return', label: 'Refund' },
                  { id: 'exchange', label: 'Exchange' },
                  { id: 'replacement', label: 'Replace' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRequestType(type.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      requestType === type.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Reason for Request</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {returnReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Comments & Details</label>
              <textarea
                rows="3"
                placeholder="Describe the issue with your item..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Optional Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Proof Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-750"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReturnModal;
