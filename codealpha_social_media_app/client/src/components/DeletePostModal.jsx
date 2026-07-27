import React from 'react';

export default function DeletePostModal({ isOpen, onClose, onConfirm, deleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto text-2xl">
          <span className="material-symbols-outlined">delete</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-on-surface">Delete Post?</h3>
          <p className="text-xs text-outline leading-relaxed">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 border border-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold rounded-full transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 bg-error hover:bg-red-700 text-white text-xs font-semibold rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {deleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
