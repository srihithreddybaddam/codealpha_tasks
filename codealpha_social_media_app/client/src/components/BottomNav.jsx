import React from 'react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const mobileNavItems = [
    { label: 'Home', icon: 'home', path: '/home' },
    { label: 'Explore', icon: 'explore', path: '/explore' },
    { label: 'Messages', icon: 'forum', path: '/messages' },
    { label: 'Profile', icon: 'person', path: '/profile' },
    { label: 'Settings', icon: 'settings', path: '/settings' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-surface-container-high px-4 py-2 flex items-center justify-around">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-outline hover:text-on-surface'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">{item.icon}</span>
          <span className="text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
