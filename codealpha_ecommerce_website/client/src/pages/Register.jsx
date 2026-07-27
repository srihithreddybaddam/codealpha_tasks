import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiZap,
  FiShield,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiCircle,
  FiXCircle,
  FiAlertCircle,
  FiAward,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import BasketlyLogo from '../components/common/BasketlyLogo';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Requirement Checks
  const passwordRules = [
    { label: 'Minimum 8 characters', valid: formData.password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(formData.password) },
    { label: 'One number (0-9)', valid: /[0-9]/.test(formData.password) },
    { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const allRulesPassed = passwordRules.every((r) => r.valid);
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allRulesPassed) {
      setError('Please satisfy all password complexity requirements before proceeding.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please ensure both password fields match.');
      return;
    }

    if (!agreedTerms) {
      setError('Please agree to the Terms & Conditions to create an account.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      addToast('Account created successfully! Welcome to Basketly.', 'success');
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Registration failed. Try using a different email address.');
      addToast('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Create Account">
      {/* 100vw / 100vh FULL VIEWPORT ABSOLUTE POSITIONING CONTAINER */}
      <div className="relative w-screen min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
        
        {/* FULL SCREEN BACKGROUND IMAGE (COVERING 100% VIEWPORT) */}
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1920&auto=format&fit=crop&q=80"
            alt="Aetheria Grocery Supermarket"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/90 backdrop-blur-[3px]" />
        </div>

        {/* Ambient Glow Effects */}
        <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none z-0" />
        <div className="fixed bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none z-0" />

        {/* ================================================== */}
        {/* LEFT HERO CONTENT (FLOATING DIRECTLY ON BACKGROUND AT LEFT 8%) */}
        {/* ================================================== */}
        <div className="hidden lg:flex flex-col space-y-6 text-white z-10 absolute left-[8%] top-[50%] -translate-y-1/2 w-[38%] max-w-[580px]">
          {/* Logo Header */}
          <BasketlyLogo size="xl" />

          {/* Headline & Description */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold tracking-wide uppercase shadow-sm">
              <FiZap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Hyperlocal 10-Min Delivery</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Fresh groceries,<br />
              delivered to your doorstep<br />
              in minutes.
            </h1>

            <p className="text-sm xl:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
              Discover over 500+ fresh products including fruits, vegetables, dairy, household essentials, beverages, snacks, personal care and more.
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiCheckCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-white">✓ Fresh Every Day</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <FiZap className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-white">✓ 10-Min Delivery</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FiShield className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-white">✓ Secure Checkout</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FiAward className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-white">✓ 500+ Products</span>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* RIGHT FLOATING CARD (OPTIMIZED HEIGHT, COMPACT SPACING) */}
        {/* ================================================== */}
        <div className="z-10 relative lg:absolute lg:right-[8%] lg:top-[50%] lg:-translate-y-1/2 w-full max-w-[540px] px-4 py-4 lg:py-0">
          <div className="bg-slate-900/90 border border-slate-700/60 rounded-[24px] p-6 sm:p-8 shadow-2xl shadow-slate-950/90 backdrop-blur-xl space-y-4 max-h-[88vh] overflow-y-auto custom-scrollbar animate-fade-in my-2">
            
            {/* Header Info */}
            <div className="text-center lg:text-left space-y-1">
              <div className="lg:hidden inline-flex items-center justify-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <FiZap className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">AETHERIA</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap">
                Create Your Account
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Join India's fastest 10-minute fresh grocery delivery network
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                <FiAlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form (Compact 48px Height Fields & Spacing) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Full Name Input (48px) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Full Name *</label>
                  <div className="relative flex items-center">
                    <FiUser className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Email Input (48px) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Email Address *</label>
                  <div className="relative flex items-center">
                    <FiMail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input (48px) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Password *</label>
                  <div className="relative flex items-center">
                    <FiLock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* REAL-TIME PASSWORD REQUIREMENTS TRACKER (COMPACT 2-COL GRID) */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-300 block uppercase tracking-wider">
                    Password requirements:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {passwordRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] transition-colors">
                        {rule.valid ? (
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <FiCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        )}
                        <span className={rule.valid ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password Input (48px) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Confirm Password *</label>
                  <div className="relative flex items-center">
                    <FiLock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD LIVE MATCH INDICATOR */}
                {formData.confirmPassword.length > 0 && (
                  <div>
                    {passwordsMatch ? (
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Passwords Match</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold flex items-center gap-1.5">
                        <FiXCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>✕ Passwords Do Not Match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms-conditions" className="text-indigo-400 font-extrabold hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              {/* Full Width Gradient Button (Height 48px - Perfectly Visible) */}
              <button
                type="submit"
                disabled={loading || !allRulesPassed || !passwordsMatch || !agreedTerms}
                className="w-full h-[48px] rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Links & Security Badge */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <FiShield className="text-emerald-400 w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Account Registration</span>
              </div>

              <div className="text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 font-extrabold hover:underline ml-1">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
