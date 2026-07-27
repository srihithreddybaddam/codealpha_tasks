import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

const MAX_COMPARE_ITEMS = 4;
export const CompareContext = createContext();

const getCompareKey = (userId) => (userId ? `basketly_compare_${userId}` : 'basketly_compare_guest');

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

const loadInitialCompare = (id) => {
  const key = getCompareKey(id);
  const data = getStorage(key, null);
  if (data && Array.isArray(data)) return data;

  const legacyKey = id ? `aetheria_compare_${id}` : 'aetheria_compare_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && Array.isArray(legacyData)) return legacyData;

  return [];
};

export const CompareProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.email || null;

  const [compareItems, setCompareItems] = useState(() => loadInitialCompare(getInitialUserId()));
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const prevUserIdRef = useRef(getInitialUserId());

  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    if (prevUserId !== userId) {
      setCompareItems(loadInitialCompare(userId));
      prevUserIdRef.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    const key = getCompareKey(userId);
    setStorage(key, compareItems);
  }, [compareItems, userId]);

  const addToCompare = (product) => {
    if (!product || !product._id) return false;
    if (compareItems.length >= MAX_COMPARE_ITEMS && !isCompared(product._id)) {
      return false;
    }
    setCompareItems((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
    return true;
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((p) => p._id !== productId));
  };

  const toggleCompare = (product) => {
    if (isCompared(product._id)) {
      removeFromCompare(product._id);
      return false;
    } else {
      return addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    const key = getCompareKey(userId);
    setStorage(key, []);
  };

  const isCompared = (productId) => {
    return compareItems.some((p) => p._id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isCompared,
        isCompareModalOpen,
        setIsCompareModalOpen,
        maxCompareLimit: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
