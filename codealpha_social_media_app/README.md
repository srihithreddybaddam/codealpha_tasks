# Vibely – Social Networking Web Application

> **Tagline:** *Create. Connect. Inspire.*

Vibely is an Indian-first, modern, high-performance full-stack social networking web application built with **React**, **Node.js**, **Express**, **Socket.io**, **MongoDB**, **JWT Authentication**, **Multer**, **Cloudinary**, and **Tailwind CSS**, faithfully preserving the forward-luxury glassmorphism UI designed with Stitch AI.

---

## 🌟 Sprint Summary & Progress

### 🟢 Sprint 1 – Project Foundation & Authentication
- Full JWT authentication (`signup`, `login`, `logout`, `me`).
- Password security with `bcryptjs`.
- Mongoose User schema & validation.
- `<ProtectedRoute />` route guard and session persistence.

### 🟢 Sprint 2 – User Profile System & Media Upload
- Dynamic Profile Page (`/profile`) and Edit Profile Form (`/edit-profile`).
- Multer + Cloudinary image upload pipeline for profile picture and cover banner (with local fallback).
- Toast alert notifications (`Toast.jsx`) and skeleton loading UI.

### 🟢 Sprint 3 – Home Feed & Post System
- **Post Mongoose Schema**: User reference, caption (max 2200 chars), image URL, location, visibility, status, and timestamps.
- **Home Feed (`/home`)**: Reverse-chronological timeline rendering post cards with owner action menus (`Edit Post`, `Delete Post`).
- **Create Post Workflow (`CreatePostModal.jsx`)**: Image upload with file preview, caption, location, and instant feed state updates.

### 🟢 Sprint 4 – Social Interactions (Likes, Comments, Follow & Bookmarks)
- **Like System**: Optimistic like/unlike toggle on post cards (`POST /api/posts/:id/like` & `DELETE /api/posts/:id/like`).
- **Comments & Nested Replies Engine**: `Comment` schema (`post`, `user`, `content`, `parentComment`, `replies`).
- **Follow System & Profile Counts**: Follow / Unfollow user graph, dynamic Followers/Following counters, and Follower list modals.
- **Bookmarks & Saved Posts Page**: Dedicated Saved Posts page (`/bookmarks`).

### 🟢 Sprint 5 – Explore, Search & Discovery
- **Global Live Search Bar**: Debounced multi-entity search across Users, Posts, Captions, Hashtags, and Locations with live suggestions overlay (`LiveSearchDropdown.jsx`).
- **Explore Page (`/explore`)**: Trending posts, popular creators, trending topics, and newest community content.
- **Hashtag System (`/hashtags/:name`)**: Automatic hashtag parsing from post captions and dedicated hashtag feed pages.

### 🟢 Sprint 6 – Vibely Exclusive Features
- **Daily Sparks (24h Stories)**: 24-hour temporary sharing feature with story viewer and progress bar (`/daily-sparks`).
- **Moments (`/moments`)**: Creative vertical media player with view count, location, caption, and storytelling focus.
- **Private Circle (`/circle`)**: Restricted audience sharing allowing users to define a private friend circle for posts.
- **Memory Wall (`/memory`)**: Responsive showcase grid displaying pinned favorite posts & moments on user profiles.
- **Status Bubble (`/status`)**: Customizable status message (max 80 characters) displayed beside user profile avatar.

### 🟢 Sprint 7 – Real-Time Communication & Notifications
- **Socket.io Private Messaging (`/messages`)**: One-to-one real-time private chat, text & image attachments, seen status, and message deletion.
- **Live Typing Indicators & Online Presence**: Live "...is typing" indicators and active online/offline status dots.
- **Notification Center (`/notifications`)**: Dedicated Notification Center displaying real-time alerts for New Follow, Like, Comment, Reply, Circle Invite, and Message Received.

### 🟢 Sprint 8 – Settings, Privacy & User Safety
- **Sidebar Cleanup**: Removed "Edit Profile" from the left sidebar navigation for a clean, minimal menu. "Edit Profile" remains accessible via the Profile page (`/profile`) and Settings (`/settings`).
- **Multi-Section Settings (`/settings`)**: Profile Information, Account Settings, Privacy Controls, Security & Sessions, Notification Preferences, Block & Mute List, Help & Support, and About Vibely.
- **Block & Mute System (`/api/block`, `/api/mute`)**: User safety tools to block or mute accounts with unblock/unmute options.
- **Content Reporting Engine (`ReportModal.jsx`, `/api/report`)**: User, post, or comment reporting with category selection.

### 🟢 Sprint 9 – Realistic Content, UI Enhancement & Data Quality
- **Soft Color Gradients & Glassmorphism Elevation**: Upgraded background aesthetics with ambient gradients, glassmorphism cards (`glass-card`), subtle border highlights, and elevated hover scale transitions.
- **Realistic Data Generation Engine (`seedGenerator.js`)**: Generated ~1000 original fictional user accounts across 20+ professions with globally diverse names, bios, status bubbles, and badges.
- **Eradication of Placeholder Text**: Zero `John Doe`, `Jane Doe`, `Lorem Ipsum`, or repeated text across the entire application.

### 🟢 Sprint 10 – Indian Social Experience, Glassmorphism & Final Product Polish
- **Indian-First Creator Engine (80% Indian / 20% International)**: ~1000 original fictional creator accounts centered across 25+ Indian tech hubs & cities (Hyderabad, Bengaluru, Mumbai, Delhi, Pune, Chennai, Kolkata, Jaipur, Noida, Gurugram, etc.).
- **Authentic Indian Posts & Culture**: Celebrates Bengaluru tech, chai breaks, monsoon rains, hackathons, ISRO launches, heritage monuments, street food walks, and cricket.
- **Natural Indian English Conversations**: Comments and chat threads with authentic phrasing ("Beautiful click! 👏", "Chai and code combination is unmatched ☕", "Congratulations bhai!").
- **Frosted Glassmorphism Polish (`backdrop-filter: blur(24px)`)**: Premium frosted glass surfaces, subtle glowing borders (`border-white/20`), backdrop blur cards, and smooth micro-hover animations.

### 🟢 Sprint 11 – Premium UX, Feature Completion & Final Experience
- **Home Feed Right Sidebar Overhaul (`HomeRightSidebar.jsx`)**: Populated the right side of `/home` with rich glassmorphism cards (Trending Topics, Suggested Creators, Today's Tech News, Upcoming Indian Festivals, Daily Inspiration Quote, Daily Challenge, Vibely Tips).
- **Sidebar Cleanup**: Completely removed Status Bubble ("Designing Vibely 2026 ✨") from left sidebar (`Sidebar.jsx`). Added scale (`hover:scale-102`) hover animations.
- **Explore Masonry Grid (`ExplorePage.jsx`)**: Redesigned layout into a responsive multi-column masonry grid with side-by-side images and zero empty gaps.
- **Upgraded Vertical Moments Player & Auto-Scroll (`MomentsPage.jsx`, `MomentsPlayer.jsx`)**: 100+ vertical moments updates, 3-dot options menu (Save, Copy Link, Download, Report), and **Auto-Scroll timer controls** (Off, Slow - 8s, Normal - 5s, Fast - 3s).
- **Vibely Premium & Verified Badge Rules (`SettingsPage.jsx`)**: Mounted **Vibely Premium** section at the top of Settings. Verified Creator badge (`isVerified: true`) restricted to Vibely Premium subscribers.
- **Profile Edit Bug Fix (`EditProfilePage.jsx`, `profileController.js`)**: Fixed profile update submission pipeline for name, username, bio, location, website, avatar, and cover image.
- **Professional Footer Component (`Footer.jsx`)**: Replaced generic UI credits with site links (About, Privacy, Terms, Help Center, Contact, Careers, Blog, Version 1.9.0, © Vibely 2026).

### 🟢 Sprint 12 – Final Bug Fixes, Home Feed Polish & Content Expansion
- **Critical JWT Auth & Profile Update Fix (`api.js` & `authMiddleware.js`)**: Ensured `Authorization: Bearer <token>` is seamlessly attached and verified for profile updates, avatar uploads, and cover image updates without token expiration errors.
- **Clean Home Feed Timeline (`HomeFeedPage.jsx`)**: Removed the inline "What's on your mind?" Create Post card from the home feed timeline. Timeline posts now start immediately below Daily Sparks.
- **Explore Hashtag Hover Contrast Fix (`ExplorePage.jsx`)**: Fixed hashtag pills hover CSS to guarantee high contrast (`text-primary hover:bg-primary/20 border-primary/20`).
- **10 Unique Daily Sparks & Expanded Notifications**: Served 10 unique Daily Sparks with unique creators, thumbnails, captions, upload times, and view counts.
- **Balanced Explore Masonry Distribution**: Distributed Explore posts naturally across 10 distinct categories (Nature, Technology, Travel, Food, Sports, Photography, Programming, Education, Architecture, Fashion).

### 🟢 Sprint 13 – UX Refinements & Interaction Improvements
- **Centered Glassmorphic Daily Sparks Viewer (`DailySparksBar.jsx`)**: Redesigned Daily Sparks story viewer into a centered frosted glassmorphism popup modal (`bg-black/80 backdrop-blur-xl`) over the Home Feed without page navigation.
- **Body Scroll Locking**: Applied `document.body.style.overflow = 'hidden'` while viewer modal is open, restoring exact Home Feed scroll position on close.
- **Story Progress Timer & Arrow Navigation**: Timer auto-advances through Sparks; mouse hover / touch hold pauses progress; keyboard `ArrowLeft`/`ArrowRight` switches stories.
- **Chat Bubble Alignment Fix (`ChatWindow.jsx`)**: Ensured outgoing messages sent by the logged-in user are strictly right-aligned (`justify-end`, `items-end`, `bg-gradient-to-r from-primary to-purple-600 text-white rounded-br-none`) with delivery receipts, while incoming messages are left-aligned with sender avatars.

### 🟢 Sprint 14 – Profile Consistency & Global Follow System
- **Centralized User Registry (`UserContext.jsx`)**: Established a single source of truth provider caching user profiles by `_id` & `username`. Updates to names, bios, avatars, and verified badges automatically propagate everywhere instantly.
- **Global Optimistic Follow Engine**: Pressing "Follow" or "Following" instantly updates button state, follower/following counts, `FollowersModal`, `FollowingModal`, and triggers live notification alerts.
- **Interactive Followers & Following Modals (`FollowersModal.jsx`, `FollowingModal.jsx`)**: Built interactive modals for viewing and managing creator relationships with live search filter.
- **Synchronized Profile Page Counters (`ProfilePage.jsx`)**: Posts, Followers, and Following counters are fully synchronized and clickable to open post grid views or user relationship modals.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Context API, Socket.io Client, Tailwind CSS, Material Symbols |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB, Mongoose ORM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Media Upload** | Multer, Cloudinary SDK (with local disk fallback) |

---

## ⚡ Quick Start Guide

1. **Install Dependencies**:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. **Start Development Stack**:
   ```bash
   npm run dev
   ```
   - **Client App**: `http://localhost:3000`
   - **Backend API & Socket Server**: `http://localhost:5000`

---

## ✅ Definition of Done (Sprint 14)

- [x] Every user identity has ONE single source of truth (`UserContext.jsx`).
- [x] Profile picture, cover image, name, username, bio, and premium status stay synchronized everywhere.
- [x] Follow/Unfollow updates button states and counters instantly without page refreshes.
- [x] Followers and Following counters open interactive modals (`FollowersModal`, `FollowingModal`).
- [x] Posts count is synchronized and opens user posts grid.
- [x] Production-grade state management & zero data inconsistency.
