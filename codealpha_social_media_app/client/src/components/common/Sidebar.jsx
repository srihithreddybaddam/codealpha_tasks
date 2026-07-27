import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onOpenCreatePost }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home Feed', icon: 'home', path: '/home' },
    { label: 'Explore & Moments', icon: 'explore', path: '/explore' },
    { label: 'Search', icon: 'search', path: '/search' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Bookmarks', icon: 'bookmark', path: '/bookmarks' },
    { label: 'Circle', icon: 'group', path: '/circle' },
    { label: 'My Profile', icon: 'person', path: user ? `/profile/${user.username}` : '/profile/elena_design' },
    { label: 'Settings', icon: 'settings', path: '/settings' }
  ];

  if (user && user.role === 'admin') {
    navItems.splice(6, 0, { label: 'Admin Dashboard', icon: 'admin_panel_settings', path: '/admin' });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-61px)] sticky top-[61px] border-r border-surface-container-high bg-surface px-4 py-6 justify-between">
      <div className="space-y-6">
        {/* Status Bubble Badge if available */}
        {user && user.statusBubble && (
          <div className="p-3 bg-surface-container-low border border-surface-container-highest rounded-2xl flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-outline">Status Bubble</p>
              <p className="text-xs font-medium text-on-surface truncate">{user.statusBubble}</p>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile / Logout */}
      <div className="space-y-3 pt-4 border-t border-surface-container-high">
        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white py-3 rounded-2xl font-semibold text-sm shadow-md shadow-primary/20 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            <span>New Post</span>
          </button>
        )}

        {user && (
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="truncate">
                <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                <p className="text-[11px] text-outline truncate">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="text-outline hover:text-error p-1.5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
