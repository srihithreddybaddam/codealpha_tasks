import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import NotificationItem from '../components/NotificationItem';
import Toast from '../components/Toast';
import notificationService from '../services/notificationService';
import { useSocket } from '../context/SocketContext';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'interactions'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { setUnreadNotificationsCount } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
        setUnreadNotificationsCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('[Notifications Page Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readStatus: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
      setUnreadNotificationsCount(0);
      setToast({ message: 'All notifications marked as read.', type: 'success' });
    } catch (e) {}
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setToast({ message: 'Notification removed.', type: 'success' });
    } catch (e) {}
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.readStatus;
    if (activeTab === 'interactions') return ['like', 'comment', 'reply', 'follow'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          {/* Header & Controls */}
          <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
            <div>
              <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                Notification Center
              </h1>
              <p className="text-xs text-outline">Real-time alerts for likes, comments, follows, & messages.</p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
                Mark All Read
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Alerts', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'interactions', label: 'Interactions', count: notifications.filter((n) => ['like', 'comment', 'reply', 'follow'].includes(n.type)).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="py-12 text-center text-xs text-outline">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-surface-container-high space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">notifications_off</span>
              <h3 className="font-bold text-base text-on-surface">No Notifications</h3>
              <p className="text-xs text-outline">You are all caught up! No recent notifications to display.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <NotificationItem
                  key={notif._id}
                  notification={notif}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
