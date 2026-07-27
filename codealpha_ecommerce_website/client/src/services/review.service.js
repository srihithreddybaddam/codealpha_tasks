import api from './api.service';

export const reviewService = {
  getProductReviews: async (productId) => {
    const res = await api.get(`/reviews/${productId}`);
    return res.data?.reviews || res.reviews || res;
  },
  addReview: async (productId, reviewData) => {
    return await api.post(`/reviews/${productId}`, reviewData);
  },
};
