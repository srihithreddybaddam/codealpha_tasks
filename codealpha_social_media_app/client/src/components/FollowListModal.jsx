import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import followService from '../services/followService';
import useAuth from '../hooks/useAuth';

export default function FollowListModal({ isOpen, onClose, userId, title = 'Followers' }) {
  const { user: currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchList();
    }
  }, [isOpen, userId, title]);

  const fetchList = async () => {
    setLoading(true);
    try {
      let res;
      if (title.toLowerCase().includes('following')) {
        res = await followService.getFollowing(userId);
        if (res.success && res.following) setUsersList(res.following);
      } else {
        res = await followService.getFollowers(userId);
        if (res.success && res.followers) setUsersList(res.followers);
      }
    } catch (err) {
      console.warn('[Followers Fetch Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (targetUser) => {
    try {
      if (targetUser.isFollowing) {
        await followService.unfollowUser(targetUser._id);
      } else {
        await followService.followUser(targetUser._id);
      }
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, isFollowing: !u.isFollowing } : u))
      );
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <h3 className="text-base font-bold text-on-surface">{title}</h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface p-1 rounded-full">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-8 text-center text-xs text-outline">Loading {title.toLowerCase()}...</div>
        ) : usersList.length === 0 ? (
          <div className="py-8 text-center text-xs text-outline">No {title.toLowerCase()} found.</div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {usersList.map((u) => {
              const isSelf = currentUser && currentUser._id === u._id;

              return (
                <div key={u._id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-surface-container-low transition-colors">
                  <Link to={`/profile/${u.username}`} onClick={onClose} className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface hover:text-primary transition-colors">{u.name}</h4>
                      <p className="text-[11px] text-outline">@{u.username}</p>
                    </div>
                  </Link>

                  {!isSelf && currentUser && (
                    <button
                      onClick={() => handleToggleFollow(u)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
                        u.isFollowing
                          ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          : 'bg-primary hover:bg-primary-container text-white'
                      }`}
                    >
                      {u.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
