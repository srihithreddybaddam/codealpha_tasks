import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import DeleteAccountModal from '../components/DeleteAccountModal';
import useAuth from '../hooks/useAuth';
import settingsService from '../services/settingsService';
import profileService from '../services/profileService';

export default function SettingsPage() {
  const { user, updateUserProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('premium'); // Vibely Premium at top

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: false,
    allowMessages: 'everyone',
    allowComments: 'everyone',
    allowTagging: 'everyone',
    showOnlineStatus: true,
    showLastSeen: true
  });

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    fetchBlockMuteData();
  }, []);

  const fetchBlockMuteData = async () => {
    try {
      const [blockRes, muteRes, sessRes] = await Promise.all([
        settingsService.getBlockedUsers(),
        settingsService.getMutedUsers(),
        settingsService.getSessions()
      ]);

      if (blockRes.success) setBlockedUsers(blockRes.blockedUsers || []);
      if (muteRes.success) setMutedUsers(muteRes.mutedUsers || []);
      if (sessRes.success) setSessions(sessRes.sessions || []);
    } catch (e) {}
  };

  const handleTogglePremium = async () => {
    const isNowPremium = !user?.isPremium;
    updateUserProfileState({ isPremium: isNowPremium, isVerified: isNowPremium });
    setToast({
      message: isNowPremium ? 'Vibely Premium Unlocked! Verified badge added to your profile ✨' : 'Vibely Premium deactivated.',
      type: 'success'
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await profileService.updateProfile(profileForm);
      if (res.success && res.user) {
        updateUserProfileState(res.user);
        setToast({ message: 'Profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await settingsService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setToast({ message: 'Password updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Incorrect password', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrivacyToggle = async (key) => {
    const updated = { ...privacySettings, [key]: !privacySettings[key] };
    setPrivacySettings(updated);
    try {
      await settingsService.updateSettings(updated);
      setToast({ message: 'Privacy setting updated.', type: 'success' });
    } catch (e) {}
  };

  const handleUnblock = async (targetId) => {
    try {
      await settingsService.unblockUser(targetId);
      setBlockedUsers((prev) => prev.filter((b) => b.blockedUser._id !== targetId && b._id !== targetId));
      setToast({ message: 'User unblocked.', type: 'success' });
    } catch (e) {}
  };

  const handleUnmute = async (targetId) => {
    try {
      await settingsService.unmuteUser(targetId);
      setMutedUsers((prev) => prev.filter((m) => m.mutedUser._id !== targetId));
      setToast({ message: 'User unmuted.', type: 'success' });
    } catch (e) {}
  };

  const tabs = [
    { id: 'premium', label: 'Vibely Premium ✨', icon: 'workspace_premium', highlight: true },
    { id: 'profile', label: 'Profile Information', icon: 'person' },
    { id: 'account', label: 'Account Settings', icon: 'manage_accounts' },
    { id: 'privacy', label: 'Privacy Controls', icon: 'lock' },
    { id: 'security', label: 'Security & Sessions', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'blockmute', label: 'Block & Mute List', icon: 'block' },
    { id: 'help', label: 'Help & Support', icon: 'help' },
    { id: 'about', label: 'About Vibely', icon: 'info' }
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-6 pb-24 md:pb-8">
          {/* Header */}
          <div className="border-b border-primary/10 pb-4">
            <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings</span>
              Settings & Account Preferences
            </h1>
            <p className="text-xs text-outline">Manage your profile, security, privacy controls, and unlock Vibely Premium.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Navigation Tabs */}
            <div className="md:col-span-1 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                    activeTab === tab.id
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                        : 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/20'
                      : tab.highlight
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20'
                      : 'glass-card text-on-surface hover:bg-white/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 glass-card rounded-3xl p-6 border border-primary/10">
              {/* TAB 0: VIBELY PREMIUM */}
              {activeTab === 'premium' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-bold flex items-center justify-center text-2xl shadow-lg">
                          ✨
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-on-surface">Vibely Premium</h3>
                          <p className="text-xs text-outline">Exclusive creator perks, verified badge & advanced tools.</p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user?.isPremium ? 'bg-success/10 text-success border border-success/30' : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'}`}>
                        {user?.isPremium ? 'Active Member' : 'Available'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        { title: 'Verified Creator Badge', desc: 'Display blue verified checkmark on profile & feed.' },
                        { title: 'Exclusive Profile Themes', desc: 'Custom accent colors & glowing avatar frames.' },
                        { title: 'Moments Auto Scroll', desc: 'Enable automatic vertical scrolling timer.' },
                        { title: 'Priority Media Uploads', desc: 'Higher quality Cloudinary media processing.' },
                        { title: 'Creator Analytics', desc: 'Detailed impression & engagement statistics.' },
                        { title: 'Early Feature Access', desc: 'Test new experimental features before public launch.' }
                      ].map((perk, i) => (
                        <div key={i} className="p-3 glass-card rounded-2xl border border-primary/10 flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-amber-500 text-base shrink-0">check_circle</span>
                          <div>
                            <p className="text-xs font-bold text-on-surface">{perk.title}</p>
                            <p className="text-[10px] text-outline">{perk.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleTogglePremium}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/25 transition-all"
                    >
                      {user?.isPremium ? 'Manage Vibely Premium Subscription' : 'Unlock Vibely Premium Membership ✨'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: PROFILE INFORMATION */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Profile Information
                  </h3>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface">Username</label>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface">Bio</label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface">Location</label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface">Website</label>
                        <input
                          type="text"
                          value={profileForm.website}
                          onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-2xl text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Profile Settings'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: ACCOUNT SETTINGS */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Account Settings
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface">Primary Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'user@vibely.app'}
                      className="w-full p-3 glass-input rounded-2xl text-xs opacity-75 cursor-not-allowed"
                    />
                  </div>

                  {/* Password Change Form */}
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4 border-t border-primary/10">
                    <h4 className="text-xs font-bold text-on-surface">Change Password</h4>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface-variant">New Password</label>
                        <input
                          type="password"
                          required
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface-variant">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full p-3 glass-input rounded-2xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-2xl text-xs shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      {submitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-primary/10 space-y-3">
                    <h4 className="text-xs font-bold text-error">Danger Zone</h4>
                    <div className="flex items-center justify-between p-4 bg-error/5 border border-error/20 rounded-2xl">
                      <div>
                        <h5 className="text-xs font-bold text-error">Delete Account</h5>
                        <p className="text-[11px] text-outline">Permanently delete your profile and content.</p>
                      </div>
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-error text-white font-semibold rounded-xl text-xs hover:bg-error/90"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRIVACY CONTROLS */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Privacy Controls
                  </h3>

                  <div className="space-y-4 divide-y divide-primary/10">
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Private Account</h4>
                        <p className="text-[11px] text-outline">Only approved followers can view your posts and Sparks.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.isPrivate}
                        onChange={() => handlePrivacyToggle('isPrivate')}
                        className="w-5 h-5 text-primary rounded border-surface-container-high focus:ring-primary cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Show Online Status</h4>
                        <p className="text-[11px] text-outline">Let creators see when you are active on Vibely.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.showOnlineStatus}
                        onChange={() => handlePrivacyToggle('showOnlineStatus')}
                        className="w-5 h-5 text-primary rounded border-surface-container-high focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & SESSIONS */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Security & Active Sessions
                  </h3>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-on-surface">Active Logged-in Devices</h4>
                    {sessions.map((s) => (
                      <div key={s._id} className="p-4 glass-card rounded-2xl border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-xl">laptop_mac</span>
                          <div>
                            <p className="text-xs font-bold text-on-surface">{s.device}</p>
                            <p className="text-[11px] text-outline">{s.location} • {s.ip}</p>
                          </div>
                        </div>
                        {s.isCurrent && (
                          <span className="px-2.5 py-1 bg-success/10 text-success font-bold text-[10px] rounded-full">
                            Current Device
                          </span>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={async () => {
                        await settingsService.deleteSessions();
                        setToast({ message: 'Logged out of all other devices.', type: 'success' });
                      }}
                      className="mt-4 px-5 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-2xl text-xs hover:bg-surface-container"
                    >
                      Logout From All Other Devices
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Notification Preferences
                  </h3>

                  <div className="space-y-4 divide-y divide-primary/10">
                    {[
                      { title: 'New Likes Notifications', desc: 'Alert when someone likes your post or moment.' },
                      { title: 'Comments & Replies', desc: 'Alert when someone comments on your post.' },
                      { title: 'New Follows', desc: 'Alert when someone starts following your profile.' },
                      { title: 'Private Messages', desc: 'Alert when you receive a new chat message.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-3">
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
                          <p className="text-[11px] text-outline">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-primary rounded border-surface-container-high focus:ring-primary cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: BLOCK & MUTE */}
              {activeTab === 'blockmute' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Block & Mute List
                  </h3>

                  {/* Blocked Users */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-on-surface">Blocked Users</h4>
                    {blockedUsers.length === 0 ? (
                      <p className="text-xs text-outline py-2">No blocked users.</p>
                    ) : (
                      blockedUsers.map((b) => (
                        <div key={b._id} className="p-3 glass-card rounded-2xl border border-primary/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={b.blockedUser.avatar} alt={b.blockedUser.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-bold text-on-surface">{b.blockedUser.name}</p>
                              <p className="text-[10px] text-outline">@{b.blockedUser.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnblock(b.blockedUser._id)}
                            className="px-3 py-1.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container"
                          >
                            Unblock
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Muted Users */}
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <h4 className="text-xs font-bold text-on-surface">Muted Users</h4>
                    {mutedUsers.length === 0 ? (
                      <p className="text-xs text-outline py-2">No muted users.</p>
                    ) : (
                      mutedUsers.map((m) => (
                        <div key={m._id} className="p-3 glass-card rounded-2xl border border-primary/10 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-on-surface">{m.mutedUser.name}</p>
                            <p className="text-[10px] text-outline">@{m.mutedUser.username}</p>
                          </div>
                          <button
                            onClick={() => handleUnmute(m.mutedUser._id)}
                            className="px-3 py-1.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container"
                          >
                            Unmute
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: HELP & SUPPORT */}
              {activeTab === 'help' && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold text-on-surface border-b border-primary/10 pb-3">
                    Help Center & Support
                  </h3>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-on-surface">Frequently Asked Questions</h4>
                    {[
                      { q: 'How do 24-hr Daily Sparks work?', a: 'Daily Sparks auto-expire exactly 24 hours after publication.' },
                      { q: 'How do I unlock Vibely Premium?', a: 'Unlock Vibely Premium in Settings to gain verified status, auto-scroll, and exclusive profile perks.' },
                      { q: 'How do I report inappropriate content?', a: 'Click the flag menu item on any post or profile to submit a safety report.' }
                    ].map((item, i) => (
                      <div key={i} className="glass-card rounded-2xl overflow-hidden border border-primary/10">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full p-4 flex items-center justify-between text-xs font-bold text-on-surface text-left"
                        >
                          <span>{item.q}</span>
                          <span className="material-symbols-outlined text-sm">{expandedFaq === i ? 'expand_less' : 'expand_more'}</span>
                        </button>
                        {expandedFaq === i && (
                          <div className="p-4 text-xs text-outline leading-relaxed border-t border-primary/10 bg-white/40">
                            {item.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: ABOUT VIBELY */}
              {activeTab === 'about' && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white font-bold flex items-center justify-center text-xl mx-auto shadow-md">
                    V
                  </div>
                  <h3 className="text-base font-bold text-on-surface">Vibely Social Networking Platform</h3>
                  <p className="text-xs text-primary font-semibold">"Create. Connect. Inspire."</p>
                  <p className="text-xs text-outline max-w-sm mx-auto">
                    Indian-first forward-luxury glassmorphism social platform built with React, Node.js, Express, Socket.io, & MongoDB.
                  </p>
                  <p className="text-[11px] text-outline pt-4">Version 1.9.0 • 2026 Vibely Inc.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
