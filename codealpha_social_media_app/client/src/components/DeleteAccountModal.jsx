import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import settingsService from '../services/settingsService';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password to confirm account deletion.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await settingsService.deleteAccount(password);
      if (res.success) {
        logout();
        window.location.href = '/login';
      } else {
        setError(res.message || 'Account deletion failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Incorrect password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-error/30 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <h3 className="font-bold text-base text-error flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Delete Account Permanently
          </h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-3 bg-error/10 border border-error/30 rounded-2xl text-xs text-error leading-relaxed font-medium">
          Warning: Deleting your account is permanent and cannot be undone. All your posts, Sparks, Moments, and messages will be permanently erased.
        </div>

        {error && <div className="text-xs text-error font-semibold text-center">{error}</div>}

        <form onSubmit={handleDelete} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Confirm Your Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {submitting ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
