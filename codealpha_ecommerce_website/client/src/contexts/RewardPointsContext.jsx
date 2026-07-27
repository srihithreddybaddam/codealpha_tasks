import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

export const RewardPointsContext = createContext();

const getPointsKey = (userId) => (userId ? `basketly_reward_points_${userId}` : 'basketly_reward_points_guest');

const defaultPointsData = {
  balance: 450,
  lifetimeEarned: 600,
  redeemedPoints: 150,
  history: [
    { id: 1, type: 'EARNED', points: 250, description: 'Order #ord-1001 purchase bonus', date: '2026-07-22' },
    { id: 2, type: 'REDEEMED', points: 150, description: 'Redeemed discount on checkout', date: '2026-07-21' },
    { id: 3, type: 'EARNED', points: 350, description: 'Welcome Reward Bonus', date: '2026-07-20' },
  ],
};

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

const loadInitialPoints = (id) => {
  const key = getPointsKey(id);
  const data = getStorage(key, null);
  if (data && typeof data === 'object') return data;

  const legacyKey = id ? `aetheria_reward_points_${id}` : 'aetheria_reward_points_guest';
  const legacyData = getStorage(legacyKey, null);
  if (legacyData && typeof legacyData === 'object') return legacyData;

  return defaultPointsData;
};

export const RewardPointsProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || user?.email || null;

  const [pointsData, setPointsData] = useState(() => loadInitialPoints(getInitialUserId()));
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const prevUserIdRef = useRef(getInitialUserId());

  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    if (prevUserId !== userId) {
      setPointsData(loadInitialPoints(userId));
      prevUserIdRef.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    const key = getPointsKey(userId);
    setStorage(key, pointsData);
  }, [pointsData, userId]);

  // Earn 10 points per ₹100 spent
  const earnPoints = (amountSpent, orderId = '') => {
    const pointsEarned = Math.floor((amountSpent / 100) * 10);
    if (pointsEarned <= 0) return 0;

    const newHistoryItem = {
      id: Date.now(),
      type: 'EARNED',
      points: pointsEarned,
      description: `Earned on Order #${orderId || 'purchase'}`,
      date: new Date().toISOString().split('T')[0],
    };

    setPointsData((prev) => ({
      ...prev,
      balance: prev.balance + pointsEarned,
      lifetimeEarned: prev.lifetimeEarned + pointsEarned,
      history: [newHistoryItem, ...prev.history],
    }));

    return pointsEarned;
  };

  // Redeem 1 Point = ₹1 Discount
  const redeemPoints = (pointsToRedeem) => {
    if (pointsToRedeem <= 0 || pointsToRedeem > pointsData.balance) return false;

    const newHistoryItem = {
      id: Date.now(),
      type: 'REDEEMED',
      points: pointsToRedeem,
      description: 'Redeemed discount at checkout',
      date: new Date().toISOString().split('T')[0],
    };

    setPointsData((prev) => ({
      ...prev,
      balance: prev.balance - pointsToRedeem,
      redeemedPoints: prev.redeemedPoints + pointsToRedeem,
      history: [newHistoryItem, ...prev.history],
    }));

    return true;
  };

  return (
    <RewardPointsContext.Provider
      value={{
        balance: pointsData.balance,
        lifetimeEarned: pointsData.lifetimeEarned,
        redeemedPoints: pointsData.redeemedPoints,
        history: pointsData.history,
        earnPoints,
        redeemPoints,
        isRewardModalOpen,
        setIsRewardModalOpen,
      }}
    >
      {children}
    </RewardPointsContext.Provider>
  );
};

export const useRewardPoints = () => {
  const context = useContext(RewardPointsContext);
  if (!context) {
    throw new Error('useRewardPoints must be used within a RewardPointsProvider');
  }
  return context;
};
