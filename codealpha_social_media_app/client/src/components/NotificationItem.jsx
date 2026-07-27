import React from 'react';
import { Link } from 'react-router-dom';

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const getIconAndText = (type) => {
    switch (type) {
      case 'like':
        return { icon: 'favorite', color: 'text-secondary bg-secondary/10', text: 'liked your post' };
      case 'comment':
        return { icon: 'chat_bubble', color: 'text-primary bg-primary/10', text: 'commented on your post' };
      case 'reply':
        return { icon: 'reply', color: 'text-primary bg-primary/10', text: 'replied to your comment' };
      case 'follow':
        return { icon: 'person_add', color: 'text-success bg-success/10', text: 'started following you' };
      case 'circle':
        return { icon: 'groups', color: 'text-primary bg-primary/10', text: 'added you to their Private Circle' };
      case 'message':
        return { icon: 'mail', color: 'text-secondary bg-secondary/10', text: 'sent you a private message' };
      default:
        return { icon: 'notifications', color: 'text-outline bg-surface-container', text: 'interacted with your profile' };
    }
  };

  const info = getIconAndText(notification.type);
  const sender = notification.sender || {};

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        notification.readStatus
          ? 'glass-card border-primary/10'
          : 'bg-primary/10 backdrop-blur-md border-primary/30 font-semibold shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative shrink-0">
          <img
            src={sender.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
            alt={sender.name}
            className="w-10 h-10 rounded-full object-cover border border-primary/15"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${info.color}`}>
            <span className="material-symbols-outlined text-[11px] font-bold">{info.icon}</span>
          </div>
        </div>

        <div className="truncate text-xs">
          <p className="text-on-surface truncate">
            <Link to={`/profile/${sender.username}`} className="font-bold hover:text-primary transition-colors">
              {sender.name || 'Vibely User'}
            </Link>{' '}
            <span className="text-on-surface-variant font-normal">{info.text}</span>
          </p>
          <p className="text-[11px] text-outline mt-0.5">{formatTimeAgo(notification.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {!notification.readStatus && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          >
            Mark Read
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(notification._id)} className="text-outline hover:text-error p-1">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
