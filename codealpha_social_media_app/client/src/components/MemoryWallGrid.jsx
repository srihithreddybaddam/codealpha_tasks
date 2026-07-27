import React, { useState, useEffect } from 'react';
import featureService from '../services/featureService';
import PostCard from './PostCard';

export default function MemoryWallGrid({ userId, isOwnProfile }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, [userId]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await featureService.getMemories(userId);
      if (res.success && res.memories) {
        setMemories(res.memories);
      }
    } catch (err) {
      console.warn('[Memory Wall Warning]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpinMemory = async (memoryId) => {
    try {
      const res = await featureService.deleteMemory(memoryId);
      if (res.success) {
        setMemories((prev) => prev.filter((m) => m._id !== memoryId));
      }
    } catch (e) {}
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-outline">Loading Memory Wall...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">push_pin</span>
          Memory Wall ({memories.length})
        </h3>
        <span className="text-xs text-outline font-medium">Pinned Showcase Highlights</span>
      </div>

      {memories.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-surface-container-high space-y-2">
          <span className="material-symbols-outlined text-4xl text-outline font-light">auto_awesome_mosaic</span>
          <h4 className="text-sm font-bold text-on-surface">No Pinned Memories</h4>
          <p className="text-xs text-outline">
            {isOwnProfile
              ? 'Pin your favorite posts or moments to showcase them here on your Memory Wall!'
              : 'This creator has not pinned any memories yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memories.map((mem) => {
            const item = mem.post || mem.moment;
            if (!item) return null;

            return (
              <div key={mem._id} className="relative group bg-white rounded-3xl border border-surface-container-high overflow-hidden shadow-xs">
                {isOwnProfile && (
                  <button
                    onClick={() => handleUnpinMemory(mem._id)}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all shadow-md"
                    title="Unpin Memory"
                  >
                    <span className="material-symbols-outlined text-sm">keep_off</span>
                  </button>
                )}

                <div className="h-60 w-full relative bg-surface-container-low">
                  <img src={item.imageUrl || item.mediaUrl} alt="Memory item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-0.5">
                    <p className="font-semibold truncate">{item.caption || 'Pinned Memory'}</p>
                    <p className="text-[10px] text-white/70">@{item.user?.username || 'creator'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
