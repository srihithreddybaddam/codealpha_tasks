import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import Footer from '../components/Footer';
import discoveryService from '../services/discoveryService';

export default function ExplorePage() {
  const [exploreData, setExploreData] = useState({
    posts: [],
    suggestedUsers: [],
    trendingHashtags: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplore();
  }, []);

  const fetchExplore = async () => {
    setLoading(true);
    try {
      const res = await discoveryService.getExplore();
      if (res.success) {
        setExploreData({
          posts: res.posts || [],
          suggestedUsers: res.suggestedUsers || [],
          trendingHashtags: res.trendingHashtags || []
        });
      }
    } catch (err) {
      console.warn('[Explore Fetch Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          {/* Header Banner */}
          <div className="glass-card rounded-3xl p-6 border border-primary/10 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">explore</span>
                Explore & Discover
              </h1>
              <p className="text-xs text-outline mt-0.5">Discover trending Indian photography, tech innovations, and popular creators.</p>
            </div>
          </div>

          {/* Trending Topics Tags with Fixed Contrast & Hover Animations */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {exploreData.trendingHashtags.map((h) => (
              <a
                key={h._id || h.name}
                href={`/hashtags/${h.name}`}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-xs"
              >
                #{h.name}
              </a>
            ))}
          </div>

          {/* Explore Masonry Grid Layout with Balanced Category Distribution */}
          {loading ? (
            <div className="py-16 text-center text-xs text-outline">Loading Explore Grid...</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-2 gap-6 space-y-6">
              {exploreData.posts.map((post) => (
                <div key={post._id} className="break-inside-avoid">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}

          <Footer />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
