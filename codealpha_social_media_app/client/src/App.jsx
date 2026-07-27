import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomeFeedPage from './pages/HomeFeedPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import HashtagPage from './pages/HashtagPage';
import MomentsPage from './pages/MomentsPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeFeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <ExplorePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hashtags/:name"
                element={
                  <ProtectedRoute>
                    <HashtagPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moments"
                element={
                  <ProtectedRoute>
                    <MomentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <BookmarksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/circle"
                element={
                  <ProtectedRoute>
                    <HomeFeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </SocketProvider>
      </UserProvider>
    </AuthProvider>
  );
}
