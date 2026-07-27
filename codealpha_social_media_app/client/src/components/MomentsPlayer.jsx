import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReportModal from './ReportModal';

export default function MomentsPlayer({ moments, autoScrollSpeed = 'off', onNextMoment }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(342);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const timerRef = useRef(null);

  const currentMoment = moments[currentIndex] || moments[0] || {};

  useEffect(() => {
    if (autoScrollSpeed !== 'off' && moments.length > 0) {
      let intervalMs = 5000;
      if (autoScrollSpeed === 'slow') intervalMs = 8000;
      if (autoScrollSpeed === 'fast') intervalMs = 3000;

      timerRef.current = setInterval(() => {
        handleNext();
      }, intervalMs);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [currentIndex, autoScrollSpeed, moments]);

  const handleNext = () => {
    if (currentIndex < moments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setLiked(false);
    setBookmarked(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Moment link copied to clipboard!');
    setShowMenu(false);
  };

  if (!currentMoment || !currentMoment.mediaUrl) {
    return (
      <div className="py-20 text-center text-xs text-outline">Loading Moments Player...</div>
    );
  }

  const user = currentMoment.user || {};

  return (
    <div className="relative max-w-sm w-full h-[82vh] rounded-[32px] overflow-hidden glass-card shadow-2xl border border-white/20 flex flex-col justify-between mx-auto select-none">
      {/* Background Media */}
      <img
        src={currentMoment.mediaUrl}
        alt="Moment"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

      {/* Top Bar Navigation & Controls */}
      <div className="relative p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white" />
          <div className="text-white drop-shadow-md">
            <h4 className="text-xs font-bold">{user.name}</h4>
            <p className="text-[10px] text-white/80">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white">
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-full bg-black/40 backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full bg-black/40 backdrop-blur-md">
            <span className="material-symbols-outlined text-sm">more_vert</span>
          </button>
        </div>
      </div>

      {/* Extended 3-Dot Options Menu */}
      {showMenu && (
        <div className="absolute right-4 top-14 w-48 glass-dropdown rounded-2xl p-2 z-30 space-y-1 text-xs text-on-surface">
          <button onClick={() => setBookmarked(!bookmarked)} className="w-full p-2 text-left hover:bg-primary/10 rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-normal">bookmark</span>
            <span>{bookmarked ? 'Saved' : 'Save Moment'}</span>
          </button>
          <button onClick={handleCopyLink} className="w-full p-2 text-left hover:bg-primary/10 rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-normal">link</span>
            <span>Copy Link</span>
          </button>
          <button onClick={() => { alert('Moment added to Download queue'); setShowMenu(false); }} className="w-full p-2 text-left hover:bg-primary/10 rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-normal">download</span>
            <span>Download Demo</span>
          </button>
          <button onClick={() => { setShowMenu(false); setShowReportModal(true); }} className="w-full p-2 text-left hover:bg-error/10 text-error rounded-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm font-normal">flag</span>
            <span>Report Moment</span>
          </button>
        </div>
      )}

      {/* Right Side Engagement Action Buttons */}
      <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-4 text-white">
        <button onClick={() => { setLiked(!liked); setLikesCount(liked ? likesCount - 1 : likesCount + 1); }} className="flex flex-col items-center gap-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${liked ? 'bg-secondary text-white' : 'bg-black/40'}`}>
            <span className={`material-symbols-outlined text-xl ${liked ? 'filled' : ''}`}>favorite</span>
          </div>
          <span className="text-[11px] font-bold drop-shadow-md">{likesCount}</span>
        </button>

        <button onClick={() => alert('Opening Moment comments thread')} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
          </div>
          <span className="text-[11px] font-bold drop-shadow-md">48</span>
        </button>

        <button onClick={handleCopyLink} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">share</span>
          </div>
          <span className="text-[11px] font-bold drop-shadow-md">Share</span>
        </button>
      </div>

      {/* Bottom Info & Navigation Controls */}
      <div className="relative p-5 z-10 space-y-3 text-white">
        {currentMoment.caption && (
          <p className="text-xs font-medium drop-shadow-md max-w-[80%] leading-relaxed">{currentMoment.caption}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 bg-white/20 hover:bg-white/30 rounded-full disabled:opacity-30">
              <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
            </button>
            <button onClick={handleNext} className="p-2 bg-white/20 hover:bg-white/30 rounded-full">
              <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </button>
          </div>

          <span className="text-[11px] text-white/80 font-bold">
            {currentIndex + 1} / {moments.length}
          </span>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="post"
        targetId={currentMoment._id}
        targetName={currentMoment.caption?.slice(0, 30)}
      />
    </div>
  );
}
