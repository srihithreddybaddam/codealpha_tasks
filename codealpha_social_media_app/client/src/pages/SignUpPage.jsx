import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const errors = {};
    if (!name || !name.trim()) {
      errors.name = 'Full Name is required';
    }
    if (!validateUsername(username)) {
      errors.username = 'Username must be at least 3 chars (letters, numbers, underscores)';
    }
    if (!validateEmail(email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const result = await signup({ name, username, email, password });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Could not create account. Username or Email may already exist.');
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Vibely and start sharing Daily Sparks and authentic moments."
    >
      {errorMessage && (
        <div className="p-3 bg-error-container/70 border border-error/40 text-on-error-container rounded-2xl text-xs text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Elena Rostova"
            className={`w-full px-4 py-3 bg-surface-container-low border ${
              fieldErrors.name ? 'border-error' : 'border-surface-container-high'
            } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
          />
          {fieldErrors.name && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.name}</p>}
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface-variant">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            placeholder="elena_design"
            className={`w-full px-4 py-3 bg-surface-container-low border ${
              fieldErrors.username ? 'border-error' : 'border-surface-container-high'
            } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
          />
          {fieldErrors.username && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.username}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface-variant">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="elena@vibely.app"
            className={`w-full px-4 py-3 bg-surface-container-low border ${
              fieldErrors.email ? 'border-error' : 'border-surface-container-high'
            } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
          />
          {fieldErrors.email && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-on-surface-variant">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className={`w-full px-4 py-3 bg-surface-container-low border ${
              fieldErrors.password ? 'border-error' : 'border-surface-container-high'
            } rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all`}
          />
          {fieldErrors.password && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-semibold rounded-2xl text-sm shadow-md shadow-primary/20 transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </>
          ) : (
            'Complete Sign Up'
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-outline">
        Already have a Vibely account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
