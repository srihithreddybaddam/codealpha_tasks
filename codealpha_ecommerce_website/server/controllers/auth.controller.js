const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');
const authService = require('../services/auth.service');
const ApiError = require('../utils/apiError.util');

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  const result = await authService.loginUser(email, password);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Login successful'));
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const user = await authService.getUserById(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'User profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const updatedUser = await authService.updateUserProfile(userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        'Password reset link has been dispatched to your email address.'
      )
    );
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
};
