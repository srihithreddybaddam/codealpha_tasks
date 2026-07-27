import api from './api.service';

export const wishlistService = {
  getWishlist: async () => {
    return await api.get('/wishlist');
  },
  addToWishlist: async (product) => {
    return await api.post('/wishlist', { product });
  },
  removeFromWishlist: async (productId) => {
    return await api.delete(`/wishlist/${productId}`);
  },
};
