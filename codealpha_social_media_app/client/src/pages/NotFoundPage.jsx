import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 border border-surface-container-high shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary-fixed/40 text-primary flex items-center justify-center mx-auto text-4xl font-bold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-on-surface">Page Not Found</h1>
          <p className="text-xs text-outline leading-relaxed">
            The Vibely page or memory you were looking for doesn't exist or has expired.
          </p>
        </div>

        <Link
          to="/home"
          className="inline-block w-full py-3.5 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-full shadow-md shadow-primary/20 transition-all active:scale-95"
        >
          Return to Home Feed
        </Link>
      </div>
    </div>
  );
}
