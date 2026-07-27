import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Layers, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onNavigateForgot,
  onSuccess,
}) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(email, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      showToast('success', 'Welcome Back!', 'Authentication successful.');
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
      showToast('error', 'Authentication Failed', res.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="bg-ambient-blob-1" />
      <div className="bg-ambient-blob-2" />

      {/* Login Glass Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-modal w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Sign in to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">AETHER</span>
          </h2>
          <p className="text-xs text-slate-400">Enter your email and password to access your workspace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Email Address"
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Enter your password"
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={onNavigateForgot}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center py-3 text-xs"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Workspace
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          <span>Don't have an account? </span>
          <button
            onClick={onNavigateRegister}
            className="text-purple-400 hover:text-purple-300 font-bold ml-1"
          >
            Register Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};
