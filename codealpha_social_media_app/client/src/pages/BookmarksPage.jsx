import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import FeedSkeleton from '../components/FeedSkeleton';
import Toast from '../components/Toast';
import interactionService from '../services/interactionService';

export default function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await interactionService.getBookmarks();
      if (res.success && res.posts) {
        setBookmarkedPosts(res.posts);
      }
    } catch (err) {
      console.warn('[Vibely Bookmarks] Failed to fetch bookmarks');
      setToast({ message: 'Could not load saved bookmarks.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
            <div>
              <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bookmark</span>
                Saved Posts Repository
              </h1>
              <p className="text-xs text-outline">Private collection of your bookmarked posts and inspirations.</p>
            </div>
            <span className="text-xs font-semibold text-outline">
              {bookmarkedPosts.length} {bookmarkedPosts.length === 1 ? 'saved post' : 'saved posts'}
            </span>
          </div>

          {loading ? (
            <FeedSkeleton />
          ) : bookmarkedPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-surface-container-high space-y-3 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl">
                <span className="material-symbols-outlined">bookmark_border</span>
              </div>
              <h3 className="font-bold text-base text-on-surface">No Saved Posts Yet</h3>
              <p className="text-xs text-outline max-w-xs mx-auto">
                Tap the bookmark icon on any post in your feed to save it to your private repository.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookmarkedPosts.map((post) => (
                <PostCard key={post._id} post={post} />
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
