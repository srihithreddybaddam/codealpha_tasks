import React, { useState } from 'react';

export default function ConversationList({ conversations, activeConversation, onSelectConversation }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const d = new Date(timeString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
      {/* Header & Search Bar */}
      <div className="p-4 border-b border-primary/10 space-y-3">
        <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">forum</span>
          Messages
        </h2>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 glass-input rounded-full text-xs text-on-surface focus:outline-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-primary/5">
        {filteredConversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-outline">No conversations found</div>
        ) : (
          filteredConversations.map((c) => {
            const isActive = activeConversation && activeConversation._id === c._id;

            return (
              <div
                key={c._id}
                onClick={() => onSelectConversation(c)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isActive ? 'bg-primary/15 font-semibold' : 'hover:bg-white/40'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-primary/15" />
                    {c.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white"></div>
                    )}
                  </div>

                  <div className="truncate">
                    <h4 className="text-xs font-bold text-on-surface truncate">{c.name}</h4>
                    <p className="text-[11px] text-outline truncate">{c.lastMessage || 'Started a conversation'}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-[10px] text-outline shrink-0">
                  <span>{formatTime(c.lastMessageTime)}</span>
                  {c.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary text-white font-bold flex items-center justify-center text-[10px]">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
