import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import discoveryService from '../services/discoveryService';
import { useUser } from '../context/UserContext';

export default function SuggestedUsersWidget() {
  const { toggleFollow, isFollowing } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localFollowMap, setLocalFollowMap] = useState({});

  useEffect(() => {
    fetchSuggested();
  }, []);

  const fetchSuggested = async () => {
    try {
      const res = await discoveryService.getSuggestedUsers();
      if (res.success && res.users) {
        setUsers(res.users.slice(0, 5));
      }
    } catch (err) {
      console.warn('[Suggested Users Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowClick = (u) => {
    const currentState = localFollowMap[u._id] !== undefined ? localFollowMap[u._id] : isFollowing(u._id);
    const nextState = !currentState;

    setLocalFollowMap((prev) => ({
      ...prev,
      [u._id]: nextState
    }));

    toggleFollow(u);
  };

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-5 border border-primary/10 text-xs text-outline text-center">
        Loading suggested creators...
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-5 border border-primary/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base">person_add</span>
          Who to Follow
        </h3>
        <Link to="/explore" className="text-xs font-semibold text-primary hover:underline">
          See All
        </Link>
      </div>

      <div className="space-y-3 divide-y divide-primary/5">
        {users.map((u) => {
          const activeState = localFollowMap[u._id] !== undefined ? localFollowMap[u._id] : isFollowing(u._id);

          return (
            <div key={u._id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Link to={`/profile/${u.username}`}>
                  <img
                    src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/15 shrink-0"
                  />
                </Link>

                <div className="truncate">
                  <div className="flex items-center gap-1">
                    <Link to={`/profile/${u.username}`} className="text-xs font-bold text-on-surface hover:text-primary transition-colors truncate">
                      {u.name}
                    </Link>
                    {u.isVerified && (
                      <span className="material-symbols-outlined text-primary text-xs shrink-0">verified</span>
                    )}
                  </div>
                  <p className="text-[10px] text-outline truncate">@{u.username}</p>
                </div>
              </div>

              <button
                onClick={() => handleFollowClick(u)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
                  activeState
                    ? 'bg-surface-container-high text-on-surface hover:bg-error/10 hover:text-error'
                    : 'bg-primary text-white hover:bg-primary-container'
                }`}
              >
                {activeState ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
