import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap, 
  Kanban,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onNavigateAuth: (view: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Ambient Background Blobs */}
      <div className="bg-ambient-blob-1" />
      <div className="bg-ambient-blob-2" />
      <div className="bg-ambient-blob-3" />

      {/* Navigation Header */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            AETHER <span className="text-purple-400 font-normal text-xs font-mono">2026 SaaS</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-purple-300 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateAuth('login')}
            className="glass-button-secondary text-xs"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigateAuth('register')}
            className="glass-button-primary text-xs"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Production SaaS Project Management Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight max-w-4xl leading-tight"
        >
          Project Management for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">High Velocity</span> Product Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          An ultra-fast, specular glassmorphism workspace equipped with interactive Kanban boards, Gantt timelines, real-time presence, AI Copilot, and custom live themes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => onNavigateAuth('register')}
            className="glass-button-primary text-sm px-8 py-4 shadow-2xl shadow-purple-500/30"
          >
            <Zap className="w-5 h-5 text-cyan-300" />
            <span>Create Your Account</span>
          </button>
          <button
            onClick={() => onNavigateAuth('login')}
            className="glass-button-secondary text-sm px-8 py-4"
          >
            <span>Sign In to Existing Workspace</span>
          </button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div id="features" className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
          <div className="glass-card p-6 space-y-3 border border-white/10">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 w-fit">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-100">Drag & Drop Kanban</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              GPU-accelerated Kanban board with customizable column status, WIP limits, subtasks, checklists, and assignees.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 border border-white/10">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-100">Isolated Data Ownership</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every registered user receives an independent, secure workspace. Personal data and projects stay 100% private.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3 border border-white/10">
            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/30 w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-100">Live Themes & Glassmorphism</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch seamlessly between 7 specular live themes with real-time glass refractions and smooth micro-animations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-nav py-8 px-6 text-center text-xs text-slate-500 border-t border-white/10">
        <p>© 2026 AETHER PM Inc. All rights reserved. Enterprise SaaS Platform.</p>
      </footer>
    </div>
  );
};
