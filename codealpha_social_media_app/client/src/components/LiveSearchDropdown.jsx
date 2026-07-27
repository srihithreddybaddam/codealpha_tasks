import React from 'react';
import { Link } from 'react-router-dom';

export default function LiveSearchDropdown({ results, query, loading, onClose }) {
  if (!query.trim()) return null;

  const users = results.users || [];
  const posts = results.posts || [];
  const hashtags = results.hashtags || [];

  const hasAnyResults = users.length > 0 || posts.length > 0 || hashtags.length > 0;

  return (
    <div
      className="absolute left-0 right-0 top-12 bg-white rounded-2xl border border-surface-container-high shadow-2xl p-3 z-50 max-h-96 overflow-y-auto space-y-3 animate-fade-in"
      onMouseDown={(e) => e.preventDefault()}
    >
      {loading ? (
        <div className="py-4 text-center text-xs text-outline">Searching Vibely...</div>
      ) : !hasAnyResults ? (
        <div className="py-4 text-center text-xs text-outline">
          No matches found for "<span className="font-semibold text-on-surface">{query}</span>"
        </div>
      ) : (
        <>
          {/* Matching Users */}
          {users.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-outline px-2">Creators</div>
              {users.slice(0, 3).map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-on-surface truncate">{u.name}</p>
                    <p className="text-[11px] text-outline truncate">@{u.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Matching Hashtags */}
          {hashtags.length > 0 && (
            <div className="space-y-1 border-t border-surface-container-high pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-outline px-2">Hashtags</div>
              {hashtags.slice(0, 3).map((h) => (
                <Link
                  key={h._id || h.name}
                  to={`/hashtags/${h.name}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low text-xs transition-colors"
                >
                  <span className="font-semibold text-primary">#{h.name}</span>
                  <span className="text-[11px] text-outline">{h.count} posts</span>
                </Link>
              ))}
            </div>
          )}

          {/* View All Full Search Button */}
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block text-center py-2 bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-primary rounded-xl transition-colors"
          >
            See all results for "{query}" →
          </Link>
        </>
      )}
    </div>
  );
}
