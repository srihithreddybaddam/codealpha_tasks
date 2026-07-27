import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Layers, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
  onSuccess,
}) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState('Workspace Owner');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter password confirmation.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const res = await register(name.trim(), email.trim(), password, role, selectedAvatar);
    setIsLoading(false);

    if (res.success) {
      showToast('success', 'Account Registered!', `Welcome to Aether PM, ${name.trim()}!`);
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Registration failed.');
      showToast('error', 'Registration Failed', res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="bg-ambient-blob-1" />
      <div className="bg-ambient-blob-3" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-modal w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/20 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Create your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">AETHER</span> Account
          </h2>
          <p className="text-xs text-slate-400">Register to access your personal glassmorphic workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Full Name"
            type="text"
            required
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
          />

          <Input
            label="Your Email Address"
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Create a Password"
              type="password"
              required
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Workspace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass-input w-full text-xs font-semibold"
            >
              <option value="Workspace Owner" className="bg-slate-900">Workspace Owner</option>
              <option value="Lead Product Designer" className="bg-slate-900">Lead Product Designer</option>
              <option value="Full-Stack Engineer" className="bg-slate-900">Full-Stack Engineer</option>
              <option value="Systems Architect" className="bg-slate-900">Systems Architect</option>
              <option value="Product Manager" className="bg-slate-900">Product Manager</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Select Profile Avatar</label>
            <div className="flex items-center gap-3">
              {avatarOptions.map((imgUrl) => (
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt="Avatar option"
                  onClick={() => setSelectedAvatar(imgUrl)}
                  className={`w-10 h-10 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAvatar === imgUrl ? 'border-purple-400 scale-110 shadow-lg shadow-purple-500/30' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Accept Terms Checkbox */}
          <div className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="terms" className="cursor-pointer leading-snug">
              I agree to the <span className="text-purple-400 underline font-semibold">Terms of Service</span> and <span className="text-purple-400 underline font-semibold">Privacy Policy</span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center py-3 text-xs"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Launch Workspace
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          <span>Already have an account? </span>
          <button
            onClick={onNavigateLogin}
            className="text-purple-400 hover:text-purple-300 font-bold ml-1"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
