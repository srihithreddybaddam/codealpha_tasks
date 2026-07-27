import React, { useState, useEffect } from 'react';
import featureService from '../services/featureService';
import followService from '../services/followService';
import useAuth from '../hooks/useAuth';

export default function CircleManagerModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchCircleAndFriends();
    }
  }, [isOpen, user]);

  const fetchCircleAndFriends = async () => {
    setLoading(true);
    try {
      const circleRes = await featureService.getCircle();
      if (circleRes.success && circleRes.members) {
        setSelectedMemberIds(circleRes.members.map((m) => m._id));
      }

      const friendsRes = await followService.getFollowing(user._id);
      if (friendsRes.success && friendsRes.following) {
        setFollowingUsers(friendsRes.following);
      }
    } catch (err) {
      console.warn('[Circle Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSaveCircle = async () => {
    setSubmitting(true);
    try {
      const res = await featureService.updateCircle(selectedMemberIds);
      if (res.success) {
        onClose();
      }
    } catch (err) {
      console.error('[Circle Save Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-xl">groups</span>
              Private Circle Manager
            </h3>
            <p className="text-xs text-outline">Select friends to include in your restricted Private Circle.</p>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface p-1 rounded-full">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Member Selector List */}
        {loading ? (
          <div className="py-8 text-center text-xs text-outline">Loading circle friends...</div>
        ) : followingUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-outline">Follow some creators first to add them to your Circle!</div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {followingUsers.map((friend) => {
              const isSelected = selectedMemberIds.includes(friend._id);

              return (
                <div
                  key={friend._id}
                  onClick={() => toggleMember(friend._id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-surface-container-high hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{friend.name}</h4>
                      <p className="text-[11px] text-outline">@{friend.username}</p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-primary border-primary text-white' : 'border-outline text-transparent'
                  }`}>
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-surface-container-high hover:bg-surface-container text-xs font-semibold rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCircle}
            disabled={submitting}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-md shadow-primary/20"
          >
            {submitting ? 'Saving...' : `Save (${selectedMemberIds.length}) Members`}
          </button>
        </div>
      </div>
    </div>
  );
}
