import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav({ onOpenCreatePost }) {
  const { user } = useAuth();

  const mobileNavItems = [
    { label: 'Home', icon: 'home', path: '/home' },
    { label: 'Explore', icon: 'explore', path: '/explore' },
    { label: 'Search', icon: 'search', path: '/search' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Profile', icon: 'person', path: user ? `/profile/${user.username}` : '/profile/elena_design' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-surface-container-high px-4 py-2 flex items-center justify-around">
      {mobileNavItems.map((item, idx) => {
        if (idx === 2 && onOpenCreatePost) {
          return (
            <React.Fragment key="create">
              <button
                onClick={onOpenCreatePost}
                className="w-12 h-12 -mt-5 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-outline'
                  }`
                }
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs font-medium ${
                isActive ? 'text-primary font-semibold' : 'text-outline hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
