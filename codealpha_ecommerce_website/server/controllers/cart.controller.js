const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');
const cartService = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const cart = await cartService.getCart(userId);
  return res.status(200).json(new ApiResponse(200, { cart }, 'Cart retrieved'));
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const { product, quantity } = req.body;
  const cart = await cartService.addToCart(userId, product, quantity);
  return res.status(200).json(new ApiResponse(200, { cart }, 'Item added to cart'));
});

const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateQuantity(userId, productId, quantity);
  return res.status(200).json(new ApiResponse(200, { cart }, 'Cart quantity updated'));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const { productId } = req.params;
  const cart = await cartService.removeFromCart(userId, productId);
  return res.status(200).json(new ApiResponse(200, { cart }, 'Item removed from cart'));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const cart = await cartService.clearCart(userId);
  return res.status(200).json(new ApiResponse(200, { cart }, 'Cart cleared'));
});

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
