import React, { useState } from 'react';
import settingsService from '../services/settingsService';

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetName }) {
  const [reason, setReason] = useState('Spam');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasonsList = ['Spam', 'Harassment', 'Fake Account', 'Violence', 'Adult Content', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await settingsService.submitReport({
        targetType: targetType || 'post',
        targetId: targetId || 'default',
        reason,
        description
      });

      if (res.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.warn('[Report Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-surface-container-high animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-error">flag</span>
            Report {targetType ? targetType.charAt(0).toUpperCase() + targetType.slice(1) : 'Content'}
          </h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-success animate-bounce">check_circle</span>
            <h4 className="font-bold text-sm text-on-surface">Report Submitted</h4>
            <p className="text-xs text-outline">Thank you for keeping Vibely safe. Our team will review this report.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-on-surface-variant">
              Why are you reporting {targetName ? `"${targetName}"` : `this ${targetType}`}?
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface">Select Reason</label>
              <div className="grid grid-cols-2 gap-2">
                {reasonsList.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setReason(r)}
                    className={`p-2.5 rounded-2xl text-xs font-semibold border text-left transition-all ${
                      reason === r
                        ? 'bg-error/10 border-error text-error'
                        : 'bg-surface-container-low border-surface-container-high text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Additional Details (Optional)</label>
              <textarea
                rows={3}
                placeholder="Provide details about why this violates Vibely community guidelines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-surface-container-high rounded-2xl text-xs focus:outline-none focus:border-error focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-surface-container-low text-on-surface font-semibold rounded-2xl text-xs hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-error hover:bg-error/90 text-white font-semibold rounded-2xl text-xs shadow-md shadow-error/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
