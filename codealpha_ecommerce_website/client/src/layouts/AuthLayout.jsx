import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-slate-950">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
