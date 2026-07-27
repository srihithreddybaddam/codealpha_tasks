import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Layers, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResetPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateLogin }) => {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('error', 'Password Mismatch', 'Passwords do not match.');
      return;
    }
    setIsSuccess(true);
    showToast('success', 'Password Updated', 'You may now log in with your new password.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="bg-ambient-blob-1" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-modal w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Set New Password</h2>
          <p className="text-xs text-slate-400">Choose a secure password for your account</p>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-200">Password Reset Complete</h4>
            <Button onClick={onNavigateLogin} className="w-full justify-center text-xs mt-2">
              Sign In Now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              required
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" className="w-full justify-center py-3 text-xs">
              Update Password
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
