const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/featured', productController.getFeaturedProducts);
router.get('/fresh-picks', productController.getFreshPicks);
router.get('/groceries', productController.getPopularGroceries);
router.get('/essentials', productController.getDailyEssentials);
router.get('/bestsellers', productController.getBestSellers);
router.get('/deals', productController.getDeals);
router.get('/trending', productController.getTrending);
router.get('/top-rated', productController.getTopRated);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
