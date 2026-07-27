import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import chatService from '../services/chatService';

export default function ChatWindow({ conversation }) {
  const { user: currentUser } = useAuth();
  const { socket, onlineUsersMap } = useSocket();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  const currentUserIdStr = (currentUser?._id || currentUser?.id || '65f1a2b3c4d5e6f7a8b9c0d1').toString();
  const isTargetOnline = conversation ? onlineUsersMap[conversation._id] || conversation.isOnline : false;

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    if (!socket || !conversation) return;

    // Listen for incoming real-time socket messages
    const handleReceiveMessage = (msg) => {
      const senderId = (msg.sender._id || msg.sender).toString();
      const receiverId = (msg.receiver._id || msg.receiver).toString();

      if (
        (senderId === conversation._id && receiverId === currentUserIdStr) ||
        (senderId === currentUserIdStr && receiverId === conversation._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    // Listen for typing events
    const handleTypingStart = (data) => {
      if (data.senderId === conversation._id) setIsTyping(true);
    };

    const handleTypingStop = (data) => {
      if (data.senderId === conversation._id) setIsTyping(false);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, conversation, currentUserIdStr]);

  const fetchMessages = async () => {
    try {
      const res = await chatService.getMessages(conversation._id);
      if (res.success && res.messages) {
        setMessages(res.messages);
        scrollToBottom();
      }
    } catch (err) {
      console.warn('[Chat Fetch Error]', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!socket || !conversation) return;

    socket.emit('typing_start', { senderId: currentUserIdStr, receiverId: conversation._id });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing_stop', { senderId: currentUserIdStr, receiverId: conversation._id });
    }, 1500);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !imageFile) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('receiverId', conversation._id);
      formData.append('content', inputText);
      if (imageFile) {
        formData.append('media', imageFile);
        formData.append('messageType', 'image');
      }

      const res = await chatService.sendMessage(formData);
      if (res.success && res.message) {
        const newMsg = res.message;
        setMessages((prev) => [...prev, newMsg]);

        // Emit real-time socket event
        if (socket) {
          socket.emit('send_message', { ...newMsg, receiverId: conversation._id });
        }

        setInputText('');
        setImageFile(null);
        setImagePreview(null);
        scrollToBottom();
      }
    } catch (err) {
      console.error('[Send Message Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      const res = await chatService.deleteMessage(msgId);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
      }
    } catch (e) {}
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full glass-card rounded-3xl border border-primary/10 p-8 text-center text-outline">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-xs">
          <span className="material-symbols-outlined text-3xl">chat</span>
        </div>
        <h3 className="font-bold text-base text-on-surface">Your Vibely Private Messages</h3>
        <p className="text-xs max-w-xs mt-1">Select a conversation from the list to start chatting in real time!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass-card rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
      {/* Conversation Header */}
      <div className="p-4 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover border border-primary/15" />
            {isTargetOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{conversation.name}</h3>
            <p className="text-[11px] text-outline">
              {isTargetOnline ? <span className="text-success font-semibold">Active Now</span> : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Message Thread Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/30">
        {messages.map((msg) => {
          const senderIdStr = (msg.sender._id || msg.sender).toString();
          // STRICT RIGHT/LEFT ALIGNMENT EVALUATION
          const isMe = senderIdStr === currentUserIdStr || msg.sender.username === currentUser?.username;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2.5 w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Left-aligned Sender Avatar for Incoming Messages */}
              {!isMe && (
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-8 h-8 rounded-full object-cover mb-1 border border-primary/15 shrink-0"
                />
              )}

              {/* Message Bubble Column */}
              <div className={`space-y-1 max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden max-h-56 bg-surface-container-low border border-surface-container-high shadow-xs">
                    <img src={msg.mediaUrl} alt="Chat attachment" className="w-full h-full object-cover max-h-56" />
                  </div>
                )}

                {msg.content && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed break-words shadow-xs transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white rounded-br-xs font-medium text-right'
                        : 'glass-card text-on-surface rounded-bl-xs text-left'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}

                {/* Status Timestamp & Delivery Receipts */}
                <div className={`flex items-center gap-1.5 text-[10px] text-outline ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && (
                    <>
                      <span className="material-symbols-outlined text-xs text-primary font-bold" title="Seen">
                        done_all
                      </span>
                      <button onClick={() => handleDeleteMessage(msg._id)} className="hover:text-error ml-1">
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-outline italic">
            <span className="material-symbols-outlined text-base animate-pulse">more_horiz</span>
            <span>{conversation.name} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Overlay if selected */}
      {imagePreview && (
        <div className="p-3 bg-white/70 border-t border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
            <span className="text-xs text-outline font-medium">Image attached</span>
          </div>
          <button
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
            }}
            className="text-outline hover:text-error"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-primary/10 flex items-center gap-2 bg-white/50">
        <label className="p-2 text-outline hover:text-primary rounded-full hover:bg-primary/10 cursor-pointer">
          <span className="material-symbols-outlined text-xl">image</span>
          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </label>

        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={handleInputChange}
          className="flex-1 glass-input px-4 py-2.5 text-xs rounded-full focus:outline-none"
        />

        <button
          type="submit"
          disabled={submitting || (!inputText.trim() && !imageFile)}
          className="p-2.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-container hover:to-purple-700 disabled:opacity-50 text-white rounded-full transition-all shadow-md shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </form>
    </div>
  );
}
