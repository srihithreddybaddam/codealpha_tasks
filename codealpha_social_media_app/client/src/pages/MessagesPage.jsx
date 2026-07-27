import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import chatService from '../services/chatService';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await chatService.getConversations();
      if (res.success && res.conversations) {
        setConversations(res.conversations);
        if (res.conversations.length > 0) {
          setActiveConversation(res.conversations[0]);
        }
      }
    } catch (err) {
      console.warn('[Messages Page Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full h-[calc(100vh-80px)] pb-20 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Conversations Sidebar */}
            <div className={`md:block h-full ${activeConversation ? 'hidden md:block' : 'block'}`}>
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={(c) => setActiveConversation(c)}
              />
            </div>

            {/* Main Chat Window */}
            <div className={`md:col-span-2 h-full ${activeConversation ? 'block' : 'hidden md:block'}`}>
              {activeConversation && (
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden text-xs text-primary font-semibold flex items-center gap-1 mb-2"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to conversations
                </button>
              )}
              <ChatWindow conversation={activeConversation} />
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
