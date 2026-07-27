import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStorage, setStorage } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext();

const getNotificationKey = (userId) => (userId ? `basketly_notifications_${userId}` : 'basketly_notifications_guest');
const getWelcomeKey = (userId) => (userId ? `basketly_welcome_shown_${userId}` : 'basketly_welcome_shown_guest');

const initialSampleNotifications = [
  {
    id: 'notif-default-1',
    title: 'Welcome to Basketly!',
    message: "We're excited to have you with us. Start exploring fresh groceries, daily essentials, exclusive offers, and Basketly Pro membership perks.",
    type: 'system',
    createdAt: new Date().toISOString(),
    group: 'Today',
    unread: true,
  },
  {
    id: 'notif-default-2',
    title: 'Flash Coupon BASKETLY10 Available',
    message: 'Use code BASKETLY10 at checkout to get 10% instant discount on fresh fruits & vegetables.',
    type: 'offer',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    group: 'Today',
    unread: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?._id || user?.email || null;

  const [notifications, setNotifications] = useState([]);

  // Load account-isolated notifications and trigger Welcome notification ONLY ONCE per account
  useEffect(() => {
    const key = getNotificationKey(userId);
    const welcomeKey = getWelcomeKey(userId);
    const existing = getStorage(key, null);
    const welcomeShown = getStorage(welcomeKey, false);

    let notifList = existing;

    if (!existing) {
      notifList = initialSampleNotifications;
    }

    // Trigger Welcome Notification ONLY ONCE for logged-in user
    if (isAuthenticated && userId && !welcomeShown) {
      const welcomeNotif = {
        id: `notif-welcome-${Date.now()}`,
        title: 'Welcome to Basketly!',
        message: "We're excited to have you with us. Start exploring fresh groceries, daily essentials, exclusive offers, and Basketly Pro membership perks.",
        type: 'system',
        createdAt: new Date().toISOString(),
        group: 'Today',
        unread: true,
      };

      if (!notifList.some((n) => n.title === 'Welcome to Basketly!')) {
        notifList = [welcomeNotif, ...notifList];
      }

      setStorage(welcomeKey, true);
    }

    setNotifications(notifList || []);
  }, [userId, isAuthenticated]);

  // Persist changes
  useEffect(() => {
    if (notifications.length > 0) {
      const key = getNotificationKey(userId);
      setStorage(key, notifications);
    }
  }, [notifications, userId]);

  const addNotification = ({ title, message, type = 'system' }) => {
    if (!title || !message) return;

    setNotifications((prev) => {
      if (prev.some((n) => n.title === title && n.message === message)) {
        return prev;
      }

      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        message,
        type,
        createdAt: new Date().toISOString(),
        group: 'Today',
        unread: true,
      };

      return [newNotif, ...prev];
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
