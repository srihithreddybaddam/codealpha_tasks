import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import postService from '../services/postService';
import { validateImageFile } from '../utils/validators';

export default function CreatePostModal({ isOpen, onClose, onPostCreated, onError }) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      if (onError) onError(validation.error);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleResetForm = () => {
    setCaption('');
    setLocation('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      if (onError) onError('Please select an image file to publish your post.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('location', location);
      formData.append('image', imageFile);

      const res = await postService.createPost(formData);
      if (res.success && res.post) {
        if (onPostCreated) onPostCreated(res.post);
        handleResetForm();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish post';
      if (onError) onError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white glass-panel w-full sm:max-w-xl max-h-[90vh] rounded-t-[32px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Handle for mobile */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-outline-variant/40 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high">
          <button
            type="button"
            onClick={() => {
              handleResetForm();
              onClose();
            }}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h2 className="text-base font-semibold text-on-surface">Create New Post</h2>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !imageFile}
            className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-5 py-1.5 rounded-full text-xs font-semibold shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Publishing...</span>
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* User Info Header */}
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-on-surface">{user?.name}</span>
                {user?.isVerified && <span className="material-symbols-outlined text-primary text-sm">verified</span>}
              </div>
              <span className="text-xs text-outline">@{user?.username}</span>
            </div>
          </div>

          {/* Caption Textarea */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={2200}
            placeholder="Write a caption... What's on your mind?"
            className="w-full min-h-[100px] bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none resize-none"
          ></textarea>

          {/* Location Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
              location_on
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-container-high rounded-2xl text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Image Preview / Selection Area */}
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden max-h-64 bg-surface-container-low border border-surface-container-high">
              <img src={imagePreview} alt="Selected Preview" className="w-full h-full object-cover max-h-64" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all shadow-md"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-surface-container-high hover:border-primary/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-surface-container-low/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl">
                <span className="material-symbols-outlined">add_photo_alternate</span>
              </div>
              <span className="text-xs font-semibold text-on-surface">Click to upload post image</span>
              <span className="text-[11px] text-outline">JPG, PNG, WEBP (Max 10MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 border-t border-surface-container-high flex items-center justify-between bg-surface-container-lowest text-xs text-outline">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-base">image</span>
            {imageFile ? imageFile.name : 'No file chosen'}
          </span>

          <span>{caption.length}/2200</span>
        </div>
      </div>
    </div>
  );
}
