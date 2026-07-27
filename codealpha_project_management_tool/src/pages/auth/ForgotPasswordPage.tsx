import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Layers, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateLogin }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    showToast('success', 'Reset Link Dispatched', `Password recovery email sent to ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="bg-ambient-blob-2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-modal w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Recover Password</h2>
          <p className="text-xs text-slate-400">Enter your email to receive a password reset link</p>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-200">Instructions Sent</h4>
            <p className="text-xs text-slate-300">Check your inbox for step-by-step instructions to reset your password.</p>
            <Button onClick={onNavigateLogin} className="w-full justify-center text-xs mt-2">
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="Enter your registered email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button type="submit" className="w-full justify-center py-3 text-xs" rightIcon={<Send className="w-4 h-4" />}>
              Send Recovery Link
            </Button>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
