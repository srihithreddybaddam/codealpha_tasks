const authService = require('../services/authService');
const { validateSignupInput, validateLoginInput } = require('../utils/validators');

// Helper to format user response JSON
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  coverImage: user.coverImage,
  location: user.location,
  website: user.website,
  statusBubble: user.statusBubble,
  role: user.role,
  isVerified: user.isVerified,
  followers: user.followers || [],
  following: user.following || [],
  bookmarks: user.bookmarks || [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

// @desc    Register / Signup User
// @route   POST /api/auth/signup or /api/auth/register
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const { errors, isValid } = validateSignupInput({ name, username, email, password });
    if (!isValid) {
      return res.status(400).json({ success: false, errors, message: 'Validation failed' });
    }

    const { user, token } = await authService.registerUser({ name, username, email, password });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Alias for register
exports.register = exports.signup;

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const { errors, isValid } = validateLoginInput({ email, password });
    if (!isValid) {
      return res.status(400).json({ success: false, errors, message: 'Validation failed' });
    }

    const { user, token } = await authService.loginUser({ email, password, rememberMe });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user._id);
    return res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found'
    });
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Public / Private
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.location) user.location = req.body.location;
    if (req.body.website) user.website = req.body.website;
    if (req.body.statusBubble) user.statusBubble = req.body.statusBubble;

    await user.save();

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
