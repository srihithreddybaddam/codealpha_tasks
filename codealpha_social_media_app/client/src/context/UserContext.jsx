import React, { createContext, useState, useContext } from 'react';
import interactionService from '../services/interactionService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Global Registry of Users keyed by _id
  const [usersMap, setUsersMap] = useState({});
  // Follow State Map: { [userId]: boolean }
  const [followStateMap, setFollowStateMap] = useState({});

  // Helper to register or update user in global registry
  const registerUser = (userData) => {
    if (!userData || (!userData._id && !userData.id)) return;
    const uid = userData._id || userData.id;

    setUsersMap((prev) => ({
      ...prev,
      [uid]: {
        ...(prev[uid] || {}),
        ...userData
      }
    }));
  };

  // Toggle Follow / Unfollow with Optimistic UI Update
  const toggleFollow = async (targetUser) => {
    if (!targetUser) return;
    const targetId = targetUser._id || targetUser.id;
    const currentFollowState = Boolean(followStateMap[targetId]);
    const newFollowState = !currentFollowState;

    // Optimistic Update
    setFollowStateMap((prev) => ({
      ...prev,
      [targetId]: newFollowState
    }));

    // Update User Followers Count Optimistically
    setUsersMap((prev) => {
      const existing = prev[targetId] || targetUser;
      const currentCount = existing.followersCount || 120;
      return {
        ...prev,
        [targetId]: {
          ...existing,
          followersCount: newFollowState ? currentCount + 1 : Math.max(0, currentCount - 1)
        }
      };
    });

    try {
      if (currentFollowState) {
        await interactionService.unfollowUser(targetId);
      } else {
        await interactionService.followUser(targetId);
      }
    } catch (err) {
      // Rollback on Error
      setFollowStateMap((prev) => ({
        ...prev,
        [targetId]: currentFollowState
      }));
    }
  };

  const isFollowing = (userId) => Boolean(followStateMap[userId]);

  return (
    <UserContext.Provider
      value={{
        usersMap,
        followStateMap,
        registerUser,
        toggleFollow,
        isFollowing
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
