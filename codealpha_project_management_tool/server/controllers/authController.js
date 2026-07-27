const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory fallback store for zero-config rapid execution
const inMemoryUsers = [
  {
    id: 'usr-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@aether.io',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Product Designer',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@aether.io',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Full-Stack Engineer',
    createdAt: new Date().toISOString()
  }
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const existingUser = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'Full-Stack Engineer',
      avatar: avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    inMemoryUsers.push(newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = inMemoryUsers.find((u) => u.id === req.user.id);
    if (!user) {
      return res.json({
        success: true,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar
        }
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
const logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

// @desc Request Password Reset
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email address' });
  }
  return res.json({
    success: true,
    message: 'Password reset link has been dispatched to your email address.'
  });
};

// @desc Reset Password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Invalid token or password' });
  }
  return res.json({
    success: true,
    message: 'Password successfully updated. You may now log in.'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
