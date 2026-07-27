import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { AccentColor } from '../../types';
import { Settings, Palette, Volume2, Moon, Sun, User } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    accentColor, 
    setAccentColor, 
    isDarkMode, 
    setIsDarkMode, 
    soundEnabled, 
    setSoundEnabled
  } = useApp();

  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState(user?.role || '');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');

  const accentColors: { id: AccentColor; label: string; class: string }[] = [
    { id: 'purple', label: 'Violet Aura', class: 'bg-purple-500' },
    { id: 'cyan', label: 'Cyan Cyber', class: 'bg-cyan-500' },
    { id: 'emerald', label: 'Emerald Glow', class: 'bg-emerald-500' },
    { id: 'pink', label: 'Neon Pink', class: 'bg-pink-500' },
    { id: 'orange', label: 'Amber Solar', class: 'bg-orange-500' },
    { id: 'indigo', label: 'Deep Indigo', class: 'bg-indigo-500' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-100 tracking-tight">Platform Preferences & Profile</h2>
            <p className="text-xs text-slate-400">Glassmorphism theme customization, user profile & system controls</p>
          </div>
        </div>
      </div>

      {/* User Profile Form Section */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-100">User Profile Information</h3>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Job Title</label>
              <input
                type="text"
                placeholder="Enter your job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="glass-input w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Company Name</label>
              <input
                type="text"
                placeholder="Enter your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="glass-input w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="glass-input w-full"
            />
          </div>
        </form>
      </div>

      {/* Theme Accent Color Customizer */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-slate-100">Accent Theme Color</h3>
        </div>
        <p className="text-xs text-slate-400">Select dynamic glass glow color theme</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {accentColors.map((col) => (
            <button
              key={col.id}
              onClick={() => setAccentColor(col.id)}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                accentColor === col.id
                  ? 'bg-white/15 border-purple-400 scale-105 shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className={`w-6 h-6 rounded-full ${col.class} shadow-md`} />
              <span className="text-xs font-semibold text-slate-200">{col.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode & Audio Controls */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Dark / Light Glass Mode</h4>
              <p className="text-xs text-slate-400">Toggle ambient background lighting contrast</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="glass-button-secondary text-xs"
          >
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Audio Micro-Interactions</h4>
              <p className="text-xs text-slate-400">Web Audio synthesizer feedback on clicks & task drops</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
