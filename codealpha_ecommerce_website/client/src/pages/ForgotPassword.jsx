import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { authService } from '../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ loading: true, success: '', error: '' });
    try {
      const res = await authService.forgotPassword(email);
      setStatus({
        loading: false,
        success: res.message || 'Password reset instructions have been sent to your email.',
        error: '',
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: '',
        error: err.message || 'Failed to request password reset. Please try again.',
      });
    }
  };

  return (
    <PageWrapper title="Forgot Password">
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <Container className="max-w-md">
          <Card glass className="p-8 space-y-6 shadow-2xl border border-white/40 dark:border-slate-800">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
                <FiMail className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Reset Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

            {status.error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-fade-in">
                {status.error}
              </div>
            )}

            {status.success ? (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{status.success}</span>
                </div>
                <Link to="/login" className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Return to Sign In →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={status.loading}
                >
                  {status.loading ? 'Sending Instructions...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    </PageWrapper>
  );
};

export default ForgotPassword;
