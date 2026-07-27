import React, { useState, useEffect } from 'react';
import interactionService from '../services/interactionService';
import useAuth from '../hooks/useAuth';

export default function CommentSection({ postId, onCommentCountChange }) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContentText, setEditContentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await interactionService.getPostComments(postId);
      if (res.success && res.comments) {
        setComments(res.comments);
      }
    } catch (err) {
      console.warn('[Vibely Comments] Could not fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await interactionService.addComment(postId, newCommentText);
      if (res.success && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setNewCommentText('');
        if (onCommentCountChange) onCommentCountChange(res.commentsCount);
      }
    } catch (err) {
      console.error('[Comment Error]', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    const text = replyTextMap[parentCommentId];
    if (!text || !text.trim()) return;

    try {
      const res = await interactionService.replyToComment(parentCommentId, text);
      if (res.success && res.reply) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === parentCommentId) {
              return {
                ...c,
                replies: [...(c.replies || []), res.reply]
              };
            }
            return c;
          })
        );
        setReplyTextMap((prev) => ({ ...prev, [parentCommentId]: '' }));
        setActiveReplyId(null);
        if (onCommentCountChange) onCommentCountChange((prev) => prev + 1);
      }
    } catch (err) {
      console.error('[Reply Error]', err);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContentText.trim()) return;

    try {
      const res = await interactionService.editComment(commentId, editContentText);
      if (res.success && res.comment) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === commentId) return { ...c, content: res.comment.content };
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) => (r._id === commentId ? { ...r, content: res.comment.content } : r))
              };
            }
            return c;
          })
        );
        setEditingCommentId(null);
        setEditContentText('');
      }
    } catch (err) {
      console.error('[Edit Comment Error]', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await interactionService.deleteComment(commentId);
      if (res.success) {
        setComments((prev) =>
          prev
            .filter((c) => c._id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? c.replies.filter((r) => r._id !== commentId) : []
            }))
        );
        if (onCommentCountChange) onCommentCountChange((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('[Delete Comment Error]', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pt-4 border-t border-surface-container-high space-y-4 animate-fade-in">
      {/* Top Comment Input Form */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
          alt={currentUser?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          maxLength={1000}
          className="flex-1 bg-surface-container-low px-4 py-2 text-xs rounded-full border border-surface-container-high focus:border-primary focus:bg-white focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={submitting || !newCommentText.trim()}
          className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          {submitting ? 'Sending...' : 'Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4 text-xs text-outline">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-3 text-xs text-outline">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const isCommentOwner = currentUser && comment.user && (currentUser._id === comment.user._id || currentUser.username === comment.user.username);

            return (
              <div key={comment._id} className="p-3 bg-surface-container-low/70 rounded-2xl space-y-2">
                {/* Single Comment Header & Body */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1">
                    <img
                      src={comment.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={comment.user?.name}
                      className="w-7 h-7 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{comment.user?.name}</span>
                        <span className="text-[10px] text-outline">@{comment.user?.username}</span>
                        <span className="text-[10px] text-outline">• {formatTimeAgo(comment.createdAt)}</span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            type="text"
                            value={editContentText}
                            onChange={(e) => setEditContentText(e.target.value)}
                            className="flex-1 px-3 py-1 bg-white border border-primary rounded-xl text-xs"
                          />
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            className="px-3 py-1 bg-primary text-white text-[11px] font-semibold rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-2 py-1 text-outline text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-on-surface-variant mt-1 leading-relaxed">{comment.content}</p>
                      )}
                    </div>
                  </div>

                  {/* Comment Owner Controls */}
                  {isCommentOwner && (
                    <div className="flex items-center gap-1 text-outline">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditContentText(comment.content);
                        }}
                        className="hover:text-primary p-1 rounded"
                        title="Edit comment"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="hover:text-error p-1 rounded"
                        title="Delete comment"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Reply Trigger & Counter */}
                <div className="flex items-center gap-4 pl-9 text-[11px] text-outline font-medium">
                  <button
                    onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">reply</span>
                    <span>Reply</span>
                  </button>
                  {comment.replies && comment.replies.length > 0 && (
                    <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                  )}
                </div>

                {/* Reply Input Box */}
                {activeReplyId === comment._id && (
                  <div className="pl-9 pt-1 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Reply to @${comment.user?.username}...`}
                      value={replyTextMap[comment._id] || ''}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [comment._id]: e.target.value })}
                      className="flex-1 bg-white px-3 py-1.5 text-xs rounded-xl border border-surface-container-high focus:border-primary focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddReply(comment._id)}
                      disabled={!replyTextMap[comment._id]?.trim()}
                      className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Reply
                    </button>
                  </div>
                )}

                {/* Nested Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-8 pt-2 space-y-2 border-l-2 border-surface-container-high ml-4">
                    {comment.replies.map((reply) => {
                      const isReplyOwner = currentUser && reply.user && (currentUser._id === reply.user._id || currentUser.username === reply.user.username);

                      return (
                        <div key={reply._id} className="p-2 bg-white/70 rounded-xl flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <img
                              src={reply.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                              alt={reply.user?.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-on-surface">{reply.user?.name}</span>
                                <span className="text-[10px] text-outline">• {formatTimeAgo(reply.createdAt)}</span>
                              </div>
                              <p className="text-on-surface-variant mt-0.5">{reply.content}</p>
                            </div>
                          </div>

                          {isReplyOwner && (
                            <button
                              onClick={() => handleDeleteComment(reply._id)}
                              className="text-outline hover:text-error p-1"
                              title="Delete reply"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
