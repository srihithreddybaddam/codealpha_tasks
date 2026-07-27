import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function PostCard({ post, currentUserId }) {
  const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 12);
  const [isLiked, setIsLiked] = useState(post.likes ? post.likes.includes(currentUserId) : false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {
      _id: 'c1',
      author: { name: 'Marcus Chen', username: 'marcus_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
      text: 'This glassmorphism layout is crisp! Really like the periwinkle accents 🔥',
      createdAt: '2h ago'
    }
  ]);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await api.put(`/posts/${post._id}/like`);
    } catch (e) {}
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      await api.post(`/posts/${post._id}/bookmark`);
    } catch (e) {}
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: 'c_' + Date.now(),
      author: { name: 'You', username: 'you', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
      text: commentText,
      createdAt: 'Just now'
    };

    setComments([...comments, newComment]);
    setCommentText('');
    try {
      api.post(`/posts/${post._id}/comments`, { text: commentText });
    } catch (e) {}
  };

  return (
    <article className="bg-white rounded-[24px] p-5 sm:p-6 border border-surface-container-high shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?.username}`}>
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
              alt={post.author?.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10 hover:ring-primary transition-all"
            />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link to={`/profile/${post.author?.username}`} className="font-semibold text-sm text-on-surface hover:text-primary transition-colors">
                {post.author?.name || 'Vibely Creator'}
              </Link>
              {post.author?.isVerified && (
                <span className="material-symbols-outlined text-primary text-base" title="Verified Creator">
                  verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-outline">
              <span>@{post.author?.username || 'vibely'}</span>
              <span>•</span>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '1h ago'}</span>
            </div>
          </div>
        </div>

        {/* Badges / Privacy */}
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed/40 text-primary text-[11px] font-semibold flex items-center gap-1">
              📌 Pinned
            </span>
          )}
          {post.privacy === 'circle' && (
            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-[11px] font-semibold flex items-center gap-1">
              🔒 Circle
            </span>
          )}
          <button className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-xl">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Post Text Content */}
      <p className="text-sm sm:text-base text-on-surface leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Post Media Attachments */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-2xl overflow-hidden max-h-[420px] bg-surface-container-low border border-surface-container-high">
          {post.media[0].mediaType === 'video' ? (
            <video src={post.media[0].url} controls className="w-full h-full object-cover max-h-[420px]" />
          ) : (
            <img src={post.media[0].url} alt="Post Attachment" className="w-full h-full object-cover max-h-[420px]" />
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-on-surface-variant text-xs">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLiked ? 'text-secondary font-semibold' : 'hover:text-secondary'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${isLiked ? 'filled' : ''}`}>favorite</span>
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
            <span>{post.commentsCount || comments.length}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">share</span>
            <span>{post.sharesCount || 3}</span>
          </button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-full transition-colors ${
            isBookmarked ? 'text-primary' : 'text-outline hover:text-primary hover:bg-surface-container'
          }`}
          title="Save to Bookmarks"
        >
          <span className={`material-symbols-outlined text-xl ${isBookmarked ? 'filled' : ''}`}>bookmark</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-surface-container-high space-y-3 animate-fade-in">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-surface-container-low px-4 py-2 text-xs rounded-full border border-transparent focus:border-primary focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-4 py-2 rounded-full text-xs font-semibold"
            >
              Send
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {comments.map((c) => (
              <div key={c._id} className="p-2.5 bg-surface-container-low rounded-2xl flex gap-2.5">
                <img src={c.author?.avatar} alt={c.author?.name} className="w-7 h-7 rounded-full object-cover" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">{c.author?.name}</span>
                    <span className="text-[10px] text-outline">{c.createdAt}</span>
                  </div>
                  <p className="text-on-surface-variant mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
