const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');
const productService = require('../services/product.service');
const ApiError = require('../utils/apiError.util');

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Products retrieved successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { product }, 'Product details retrieved'));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  return res
    .status(200)
    .json(new ApiResponse(200, { categories }, 'Categories retrieved'));
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Featured products retrieved'));
});

const getFreshPicks = asyncHandler(async (req, res) => {
  const products = await productService.getFreshPicks();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Fresh picks retrieved'));
});

const getPopularGroceries = asyncHandler(async (req, res) => {
  const products = await productService.getPopularGroceries();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Popular groceries retrieved'));
});

const getDailyEssentials = asyncHandler(async (req, res) => {
  const products = await productService.getDailyEssentials();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Daily essentials retrieved'));
});

const getBestSellers = asyncHandler(async (req, res) => {
  const products = await productService.getBestSellers();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Best sellers retrieved'));
});

const getDeals = asyncHandler(async (req, res) => {
  const products = await productService.getTodayDeals();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, "Today's deals retrieved"));
});

const getTrending = asyncHandler(async (req, res) => {
  const products = await productService.getTrending();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Trending products retrieved'));
});

const getTopRated = asyncHandler(async (req, res) => {
  const products = await productService.getTopRated();
  return res
    .status(200)
    .json(new ApiResponse(200, { products }, 'Top-rated products retrieved'));
});

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  getFreshPicks,
  getPopularGroceries,
  getDailyEssentials,
  getBestSellers,
  getDeals,
  getTrending,
  getTopRated,
};
