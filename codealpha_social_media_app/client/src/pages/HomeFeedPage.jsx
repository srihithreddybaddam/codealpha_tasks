import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import DailySparksBar from '../components/DailySparksBar';
import HomeRightSidebar from '../components/HomeRightSidebar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';
import DeletePostModal from '../components/DeletePostModal';
import CircleManagerModal from '../components/CircleManagerModal';
import Toast from '../components/Toast';
import Footer from '../components/Footer';
import postService from '../services/postService';

export default function HomeFeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getPosts();
      if (res.success && res.posts) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.warn('[Home Feed Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setToast({ message: 'Post published to Home Feed!', type: 'success' });
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    setToast({ message: 'Post updated successfully!', type: 'success' });
  };

  const handleConfirmDelete = async () => {
    if (!deletingPost) return;

    setIsDeleting(true);
    try {
      const res = await postService.deletePost(deletingPost._id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p._id !== deletingPost._id));
        setToast({ message: 'Post deleted successfully.', type: 'success' });
        setDeletingPost(null);
      }
    } catch (err) {
      setToast({ message: 'Failed to delete post.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header onOpenCreatePost={() => setIsCreateModalOpen(true)} />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto justify-between">
        <Sidebar onOpenCreatePost={() => setIsCreateModalOpen(true)} />

        {/* Main Feed Container */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          {/* 24-hr Daily Sparks Ring Bar */}
          <DailySparksBar />

          {/* Feed Posts Timeline Starts Immediately Below Daily Sparks */}
          {loading ? (
            <div className="py-16 text-center text-xs text-outline space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Loading Vibely Feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-primary">dynamic_feed</span>
              <h3 className="font-bold text-base text-on-surface">No Feed Posts Available</h3>
              <p className="text-xs text-outline">Be the first to publish a post and share with the Vibely community!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEditPost={(p) => setEditingPost(p)}
                  onDeletePost={(p) => setDeletingPost(p)}
                />
              ))}
            </div>
          )}

          <Footer />
        </main>

        {/* Right Sidebar Widgets */}
        <HomeRightSidebar />
      </div>

      <BottomNav />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
        onError={(err) => setToast({ message: err, type: 'error' })}
      />

      <CircleManagerModal
        isOpen={isCircleModalOpen}
        onClose={() => setIsCircleModalOpen(false)}
      />

      <EditPostModal
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onPostUpdated={handlePostUpdated}
        onError={(err) => setToast({ message: err, type: 'error' })}
      />

      <DeletePostModal
        isOpen={Boolean(deletingPost)}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleConfirmDelete}
        deleting={isDeleting}
      />

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
