import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 glass-panel border-t border-primary/10 py-8 px-6 text-xs text-outline">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            V
          </div>
          <span className="font-bold text-sm text-on-surface">Vibely</span>
          <span className="text-[11px] text-outline ml-2">"Create. Connect. Inspire."</span>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/settings" className="hover:text-primary transition-colors">Help Center</Link>
          <Link to="/settings" className="hover:text-primary transition-colors">Contact</Link>
          <a href="#careers" onClick={(e) => { e.preventDefault(); alert('Vibely Careers: We are hiring full-stack & mobile engineers in Bengaluru & Hyderabad! Email careers@vibely.app'); }} className="hover:text-primary transition-colors">Careers</a>
          <a href="#blog" onClick={(e) => { e.preventDefault(); alert('Vibely Engineering Blog: Reading Glassmorphic Design Patterns in 2026.'); }} className="hover:text-primary transition-colors">Blog</a>
        </div>

        {/* Copyright & Version */}
        <div className="text-right">
          <p className="font-semibold text-on-surface">© 2026 Vibely Inc. All rights reserved.</p>
          <p className="text-[10px] text-outline mt-0.5">Version 1.9.0 (Indian Social Platform Edition)</p>
        </div>
      </div>
    </footer>
  );
}
