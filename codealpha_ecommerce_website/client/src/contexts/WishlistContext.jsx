import React, { createContext, useState, useEffect, useRef } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { wishlistService } from '../services/wishlist.service';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext();

const getWishlistKey = (userId) => (userId ? `basketly_wishlist_${userId}` : 'basketly_wishlist_guest');

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

const loadInitialWishlist = (id) => {
  const key = getWishlistKey(id);
  const data = getStorage(key, null);
  if (data && Array.isArray(data)) return data;

  const legacyKey = id ? `aetheria_wishlist_${id}` : 'aetheria_wishlist_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && Array.isArray(legacyData)) return legacyData;

  return [];
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.email || null;

  // Synchronous initialization from storage on mount
  const [wishlist, setWishlist] = useState(() => loadInitialWishlist(getInitialUserId()));
  const prevUserIdRef = useRef(getInitialUserId());

  // Merge guest wishlist & switch account wishlist upon login
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;

    if (prevUserId !== userId) {
      if (userId) {
        const guestWishlist = loadInitialWishlist(null);
        const userWishlist = loadInitialWishlist(userId);

        let merged = [...userWishlist];
        if (guestWishlist.length > 0) {
          guestWishlist.forEach((guestItem) => {
            if (!merged.some((item) => item._id === guestItem._id)) {
              merged.push(guestItem);
            }
          });
          setStorage(getWishlistKey(null), []);
          setStorage('aetheria_wishlist_guest', []);
        }

        setWishlist(merged);
        setStorage(getWishlistKey(userId), merged);

        // Sync with backend wishlist service
        wishlistService
          .getWishlist()
          .then((res) => {
            const backendWishlist = res.data?.wishlist || res.wishlist || [];
            if (Array.isArray(backendWishlist) && backendWishlist.length > 0) {
              setWishlist((currentLocal) => {
                const combined = [...currentLocal];
                backendWishlist.forEach((bItem) => {
                  const itemObj = bItem.product || bItem;
                  if (itemObj && itemObj._id && !combined.some((c) => c._id === itemObj._id)) {
                    combined.push(itemObj);
                  }
                });
                setStorage(getWishlistKey(userId), combined);
                return combined;
              });
            }
          })
          .catch(() => {});
      } else {
        const guestWishlist = loadInitialWishlist(null);
        setWishlist(guestWishlist);
      }

      prevUserIdRef.current = userId;
    }
  }, [userId]);

  // Persist changes to active account key
  useEffect(() => {
    const key = getWishlistKey(userId);
    setStorage(key, wishlist);
  }, [wishlist, userId]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
    if (userId) {
      wishlistService.addToWishlist(product).catch(() => {});
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
    if (userId) {
      wishlistService.removeFromWishlist(productId).catch(() => {});
    }
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    if (exists) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    const key = getWishlistKey(userId);
    setStorage(key, []);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
