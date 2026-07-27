import React, { useState, useEffect, useRef } from 'react';
import featureService from '../services/featureService';
import useAuth from '../hooks/useAuth';
import { validateImageFile } from '../utils/validators';

export default function DailySparksBar() {
  const { user } = useAuth();
  const [sparks, setSparks] = useState([]);
  const [activeSparkIndex, setActiveSparkIndex] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Viewer Interactivity States
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const progressTimerRef = useRef(null);

  // Spark Creator Form State
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSparks();
  }, []);

  // Lock/Unlock Body Scroll when Spark Viewer is Open
  useEffect(() => {
    if (activeSparkIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeSparkIndex]);

  // Timer & Keyboard Arrow Navigation for Spark Story Viewer
  useEffect(() => {
    if (activeSparkIndex === null || isPaused) return;

    progressTimerRef.current = setInterval(() => {
      handleNextSpark();
    }, 5000);

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextSpark();
      if (e.key === 'ArrowLeft') handlePrevSpark();
      if (e.key === 'Escape') handleCloseViewer();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSparkIndex, isPaused, sparks]);

  const fetchSparks = async () => {
    try {
      const res = await featureService.getSparks();
      if (res.success && res.sparks) {
        setSparks(res.sparks);
      }
    } catch (err) {
      console.warn('[Sparks Fetch Warning]', err);
    }
  };

  const handleOpenSparkViewer = (index) => {
    setActiveSparkIndex(index);
    setLiked(false);
    setReplyText('');
    setShowMenu(false);
    const targetSpark = sparks[index];
    if (targetSpark && targetSpark._id) {
      featureService.viewSpark(targetSpark._id).catch(() => {});
    }
  };

  const handleCloseViewer = () => {
    setActiveSparkIndex(null);
    setIsPaused(false);
  };

  const handleNextSpark = () => {
    if (activeSparkIndex !== null && activeSparkIndex < sparks.length - 1) {
      setActiveSparkIndex((prev) => prev + 1);
      setLiked(false);
      setReplyText('');
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevSpark = () => {
    if (activeSparkIndex !== null && activeSparkIndex > 0) {
      setActiveSparkIndex((prev) => prev - 1);
      setLiked(false);
      setReplyText('');
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const val = validateImageFile(file);
    if (!val.isValid) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handlePublishSpark = async (e) => {
    e.preventDefault();
    if (!mediaFile) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('media', mediaFile);
      formData.append('caption', caption);

      const res = await featureService.createSpark(formData);
      if (res.success && res.spark) {
        setSparks((prev) => [res.spark, ...prev]);
        setIsAddModalOpen(false);
        setMediaFile(null);
        setMediaPreview(null);
        setCaption('');
      }
    } catch (err) {
      console.error('[Spark Upload Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeSpark = activeSparkIndex !== null ? sparks[activeSparkIndex] : null;

  return (
    <div className="glass-card rounded-3xl p-4 border border-primary/10 space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-base">bolt</span>
          Daily Sparks (24h)
        </h3>
        <span className="text-[11px] text-outline font-medium">Expires in 24 hours</span>
      </div>

      {/* Horizontal Scroll Story Rings */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1 pt-1 scrollbar-none">
        {/* Add Spark Button */}
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/50 group-hover:border-primary flex items-center justify-center bg-primary/5 transition-all shadow-xs">
            <span className="material-symbols-outlined text-primary text-xl">add</span>
          </div>
          <span className="text-[11px] font-semibold text-on-surface">Add Spark</span>
        </div>

        {/* Active Sparks List */}
        {sparks.map((spark, idx) => (
          <div
            key={spark._id || idx}
            onClick={() => handleOpenSparkViewer(idx)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <div className="w-14 h-14 rounded-full p-0.5 bg-spark-gradient group-hover:scale-105 transition-transform shadow-xs">
              <img
                src={spark.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={spark.user?.name}
                className="w-full h-full rounded-full object-cover border-2 border-white bg-white"
              />
            </div>
            <span className="text-[11px] font-medium text-on-surface truncate max-w-[64px]">
              {spark.user?.name?.split(' ')[0] || 'Spark'}
            </span>
          </div>
        ))}
      </div>

      {/* Add Spark Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <h3 className="text-base font-bold text-on-surface">New Daily Spark</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {mediaPreview ? (
              <div className="relative rounded-2xl overflow-hidden max-h-60 bg-surface-container-low border border-surface-container-high">
                <img src={mediaPreview} alt="Spark preview" className="w-full h-full object-cover max-h-60" />
                <button
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-primary/5">
                <span className="material-symbols-outlined text-secondary text-3xl">bolt</span>
                <span className="text-xs font-semibold text-on-surface">Select Photo for Spark</span>
                <input type="file" accept="image/*" onChange={handleMediaChange} className="hidden" />
              </label>
            )}

            <input
              type="text"
              placeholder="Add short spark caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2.5 glass-input rounded-xl text-xs text-on-surface focus:outline-none"
            />

            <button
              onClick={handlePublishSpark}
              disabled={submitting || !mediaFile}
              className="w-full py-2.5 bg-spark-gradient disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-md shadow-secondary/20 transition-all"
            >
              {submitting ? 'Publishing...' : 'Share Daily Spark ✨'}
            </button>
          </div>
        </div>
      )}

      {/* Redesigned Centered Frosted Glassmorphism Spark Story Viewer Popup */}
      {activeSpark && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          {/* Centered Modal Container */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="relative max-w-md w-full h-[85vh] rounded-[32px] overflow-hidden glass-card shadow-2xl border border-white/20 flex flex-col justify-between"
          >
            {/* Background Story Media */}
            <img
              src={activeSpark.mediaUrl}
              alt="Spark content"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90"></div>

            {/* Top Bar Header & Progress Bar */}
            <div className="relative p-4 z-10 space-y-3">
              {/* Story Progress Bar */}
              <div className="flex items-center gap-1.5 w-full">
                {sparks.map((s, idx) => (
                  <div key={s._id || idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-secondary transition-all ${
                        idx < activeSparkIndex
                          ? 'w-full'
                          : idx === activeSparkIndex && !isPaused
                          ? 'w-full animate-[grow_5s_linear]'
                          : 'w-0'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Creator Info & Action Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeSpark.user?.avatar}
                    alt={activeSpark.user?.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/80 shadow-md"
                  />
                  <div className="text-white drop-shadow-md">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold">{activeSpark.user?.name || 'Vibely Creator'}</p>
                      {activeSpark.user?.isPremium && (
                        <span className="material-symbols-outlined text-primary text-xs shrink-0" title="Vibely Premium">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/80">@{activeSpark.user?.username || 'vibely'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60">
                    <span className="material-symbols-outlined text-base">more_vert</span>
                  </button>
                  <button onClick={handleCloseViewer} className="p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tap Left / Right Overlay Controls */}
            <div className="absolute inset-x-0 top-20 bottom-24 z-10 flex justify-between px-2">
              <button
                onClick={handlePrevSpark}
                disabled={activeSparkIndex === 0}
                className="w-1/3 h-full flex items-center justify-start text-white/50 hover:text-white transition-opacity disabled:opacity-0"
              >
                <span className="material-symbols-outlined text-3xl bg-black/30 p-2 rounded-full backdrop-blur-md">chevron_left</span>
              </button>
              <button
                onClick={handleNextSpark}
                className="w-1/3 h-full flex items-center justify-end text-white/50 hover:text-white transition-opacity"
              >
                <span className="material-symbols-outlined text-3xl bg-black/30 p-2 rounded-full backdrop-blur-md">chevron_right</span>
              </button>
            </div>

            {/* Options Dropdown */}
            {showMenu && (
              <div className="absolute right-4 top-16 w-44 glass-dropdown rounded-2xl p-2 z-30 space-y-1 text-xs text-on-surface">
                <button onClick={() => { alert('Spark link copied!'); setShowMenu(false); }} className="w-full p-2 text-left hover:bg-primary/10 rounded-xl font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm font-normal">share</span>
                  <span>Share Spark</span>
                </button>
                <button onClick={handleCloseViewer} className="w-full p-2 text-left hover:bg-error/10 text-error rounded-xl font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm font-normal">close</span>
                  <span>Close Viewer</span>
                </button>
              </div>
            )}

            {/* Bottom Caption & Interactive Reply Controls */}
            <div className="relative p-5 z-10 space-y-3 text-white">
              {activeSpark.caption && (
                <p className="text-xs font-medium drop-shadow-md leading-relaxed">{activeSpark.caption}</p>
              )}

              <div className="flex items-center justify-between text-[11px] text-white/80 pt-1 border-t border-white/20">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-xs">visibility</span>
                  {activeSpark.views ? activeSpark.views.length : 124} views
                </span>

                <div className="flex items-center gap-3">
                  <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 font-semibold">
                    <span className={`material-symbols-outlined text-lg ${liked ? 'filled text-secondary' : ''}`}>favorite</span>
                    <span>{liked ? 1 : 0}</span>
                  </button>
                </div>
              </div>

              {/* Reply Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder={`Reply to ${activeSpark.user?.name?.split(' ')[0]}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs text-white placeholder-white/70 focus:outline-none border border-white/30"
                />
                <button
                  onClick={() => {
                    if (replyText.trim()) {
                      alert(`Reply sent to ${activeSpark.user?.name}!`);
                      setReplyText('');
                    }
                  }}
                  disabled={!replyText.trim()}
                  className="p-2 bg-secondary text-white rounded-full disabled:opacity-50 shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
