import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MomentsPlayer from '../components/MomentsPlayer';
import Footer from '../components/Footer';
import featureService from '../services/featureService';

export default function MomentsPage() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState('off'); // 'off', 'slow', 'normal', 'fast'

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    setLoading(true);
    try {
      const res = await featureService.getMoments();
      if (res.success && res.moments) {
        setMoments(res.moments);
      }
    } catch (err) {
      console.warn('[Moments Page Warning]', err);
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
          {/* Header & Auto Scroll Controls */}
          <div className="glass-card rounded-3xl p-5 border border-primary/10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">movie</span>
                Vibely Moments
              </h1>
              <p className="text-xs text-outline">Creative vertical media updates & visual storytelling.</p>
            </div>

            {/* Auto Scroll Speed Selector */}
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-full border border-primary/10 text-xs">
              <span className="text-[11px] font-bold text-outline px-2">Auto Scroll:</span>
              {['off', 'slow', 'normal', 'fast'].map((s) => (
                <button
                  key={s}
                  onClick={() => setAutoScrollSpeed(s)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${
                    autoScrollSpeed === s
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface hover:bg-white/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Player */}
          {loading ? (
            <div className="py-20 text-center text-xs text-outline">Loading Moments...</div>
          ) : (
            <MomentsPlayer moments={moments} autoScrollSpeed={autoScrollSpeed} />
          )}

          <Footer />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
