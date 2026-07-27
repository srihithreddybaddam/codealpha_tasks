import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-center items-center px-4 py-8 relative selection:bg-primary-container selection:text-white">
      {/* Soft Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/85 glass-panel rounded-[32px] p-8 shadow-xl border border-surface-container-high relative z-10 space-y-6">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              V
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">Vibely</span>
          </Link>
          {title && <h2 className="text-xl font-bold text-on-surface pt-2">{title}</h2>}
          {subtitle && <p className="text-xs text-outline">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
