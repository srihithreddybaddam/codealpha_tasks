const asyncHandler = require('../utils/asyncHandler.util');
const ApiResponse = require('../utils/apiResponse.util');

const getCategories = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { categories: [] }, 'Category query placeholder ready')
  );
});

module.exports = {
  getCategories,
};
