const Review = require('../models/Review.model');
const Product = require('../models/Product.model');
const ApiError = require('../utils/apiError.util');
const { isDBConnected } = require('../config/db.config');

const inMemoryReviews = [
  {
    _id: "rev-1",
    product: "prod-1",
    user: "usr-demo-1",
    userName: "Sarah Jenkins",
    rating: 5,
    comment: "Absolutely crisp and delicious! Arrived super fresh.",
    createdAt: "2026-01-22T10:00:00.000Z"
  },
  {
    _id: "rev-2",
    product: "prod-1",
    user: "usr-demo-2",
    userName: "Michael Chen",
    rating: 5,
    comment: "High quality organic apples. Will definitely order again weekly.",
    createdAt: "2026-01-23T14:30:00.000Z"
  }
];

class ReviewService {
  async getProductReviews(productId) {
    if (isDBConnected()) {
      try {
        const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
        if (reviews.length > 0) return reviews;
      } catch (err) {}
    }

    return inMemoryReviews.filter((r) => r.product === productId);
  }

  async addReview(productId, userId, userName, rating, comment) {
    if (isDBConnected()) {
      try {
        const existing = await Review.findOne({ product: productId, user: userId });
        if (existing) {
          throw new ApiError(400, 'You have already submitted a review for this product.');
        }

        const review = await Review.create({
          product: productId,
          user: userId,
          userName: userName || 'Verified Customer',
          rating: Number(rating),
          comment,
        });

        return review;
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }

    const existing = inMemoryReviews.find(
      (r) => r.product === productId && r.user === userId
    );

    if (existing) {
      throw new ApiError(400, 'You have already submitted a review for this product.');
    }

    const newReview = {
      _id: `rev-${Date.now()}`,
      product: productId,
      user: userId,
      userName: userName || 'Verified Customer',
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    inMemoryReviews.unshift(newReview);
    return newReview;
  }
}

module.exports = new ReviewService();
