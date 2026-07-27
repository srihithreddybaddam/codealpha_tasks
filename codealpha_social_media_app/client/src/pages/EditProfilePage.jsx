import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import profileService from '../services/profileService';
import useAuth from '../hooks/useAuth';
import {
  validateUsername,
  validateBio,
  validateImageFile
} from '../utils/validators';

export default function EditProfilePage() {
  const { user, updateUserProfileState } = useAuth();
  const navigate = useNavigate();

  // Form Field States
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [location, setLocation] = useState(user?.location || '');

  // Image Upload & Preview States
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || '');

  // Status & Feedback States
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setWebsite(user.website || '');
      setLocation(user.location || '');
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  // Handle Avatar Image File Selection & Preview
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setToast({ message: validation.error, type: 'error' });
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));

    // Upload to server immediately
    setUploadingAvatar(true);
    try {
      const res = await profileService.uploadProfilePicture(file);
      if (res.success) {
        updateUserProfileState({ avatar: res.imageUrl });
        setToast({ message: 'Profile picture updated successfully!', type: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload profile picture';
      setToast({ message: msg, type: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Cover Image File Selection & Preview
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setToast({ message: validation.error, type: 'error' });
      return;
    }

    setCoverPreview(URL.createObjectURL(file));

    // Upload to server immediately
    setUploadingCover(true);
    try {
      const res = await profileService.uploadCoverImage(file);
      if (res.success) {
        updateUserProfileState({ coverImage: res.imageUrl });
        setToast({ message: 'Cover image updated successfully!', type: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload cover image';
      setToast({ message: msg, type: 'error' });
    } finally {
      setUploadingCover(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!name || !name.trim()) {
      errors.name = 'Full Name cannot be empty';
    }

    if (!validateUsername(username)) {
      errors.username = 'Username must be between 3 and 30 alphanumeric characters';
    }

    if (!validateBio(bio)) {
      errors.bio = 'Bio cannot exceed 200 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setToast({ message: 'Please fix the form errors before saving.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const updatePayload = {
        name,
        username,
        bio,
        website,
        location
      };

      const res = await profileService.updateProfile(updatePayload);
      if (res.success) {
        const updated = res.profile || res.user || updatePayload;
        updateUserProfileState(updated);
        setToast({ message: 'Profile details saved successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile details';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          <div className="glass-card rounded-[32px] p-6 border border-primary/10 space-y-6">
            {/* Title Bar */}
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div>
                <h1 className="text-xl font-bold text-on-surface">Edit Profile</h1>
                <p className="text-xs text-outline">Customize your Vibely identity, bio, and banners.</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold glass-card text-on-surface transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Cover Banner Upload & Preview */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant">Cover Image Banner</label>
              <div className="relative h-44 rounded-2xl overflow-hidden glass-card group">
                <img
                  src={coverPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold gap-2">
                  <span className="material-symbols-outlined">photo_camera</span>
                  <span>{uploadingCover ? 'Uploading Cover...' : 'Change Cover Image'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Profile Picture Upload & Preview */}
            <div className="flex items-center gap-4 py-2 border-b border-primary/10 pb-4">
              <div className="relative">
                <img
                  src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                />
                <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-container shadow-md transition-all" title="Change Avatar">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <div>
                <h4 className="text-sm font-bold text-on-surface">Profile Picture</h4>
                <p className="text-xs text-outline">
                  {uploadingAvatar ? 'Uploading new avatar...' : 'Click the camera icon to select a new profile image.'}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-sm focus:outline-none"
                />
                {fieldErrors.name && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.name}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant">Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-sm focus:outline-none"
                />
                {fieldErrors.username && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.username}</p>}
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-3 glass-input rounded-2xl text-sm focus:outline-none min-h-[90px] resize-none"
                ></textarea>
                {fieldErrors.bio && <p className="text-[11px] text-error font-medium pl-1">{fieldErrors.bio}</p>}
              </div>

              {/* Location & Website Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 glass-input rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-3 glass-input rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-6 border-t border-primary/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold glass-card text-on-surface transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-white font-semibold text-xs rounded-full shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <BottomNav />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
