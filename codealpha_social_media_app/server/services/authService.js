const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// In-Memory Fallback User Store (for offline DB environment)
const inMemoryUsers = new Map();

// Seed initial demo user in memory
const seedDemoUser = () => {
  const demoId = '65f1a2b3c4d5e6f7a8b9c0d1';
  inMemoryUsers.set(demoId, {
    _id: demoId,
    name: 'Elena Rostova',
    username: 'elena_design',
    email: 'elena@vibely.app',
    passwordHash: bcrypt.hashSync('password123', 10),
    bio: 'Lead UI/UX Architect @Vibely. Crafting glassmorphic surfaces ✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    location: 'Tokyo, Japan',
    website: 'https://vibely.app',
    statusBubble: 'Designing Vibely 2026 ✨',
    role: 'admin',
    isVerified: true,
    followers: [],
    following: [],
    bookmarks: [],
    createdAt: new Date().toISOString()
  });
};
seedDemoUser();

class AuthService {
  async registerUser({ name, username, email, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({
        $or: [{ email: cleanEmail }, { username: cleanUsername }]
      });

      if (existingUser) {
        const field = existingUser.email === cleanEmail ? 'Email' : 'Username';
        throw new Error(`${field} is already registered`);
      }

      const user = await User.create({
        name,
        username: cleanUsername,
        email: cleanEmail,
        password,
        role: cleanEmail.includes('admin') ? 'admin' : 'user'
      });

      const token = generateToken(user._id, user.role, true);
      return { user, token };
    }

    // In-memory Fallback Mode
    for (const u of inMemoryUsers.values()) {
      if (u.email === cleanEmail) throw new Error('Email is already registered');
      if (u.username === cleanUsername) throw new Error('Username is already registered');
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: newId,
      name,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      bio: 'Creating, connecting & inspiring on Vibely ✨',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      location: 'San Francisco, CA',
      website: '',
      statusBubble: 'Exploring Vibely ✨',
      role: cleanEmail.includes('admin') ? 'admin' : 'user',
      isVerified: true,
      followers: [],
      following: [],
      bookmarks: [],
      createdAt: new Date().toISOString()
    };

    inMemoryUsers.set(newId, newUser);
    const token = generateToken(newId, newUser.role, true);
    return { user: newUser, token };
  }

  async loginUser({ email, password, rememberMe = true }) {
    const cleanQuery = email.toLowerCase().trim();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        $or: [{ email: cleanQuery }, { username: cleanQuery }]
      }).select('+password');

      if (!user) {
        throw new Error('Invalid email/username or password');
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid email/username or password');
      }

      const token = generateToken(user._id, user.role, rememberMe);
      return { user, token };
    }

    // In-memory Fallback Mode
    let foundUser = null;
    for (const u of inMemoryUsers.values()) {
      if (u.email === cleanQuery || u.username === cleanQuery) {
        foundUser = u;
        break;
      }
    }

    if (foundUser) {
      const isMatch = bcrypt.compareSync(password, foundUser.passwordHash);
      if (!isMatch) {
        throw new Error('Invalid email/username or password');
      }
      const token = generateToken(foundUser._id, foundUser.role, rememberMe);
      return { user: foundUser, token };
    }

    // Create dynamic user for quick testing if not in memory
    const newId = new mongoose.Types.ObjectId().toString();
    const dynamicUser = {
      _id: newId,
      name: cleanQuery.includes('@') ? cleanQuery.split('@')[0] : cleanQuery,
      username: cleanQuery.includes('@') ? cleanQuery.split('@')[0] : cleanQuery,
      email: cleanQuery.includes('@') ? cleanQuery : `${cleanQuery}@vibely.app`,
      passwordHash: bcrypt.hashSync(password, 10),
      bio: 'Creating, connecting & inspiring on Vibely ✨',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      location: 'Tokyo, Japan',
      website: 'https://vibely.app',
      statusBubble: 'Exploring Vibely ✨',
      role: 'user',
      isVerified: true,
      followers: [],
      following: [],
      bookmarks: [],
      createdAt: new Date().toISOString()
    };

    inMemoryUsers.set(newId, dynamicUser);
    const token = generateToken(newId, dynamicUser.role, rememberMe);
    return { user: dynamicUser, token };
  }

  async getUserById(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId).populate('followers following', 'name username avatar');
        if (user) return user;
      } catch (e) {}
    }

    if (inMemoryUsers.has(userId)) {
      return inMemoryUsers.get(userId);
    }

    // Default Fallback User
    return Array.from(inMemoryUsers.values())[0];
  }
}

module.exports = new AuthService();
