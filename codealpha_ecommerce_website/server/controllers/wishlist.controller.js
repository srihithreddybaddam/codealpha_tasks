const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');
const wishlistService = require('../services/wishlist.service');

const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const wishlist = await wishlistService.getWishlist(userId);
  return res.status(200).json(new ApiResponse(200, { wishlist }, 'Wishlist retrieved'));
});

const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const { product } = req.body;
  const wishlist = await wishlistService.addToWishlist(userId, product);
  return res.status(200).json(new ApiResponse(200, { wishlist }, 'Item added to wishlist'));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const { productId } = req.params;
  const wishlist = await wishlistService.removeFromWishlist(userId, productId);
  return res.status(200).json(new ApiResponse(200, { wishlist }, 'Item removed from wishlist'));
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
