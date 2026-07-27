import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';
import interactionService from '../services/interactionService';

export default function PostCard({ post, onEditPost, onDeletePost }) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  // Initial States derived from Post model
  const initialLikes = post.likes ? post.likes : [];
  const initialIsLiked = currentUserId ? initialLikes.some((id) => (id._id || id).toString() === currentUserId.toString()) : false;

  const [likesCount, setLikesCount] = useState(initialLikes.length || post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(
    currentUser?.bookmarks ? currentUser.bookmarks.some((id) => (id._id || id).toString() === post._id.toString()) : false
  );
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [liking, setLiking] = useState(false);

  const isOwner = currentUser && post.user && (currentUser._id === post.user._id || currentUser.username === post.user.username);

  // Like / Unlike Handler with Optimistic UI Update
  const handleToggleLike = async () => {
    if (!currentUser || liking) return;

    setLiking(true);
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (prevLiked) {
        await interactionService.unlikePost(post._id);
      } else {
        await interactionService.likePost(post._id);
      }
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setLiking(false);
    }
  };

  // Bookmark Handler with Optimistic UI Update
  const handleToggleBookmark = async () => {
    if (!currentUser) return;

    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      if (prevBookmarked) {
        await interactionService.unbookmarkPost(post._id);
      } else {
        await interactionService.bookmarkPost(post._id);
      }
    } catch (err) {
      setIsBookmarked(prevBookmarked);
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <article className="glass-card rounded-[24px] p-5 sm:p-6 border border-primary/10 space-y-4 relative">
      {/* Header: Profile, Name, Handle, Timestamp, Location, and Options Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user?.username}`}>
            <img
              src={post.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
              alt={post.user?.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all bg-surface-container-low"
            />
          </Link>

          <div>
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${post.user?.username}`}
                className="font-semibold text-sm text-on-surface hover:text-primary transition-colors"
              >
                {post.user?.name || 'Vibely Creator'}
              </Link>
              {post.user?.isVerified && (
                <span className="material-symbols-outlined text-primary text-base" title="Verified Creator">
                  verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-outline">
              <span>@{post.user?.username || 'vibely'}</span>
              <span>•</span>
              <span>{formatTimestamp(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-primary/80 font-medium">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Options Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="text-outline hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors"
            title="Post Options"
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-9 w-36 bg-white rounded-2xl border border-surface-container-high shadow-xl py-1.5 z-20"
              onMouseLeave={() => setShowMenu(false)}
            >
              {isOwner ? (
                <>
                  {onEditPost && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEditPost(post);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      <span>Edit Post</span>
                    </button>
                  )}
                  {onDeletePost && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDeletePost(post);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/40 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span>Delete Post</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowReportModal(true);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">flag</span>
                  <span>Report Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Caption Text */}
      {post.caption && (
        <p className="text-sm sm:text-base text-on-surface leading-relaxed whitespace-pre-line">
          {post.caption}
        </p>
      )}

      {/* Post Image */}
      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden max-h-[440px] bg-surface-container-low border border-surface-container-high shadow-xs">
          <img
            src={post.imageUrl}
            alt="Post content"
            loading="lazy"
            className="w-full h-full object-cover max-h-[440px] hover:scale-101 transition-transform duration-300"
          />
        </div>
      )}

      {/* Action Footer: Like, Comment, Bookmark */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-xs">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLiked ? 'text-secondary font-semibold' : 'text-outline hover:text-secondary'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${isLiked ? 'filled text-secondary' : ''}`}>
              favorite
            </span>
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              showComments ? 'text-primary font-semibold' : 'text-outline hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
            <span>{commentsCount}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`p-1.5 rounded-full transition-colors ${
            isBookmarked ? 'text-primary' : 'text-outline hover:text-primary'
          }`}
          title={isBookmarked ? 'Remove from Saved Bookmarks' : 'Save to Bookmarks'}
        >
          <span className={`material-symbols-outlined text-xl ${isBookmarked ? 'filled text-primary' : ''}`}>
            bookmark
          </span>
        </button>
      </div>

      {/* Expanded Comment Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentCountChange={(newCount) => setCommentsCount(newCount)}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="post"
        targetId={post._id}
        targetName={post.caption?.slice(0, 30)}
      />
    </article>
  );
}
