import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import CreatePostModal from '../components/CreatePostModal';

export default function MainLayout({ children }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header onOpenCreatePost={() => setIsCreateModalOpen(true)} />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar onOpenCreatePost={() => setIsCreateModalOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full pb-24 md:pb-8">
          {children}
        </main>
      </div>

      <BottomNav onOpenCreatePost={() => setIsCreateModalOpen(true)} />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
