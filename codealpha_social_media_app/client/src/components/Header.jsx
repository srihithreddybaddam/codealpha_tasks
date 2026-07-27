import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import LiveSearchDropdown from './LiveSearchDropdown';
import discoveryService from '../services/discoveryService';

export default function Header({ onOpenCreatePost }) {
  const { user } = useAuth();
  const { unreadNotificationsCount } = useSocket();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimerRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setSearchResults({});
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await discoveryService.search(val);
        if (res.success) {
          setSearchResults(res);
        }
      } catch (err) {
        console.warn('[Header Search] Debounced search failed');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/home" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25">
          V
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">Vibely</span>
      </Link>

      {/* Global Live Search Bar */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-6 relative">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search Vibely creators, posts or #hashtags..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full pl-10 pr-4 py-2 text-sm glass-input rounded-full focus:outline-none"
          />
        </div>

        {/* Live Search Dropdown */}
        {showDropdown && (
          <LiveSearchDropdown
            results={searchResults}
            query={query}
            loading={loading}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Messages Shortcut */}
        <Link
          to="/messages"
          className="p-2 text-outline hover:text-primary rounded-full hover:bg-primary/10 transition-colors relative"
          title="Private Messages"
        >
          <span className="material-symbols-outlined text-xl">forum</span>
        </Link>

        {/* Notifications Shortcut with Live Unread Counter Badge */}
        <Link
          to="/notifications"
          className="p-2 text-outline hover:text-primary rounded-full hover:bg-primary/10 transition-colors relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-[9px] border border-white">
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-container hover:to-purple-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="hidden sm:inline">Create Post</span>
          </button>
        )}

        {user && (
          <Link to="/profile" className="flex items-center gap-2 group">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-all shadow-sm"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
