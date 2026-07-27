const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');
const reviewService = require('../services/review.service');

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await reviewService.getProductReviews(productId);
  return res.status(200).json(new ApiResponse(200, { reviews }, 'Reviews retrieved'));
});

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id || req.user?._id || 'guest-user';
  const userName = req.user?.name || req.body.userName || 'Verified Customer';
  const { rating, comment } = req.body;

  const review = await reviewService.addReview(
    productId,
    userId,
    userName,
    rating,
    comment
  );
  return res.status(201).json(new ApiResponse(201, { review }, 'Review submitted successfully'));
});

module.exports = {
  getProductReviews,
  addReview,
};
