import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';

export default function LoginPage() {
  const [email, setEmail] = useState('elena@vibely.app');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const errors = {};
    if (!email || !email.trim()) {
      errors.email = 'Email or Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password, rememberMe });
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid email/username or password.');
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to connect, share Sparks, and view your timeline."
    >
      {errorMessage && (
        <div className="p-3 bg-error-container/70 border border-error/40 text-on-error-container rounded-2xl text-xs text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Username Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface-variant">Email or Username</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
              mail
            </span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@vibely.app or @elena_design"
              className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border ${
                fieldErrors.email ? 'border-error' : 'border-surface-container-high'
              } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
            />
          </div>
          {fieldErrors.email && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-on-surface-variant">Password</label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link sent to your registered email address.');
              }}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
              lock
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 bg-surface-container-low border ${
                fieldErrors.password ? 'border-error' : 'border-surface-container-high'
              } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
            />
          </div>
          {fieldErrors.password && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.password}</p>}
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-surface-container-high focus:ring-primary"
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-semibold rounded-2xl text-sm shadow-md shadow-primary/20 transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            'Sign In to Vibely'
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-outline">
        Don't have a Vibely account yet?{' '}
        <Link to="/signup" className="text-primary font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
