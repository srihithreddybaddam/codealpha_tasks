import api from './api.service';

export const cartService = {
  getCart: async () => {
    return await api.get('/cart');
  },
  addToCart: async (product, quantity = 1) => {
    return await api.post('/cart', { product, quantity });
  },
  updateQuantity: async (productId, quantity) => {
    return await api.put(`/cart/${productId}`, { quantity });
  },
  removeFromCart: async (productId) => {
    return await api.delete(`/cart/${productId}`);
  },
  clearCart: async () => {
    return await api.delete('/cart');
  },
};
