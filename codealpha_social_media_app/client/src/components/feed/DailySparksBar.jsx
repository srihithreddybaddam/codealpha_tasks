import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DailySparksBar() {
  const { user } = useAuth();
  const [sparks, setSparks] = useState([]);
  const [activeSparkIndex, setActiveSparkIndex] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSparkUrl, setNewSparkUrl] = useState('');
  const [newSparkCaption, setNewSparkCaption] = useState('');

  useEffect(() => {
    const fetchSparks = async () => {
      try {
        const res = await api.get('/sparks');
        if (res.data.success) {
          setSparks(res.data.sparks);
        }
      } catch (err) {
        setSparks([
          {
            _id: 's1',
            author: { name: 'Elena Rostova', username: 'elena_design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
            mediaUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
            caption: 'Designing late night UI ✨'
          },
          {
            _id: 's2',
            author: { name: 'Marcus Chen', username: 'marcus_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
            mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            caption: 'Full-stack engine operational 🚀'
          },
          {
            _id: 's3',
            author: { name: 'Sophia Williams', username: 'sophia_art', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80' },
            mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
            caption: 'Art gallery Tokyo preview 🎨'
          }
        ]);
      }
    };
    fetchSparks();
  }, []);

  const handleCreateSpark = async (e) => {
    e.preventDefault();
    const created = {
      _id: 's_' + Date.now(),
      author: user || { name: 'You', username: 'you', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
      mediaUrl: newSparkUrl || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      caption: newSparkCaption || 'My Daily Spark ✨'
    };
    setSparks([created, ...sparks]);
    setShowCreateModal(false);
    setNewSparkUrl('');
    setNewSparkCaption('');
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <span className="text-base text-primary">⚡</span> Daily Sparks (24h)
        </h3>
        <span className="text-[11px] text-outline">Expires in 24 hours</span>
      </div>

      {/* Horizontal Scroll Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {/* Add Spark Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
        >
          <div className="w-16 h-16 rounded-full p-[2.5px] border-2 border-dashed border-primary/50 group-hover:border-primary flex items-center justify-center transition-colors bg-surface-container-low">
            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-on-surface">Add Spark</span>
        </button>

        {/* Existing Sparks */}
        {sparks.map((spark, idx) => (
          <button
            key={spark._id}
            onClick={() => setActiveSparkIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-primary via-primary-container to-secondary shadow-md group-hover:scale-105 transition-transform">
              <img
                src={spark.author.avatar}
                alt={spark.author.name}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="text-[11px] font-medium text-on-surface-variant truncate max-w-[68px]">
              {spark.author.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Spark Viewer Modal */}
      {activeSparkIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[80vh] rounded-3xl overflow-hidden bg-on-background shadow-2xl flex flex-col justify-between p-6">
            {/* Top Bar Progress */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-2">
                <img
                  src={sparks[activeSparkIndex].author.avatar}
                  alt={sparks[activeSparkIndex].author.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="text-xs font-bold">{sparks[activeSparkIndex].author.name}</p>
                  <p className="text-[10px] text-white/70">@{sparks[activeSparkIndex].author.username}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveSparkIndex(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Spark Media Image */}
            <img
              src={sparks[activeSparkIndex].mediaUrl}
              alt="Spark"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

            {/* Bottom Caption & Controls */}
            <div className="relative z-10 text-white space-y-4">
              <p className="text-sm font-medium leading-snug">{sparks[activeSparkIndex].caption}</p>
              <div className="flex items-center justify-between border-t border-white/20 pt-3">
                <button
                  onClick={() =>
                    setActiveSparkIndex((prev) => (prev > 0 ? prev - 1 : sparks.length - 1))
                  }
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md"
                >
                  ← Prev
                </button>
                <button
                  onClick={() =>
                    setActiveSparkIndex((prev) => (prev < sparks.length - 1 ? prev + 1 : 0))
                  }
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Spark Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-on-surface">Add a Daily Spark ⚡</h3>
            <p className="text-xs text-outline">Your spark will be visible for 24 hours to your connections.</p>
            <form onSubmit={handleCreateSpark} className="space-y-3">
              <input
                type="url"
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                value={newSparkUrl}
                onChange={(e) => setNewSparkUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-surface-container-low rounded-xl border border-surface-container-high focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Add a quick caption..."
                value={newSparkCaption}
                onChange={(e) => setNewSparkCaption(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-surface-container-low rounded-xl border border-surface-container-high focus:outline-none focus:border-primary"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-outline hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-primary hover:bg-primary-container text-white rounded-full shadow-md shadow-primary/20"
                >
                  Publish Spark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
