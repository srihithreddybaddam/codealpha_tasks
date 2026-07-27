import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  // Placeholder guard for admin status check
  const isAdmin = isAuthenticated && (user?.role === 'admin' || true); // Dev bypass for Phase 1 preview

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
