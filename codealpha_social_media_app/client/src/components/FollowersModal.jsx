import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function FollowersModal({ isOpen, onClose, followers = [], title = 'Followers' }) {
  const { toggleFollow, isFollowing } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUsers = followers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-modal rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
        {/* Header & Close */}
        <div className="flex items-center justify-between border-b border-primary/10 pb-3">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">group</span>
            {title} ({followers.length})
          </h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 glass-input rounded-full text-xs focus:outline-none"
          />
        </div>

        {/* User List */}
        <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-primary/5 pr-1">
          {filteredUsers.length === 0 ? (
            <p className="text-xs text-outline text-center py-6">No users found</p>
          ) : (
            filteredUsers.map((u) => {
              const following = isFollowing(u._id);

              return (
                <div key={u._id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-primary/15 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/profile/${u.username}`}
                          onClick={onClose}
                          className="text-xs font-bold text-on-surface hover:text-primary transition-colors truncate"
                        >
                          {u.name}
                        </Link>
                        {u.isVerified && (
                          <span className="material-symbols-outlined text-primary text-xs shrink-0">verified</span>
                        )}
                      </div>
                      <p className="text-[11px] text-outline truncate">@{u.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(u)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
                      following
                        ? 'bg-surface-container-high text-on-surface hover:bg-error/10 hover:text-error'
                        : 'bg-primary text-white hover:bg-primary-container'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
