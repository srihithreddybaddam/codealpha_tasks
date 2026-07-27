import React from 'react';
import { Link } from 'react-router-dom';
import SuggestedUsersWidget from './SuggestedUsersWidget';

export default function HomeRightSidebar() {
  const trendingHashtags = [
    { name: 'bengalurutech', count: '2.4K posts' },
    { name: 'chaiandcode', count: '1.9K posts' },
    { name: 'isro', count: '1.7K posts' },
    { name: 'monsoonvibes', count: '1.5K posts' },
    { name: 'hyderabaddevs', count: '1.2K posts' }
  ];

  const techNews = [
    { title: 'AI Breakthroughs in Indian Healthcare', time: '2h ago' },
    { title: 'React 19 Server Components Standardized', time: '4h ago' },
    { title: 'ISRO Prepares Chandrayaan Next Phase', time: '6h ago' }
  ];

  const upcomingFestivals = [
    { name: 'Ganesh Chaturthi', date: 'Sept 7', color: 'from-amber-500 to-orange-500' },
    { name: 'Diwali Lights Festival', date: 'Nov 1', color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 space-y-5 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto pb-8 pt-6 pr-2 scrollbar-none">
      {/* 1. Suggested Creators */}
      <SuggestedUsersWidget />

      {/* 2. Trending Topics & Hashtags */}
      <div className="glass-card rounded-3xl p-5 border border-primary/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-base">trending_up</span>
            Trending Topics
          </h3>
          <Link to="/explore" className="text-xs font-semibold text-primary hover:underline">
            Explore
          </Link>
        </div>

        <div className="space-y-2.5">
          {trendingHashtags.map((h) => (
            <Link
              key={h.name}
              to={`/hashtags/${h.name}`}
              className="block p-2 rounded-2xl hover:bg-white/60 transition-colors"
            >
              <p className="text-xs font-bold text-on-surface hover:text-primary">#{h.name}</p>
              <p className="text-[10px] text-outline">{h.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Today's Tech News & Community Highlights */}
      <div className="glass-card rounded-3xl p-5 border border-primary/10 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-base">newspaper</span>
          Today's Tech News
        </h3>

        <div className="space-y-3 divide-y divide-primary/5">
          {techNews.map((n, i) => (
            <div key={i} className="pt-2 first:pt-0">
              <h4 className="text-xs font-semibold text-on-surface hover:text-primary cursor-pointer leading-snug">
                {n.title}
              </h4>
              <p className="text-[10px] text-outline mt-0.5">{n.time} • Tech Trends</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Upcoming Indian Festivals */}
      <div className="glass-card rounded-3xl p-5 border border-primary/10 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-500 text-base">celebration</span>
          Upcoming Indian Festivals
        </h3>

        <div className="space-y-2">
          {upcomingFestivals.map((f, i) => (
            <div key={i} className="p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/10 border border-primary/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface">{f.name}</p>
                <p className="text-[10px] text-outline">Community Celebration</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-primary shadow-xs">
                {f.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Daily Quote & Vibely Tips */}
      <div className="glass-card rounded-3xl p-5 border border-primary/10 space-y-2 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <span className="material-symbols-outlined text-base">format_quote</span>
          <span>Daily Quote</span>
        </div>
        <p className="text-xs italic text-on-surface leading-relaxed">
          "Code is poetry written in logic. Create with passion, connect with purpose, inspire the future."
        </p>
      </div>
    </aside>
  );
}
