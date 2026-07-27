import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import { validateImageFile } from '../utils/validators';

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated, onError }) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setCaption(post.caption || '');
      setLocation(post.location || '');
      setImagePreview(post.imageUrl || '');
      setImageFile(null);
    }
  }, [post]);

  if (!isOpen || !post) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('location', location);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await postService.updatePost(post._id, formData);
      if (res.success && res.post) {
        if (onPostUpdated) onPostUpdated(res.post);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post';
      if (onError) onError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white glass-panel w-full sm:max-w-xl max-h-[90vh] rounded-t-[32px] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high">
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <h2 className="text-base font-semibold text-on-surface">Edit Post</h2>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white px-5 py-1.5 rounded-full text-xs font-semibold shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Edit your caption..."
              className="w-full min-h-[100px] p-3 bg-surface-container-low border border-surface-container-high rounded-2xl text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
            ></textarea>
          </div>

          {/* Location Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Location</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Tokyo, Japan"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-surface-container-high rounded-2xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Image Preview & Replace */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant">Post Image</label>
            <div className="relative rounded-2xl overflow-hidden max-h-60 bg-surface-container-low border border-surface-container-high group">
              <img src={imagePreview} alt="Post preview" className="w-full h-full object-cover max-h-60" />
              <label className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold gap-2">
                <span className="material-symbols-outlined">photo_camera</span>
                <span>Replace Image</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
