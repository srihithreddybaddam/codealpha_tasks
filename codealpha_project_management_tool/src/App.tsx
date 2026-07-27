import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'forgot' | 'reset'>('landing');

  // If user is authenticated, render protected application layout
  if (isAuthenticated) {
    return <MainLayout />;
  }

  // Unauthenticated page routing - ONLY Landing, Login, Register, Forgot, Reset allowed
  switch (authView) {
    case 'login':
      return (
        <LoginPage
          onNavigateRegister={() => setAuthView('register')}
          onNavigateForgot={() => setAuthView('forgot')}
          onSuccess={() => setAuthView('landing')}
        />
      );
    case 'register':
      return (
        <RegisterPage
          onNavigateLogin={() => setAuthView('login')}
          onSuccess={() => setAuthView('landing')}
        />
      );
    case 'forgot':
      return (
        <ForgotPasswordPage
          onNavigateLogin={() => setAuthView('login')}
        />
      );
    case 'reset':
      return (
        <ResetPasswordPage
          onNavigateLogin={() => setAuthView('login')}
        />
      );
    case 'landing':
    default:
      return (
        <LandingPage
          onNavigateAuth={(view) => setAuthView(view)}
        />
      );
  }
};

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
