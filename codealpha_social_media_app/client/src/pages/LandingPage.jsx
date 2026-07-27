import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between selection:bg-primary-container selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass-nav border-b border-surface-container-high px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            V
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">Vibely</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary px-4 py-2 rounded-full hover:bg-surface-container transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-full shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed/50 border border-primary-fixed text-primary text-xs font-semibold">
            <span className="text-sm">✨</span> Redefining Modern Social Connections
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
            Create. Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">Inspire.</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Welcome to Vibely — the next-generation social networking platform built with modern glassmorphism, Daily Sparks, private Circles, and vertical Moments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-container text-white rounded-full font-semibold text-base shadow-lg shadow-primary/25 transition-all active:scale-95 text-center"
            >
              Join Vibely Free
            </Link>
            <Link
              to="/home"
              className="w-full sm:w-auto px-8 py-3.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-full font-semibold text-base border border-surface-container-high transition-all text-center"
            >
              Explore Public Feed →
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-xs text-outline">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80" alt="User" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80" alt="User" />
            </div>
            <span>Joined by 14,000+ creators & developers</span>
          </div>
        </div>

        {/* Hero Card Preview */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="glass-card rounded-[32px] p-6 border border-surface-container-high shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" alt="Elena" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                <div>
                  <h4 className="font-bold text-sm text-on-surface flex items-center gap-1">
                    Elena Rostova <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  </h4>
                  <p className="text-xs text-outline">@elena_design • Status: Designing 2026 ✨</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-fixed/40 text-primary text-xs font-semibold rounded-full">
                Daily Spark
              </span>
            </div>

            <p className="text-sm text-on-surface leading-relaxed">
              Just deployed the new Vibely glassmorphic interface! Breathable layouts, 24h Daily Sparks, and Tokyo studio previews. 🚀
            </p>

            <div className="rounded-2xl overflow-hidden h-52 bg-surface-container-low">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80" alt="UI" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between text-xs text-outline pt-2">
              <span className="flex items-center gap-1 text-secondary font-semibold"><span className="material-symbols-outlined filled text-base">favorite</span> 1,420</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">chat_bubble</span> 388</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">bookmark</span> Saved</span>
            </div>
          </div>
        </div>
      </main>

      {/* Vibely Features Section */}
      <section className="bg-surface-container-lowest border-t border-surface-container-high py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Designed for Authentic Social Moments</h2>
            <p className="text-sm text-outline max-w-lg mx-auto">Vibely-exclusive features built for privacy, memory preservation, and creative expression.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container-high space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">⚡</div>
              <h3 className="font-bold text-base text-on-surface">Daily Sparks</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Share 24-hour disappearing updates and photos with your connections without polluting your main feed.</p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container-high space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl font-bold">🔒</div>
              <h3 className="font-bold text-base text-on-surface">Circle Sharing</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Private posts visible strictly to selected close friends with end-to-end access controls.</p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container-high space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">🖼️</div>
              <h3 className="font-bold text-base text-on-surface">Memory Wall</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Pin up to 6 of your favorite moments, achievements, and travels directly to your profile header.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-container-high py-8 px-6 text-center text-xs text-outline">
        <p>© 2026 Vibely Social Platform Inc. All rights reserved. Built with original Stitch AI UI System.</p>
      </footer>
    </div>
  );
}
