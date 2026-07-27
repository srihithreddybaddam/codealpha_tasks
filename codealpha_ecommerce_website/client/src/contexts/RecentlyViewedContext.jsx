import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

const MAX_RECENTLY_VIEWED = 20;
export const RecentlyViewedContext = createContext();

const getRecentlyViewedKey = (userId) => (userId ? `basketly_recently_viewed_${userId}` : 'basketly_recently_viewed_guest');

const getInitialUserId = () => {
  try {
    const user =
      getStorage(STORAGE_KEYS.USER, null) ||
      getStorage('basketly_user', null) ||
      getStorage('aetheria_user', null);
    return user?._id || user?.id || user?.email || null;
  } catch {
    return null;
  }
};

const loadInitialRecentlyViewed = (id) => {
  const key = getRecentlyViewedKey(id);
  const data = getStorage(key, null);
  if (data && Array.isArray(data)) return data;

  const legacyKey = id ? `aetheria_recently_viewed_${id}` : 'aetheria_recently_viewed_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && Array.isArray(legacyData)) return legacyData;

  return [];
};

export const RecentlyViewedProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.email || null;

  const [recentlyViewed, setRecentlyViewed] = useState(() => loadInitialRecentlyViewed(getInitialUserId()));
  const prevUserIdRef = useRef(getInitialUserId());

  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    if (prevUserId !== userId) {
      setRecentlyViewed(loadInitialRecentlyViewed(userId));
      prevUserIdRef.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    const key = getRecentlyViewedKey(userId);
    setStorage(key, recentlyViewed);
  }, [recentlyViewed, userId]);

  const addRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const updated = [product, ...filtered];
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    const key = getRecentlyViewedKey(userId);
    setStorage(key, []);
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
