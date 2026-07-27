const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.get('/:productId', reviewController.getProductReviews);
router.post('/:productId', reviewController.addReview);

module.exports = router;
