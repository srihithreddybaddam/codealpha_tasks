import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiZap } from 'react-icons/fi';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FiZap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              ADMIN<span className="text-cyan-400">CORE</span>
            </span>
          </Link>

          <nav className="space-y-1 text-sm font-medium">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-indigo-400 bg-indigo-500/10 rounded-xl">
              <FiGrid className="w-5 h-5" />
              <span>Overview</span>
            </Link>
            <div className="px-4 py-3 text-slate-500 flex items-center gap-3 cursor-not-allowed">
              <FiBox className="w-5 h-5" />
              <span>Products (Phase 2)</span>
            </div>
            <div className="px-4 py-3 text-slate-500 flex items-center gap-3 cursor-not-allowed">
              <FiShoppingBag className="w-5 h-5" />
              <span>Orders (Phase 3)</span>
            </div>
            <div className="px-4 py-3 text-slate-500 flex items-center gap-3 cursor-not-allowed">
              <FiUsers className="w-5 h-5" />
              <span>Users (Phase 4)</span>
            </div>
          </nav>
        </div>

        <div>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white text-sm font-medium">
            <FiLogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
