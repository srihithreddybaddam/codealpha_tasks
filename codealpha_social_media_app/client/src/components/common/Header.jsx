import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenCreatePost }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-surface-container-high px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/home" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
          V
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">Vibely</span>
      </Link>

      {/* Global Search Bar */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search Vibely creators, posts or #hashtags..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
              }
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low rounded-full border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="hidden sm:inline">Create Post</span>
          </button>
        )}

        <Link
          to="/notifications"
          className="relative p-2 text-on-surface-variant hover:text-primary rounded-full hover:bg-surface-container transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
        </Link>

        {user && (
          <Link to={`/profile/${user.username}`} className="flex items-center gap-2 group">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
