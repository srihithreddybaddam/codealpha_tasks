import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';

export default function Sidebar({ onOpenCreatePost }) {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useSocket();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home Feed', icon: 'home', path: '/home' },
    { label: 'Explore', icon: 'explore', path: '/explore' },
    { label: 'Messages', icon: 'forum', path: '/messages' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications', badge: unreadNotificationsCount },
    { label: 'Moments', icon: 'movie', path: '/moments' },
    { label: 'My Profile', icon: 'person', path: '/profile' },
    { label: 'Settings', icon: 'settings', path: '/settings' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-61px)] sticky top-[61px] glass-sidebar px-4 py-6 justify-between">
      <div className="space-y-4 overflow-y-auto">
        {/* Navigation List with Scale & Glow Hover Animations */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-sm transition-all transform duration-200 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-on-surface-variant hover:bg-white/70 hover:text-on-surface hover:shadow-xs'
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile / Logout */}
      <div className="space-y-3 pt-4 border-t border-primary/10">
        {user && (
          <div className="flex items-center justify-between p-2.5 glass-card rounded-2xl hover:bg-white/80 transition-all">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-primary/20 shadow-xs"
              />
              <div className="truncate">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-on-surface truncate">{user.name}</p>
                  {user.isPremium && (
                    <span className="material-symbols-outlined text-primary text-xs shrink-0" title="Vibely Premium">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-outline truncate">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="text-outline hover:text-error p-1.5 rounded-lg transition-colors hover:bg-error/10"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
