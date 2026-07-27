import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import FeedSkeleton from '../components/FeedSkeleton';
import discoveryService from '../services/discoveryService';

export default function HashtagPage() {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHashtagPosts();
  }, [name]);

  const fetchHashtagPosts = async () => {
    setLoading(true);
    try {
      const res = await discoveryService.getPostsByHashtag(name);
      if (res.success) {
        setPosts(res.posts || []);
        setUsageCount(res.usageCount || (res.posts ? res.posts.length : 0));
      }
    } catch (err) {
      console.warn('[Hashtag Page Warning]', err);
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
          {/* Hashtag Header */}
          <div className="p-6 bg-white rounded-3xl border border-surface-container-high shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-primary/20">
              #
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">#{name}</h1>
              <p className="text-xs text-outline font-medium">
                {usageCount} {usageCount === 1 ? 'post' : 'posts'} tagged with #{name}
              </p>
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <FeedSkeleton />
          ) : posts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-surface-container-high space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">grid_off</span>
              <h3 className="font-bold text-base text-on-surface">No Posts Found</h3>
              <p className="text-xs text-outline">No community posts have been published with #{name} yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
