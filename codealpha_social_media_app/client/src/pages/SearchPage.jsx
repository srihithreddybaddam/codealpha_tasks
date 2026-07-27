import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import PostCard from '../components/PostCard';
import SearchSkeleton from '../components/SearchSkeleton';
import discoveryService from '../services/discoveryService';
import followService from '../services/followService';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'posts', 'hashtags'
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem('vibely_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      executeSearch(queryParam, activeTab);
      saveSearchHistory(queryParam);
    }
  }, [queryParam, activeTab]);

  const saveSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
      const updated = [cleanTerm, ...filtered].slice(0, 8);
      localStorage.setItem('vibely_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearchItem = (termToRemove) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      localStorage.setItem('vibely_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('vibely_recent_searches');
  };

  const executeSearch = async (searchTerm, tab) => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const res = await discoveryService.search(searchTerm, tab);
      if (res.success) {
        setResults({
          users: res.users || [],
          posts: res.posts || [],
          hashtags: res.hashtags || []
        });
      }
    } catch (err) {
      console.warn('[Search Page Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim() });
  };

  const handleToggleFollow = async (targetUser) => {
    try {
      if (targetUser.isFollowing) {
        await followService.unfollowUser(targetUser._id);
      } else {
        await followService.followUser(targetUser._id);
      }
      setResults((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u._id === targetUser._id ? { ...u, isFollowing: !u.isFollowing } : u))
      }));
    } catch (e) {}
  };

  const hasAnyResults = results.users.length > 0 || results.posts.length > 0 || results.hashtags.length > 0;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          {/* Main Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-2xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search creators, posts, or #hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white rounded-full border border-surface-container-high text-sm font-medium text-on-surface focus:border-primary focus:outline-none shadow-sm transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSearchParams({});
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </form>

          {/* Search History Chips (If no query entered) */}
          {!queryParam && recentSearches.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-surface-container-high shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">history</span>
                  Recent Searches
                </span>
                <button onClick={clearAllHistory} className="text-xs font-semibold text-error hover:underline">
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-full text-xs font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    <span onClick={() => setSearchParams({ q: term })}>{term}</span>
                    <button onClick={() => removeSearchItem(term)} className="text-outline hover:text-error">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          {queryParam && (
            <div className="flex items-center gap-2 border-b border-surface-container-high pb-2 overflow-x-auto">
              {[
                { id: 'all', label: 'All Results', icon: 'travel_explore' },
                { id: 'users', label: 'Creators', icon: 'group' },
                { id: 'posts', label: 'Posts', icon: 'grid_on' },
                { id: 'hashtags', label: 'Hashtags', icon: 'tag' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Results Container */}
          {queryParam && (
            <div>
              {loading ? (
                <SearchSkeleton />
              ) : !hasAnyResults ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-surface-container-high space-y-2">
                  <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                  <h3 className="font-bold text-base text-on-surface">No Results Found</h3>
                  <p className="text-xs text-outline">
                    We couldn't find any matches for "<span className="font-semibold">{queryParam}</span>".
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Matching Creators */}
                  {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">Creators</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {results.users.map((u) => (
                          <div key={u._id} className="p-4 bg-white rounded-2xl border border-surface-container-high flex items-center justify-between gap-3 shadow-xs">
                            <Link to={`/profile/${u.username}`} className="flex items-center gap-3 overflow-hidden">
                              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                              <div className="truncate">
                                <h4 className="text-xs font-bold text-on-surface hover:text-primary transition-colors truncate">{u.name}</h4>
                                <p className="text-[11px] text-outline truncate">@{u.username}</p>
                              </div>
                            </Link>

                            <button
                              onClick={() => handleToggleFollow(u)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                                u.isFollowing
                                  ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                                  : 'bg-primary hover:bg-primary-container text-white'
                              }`}
                            >
                              {u.isFollowing ? 'Following' : 'Follow'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Hashtags */}
                  {(activeTab === 'all' || activeTab === 'hashtags') && results.hashtags.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">Hashtags</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {results.hashtags.map((h) => (
                          <Link
                            key={h._id || h.name}
                            to={`/hashtags/${h.name}`}
                            className="px-4 py-2 bg-white border border-surface-container-high hover:border-primary rounded-2xl text-xs font-semibold text-primary flex items-center gap-2 shadow-xs transition-all"
                          >
                            <span>#{h.name}</span>
                            <span className="text-[10px] text-outline font-normal">({h.count} posts)</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Posts */}
                  {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">Posts</h3>
                      <div className="space-y-6">
                        {results.posts.map((post) => (
                          <PostCard key={post._id} post={post} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
