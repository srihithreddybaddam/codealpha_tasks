import api from './api.service';
import { fallbackProducts } from '../data/products.fallback';

// Helper to filter fallback items locally if API is unreachable
const filterFallbackProducts = (params = {}) => {
  const { search, category, brand, minPrice, maxPrice, rating, inStock, discount } = params;
  let result = [...fallbackProducts];

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    );
  }

  if (category && category !== 'all') {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (brand) {
    result = result.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
  }

  if (minPrice !== undefined) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice !== undefined) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  if (rating) {
    result = result.filter((p) => p.rating >= Number(rating));
  }

  if (inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  if (discount) {
    result = result.filter((p) => (p.discount || 0) >= Number(discount));
  }

  return {
    products: result,
    totalProducts: result.length,
    totalPages: 1,
    currentPage: 1,
  };
};

export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params });
      const data = res.data || res;
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[ProductService Info] API server offline or unreachable. Serving client fallback dataset.');
    }
    return filterFallbackProducts(params);
  },

  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      const prod = res.data?.product || res.data || res;
      if (prod && prod._id) return prod;
    } catch (err) {
      console.warn('[ProductService Info] API server offline. Searching client fallback dataset.');
    }
    const found = fallbackProducts.find((p) => p._id === id);
    return found || fallbackProducts[0];
  },

  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      const cats = res.data?.categories || res.categories || res;
      if (Array.isArray(cats) && cats.length > 0) return cats;
    } catch (err) {}

    const catMap = {};
    fallbackProducts.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    return Object.keys(catMap).map((name) => ({ name, count: catMap[name] }));
  },

  getFeaturedProducts: async () => {
    try {
      const res = await api.get('/products/featured');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.slice(0, 5);
  },

  getFreshPicks: async () => {
    try {
      const res = await api.get('/products/fresh-picks');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.filter((p) => p.category === 'Fresh Fruits' || p.category === 'Vegetables');
  },

  getPopularGroceries: async () => {
    try {
      const res = await api.get('/products/groceries');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.filter((p) => p.category === 'Grocery Essentials');
  },

  getDailyEssentials: async () => {
    try {
      const res = await api.get('/products/essentials');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.slice(0, 6);
  },

  getBestSellers: async () => {
    try {
      const res = await api.get('/products/bestsellers');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.filter((p) => p.rating >= 4.7);
  },

  getTodayDeals: async () => {
    try {
      const res = await api.get('/products/deals');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.filter((p) => (p.discount || 0) > 0);
  },

  getTrending: async () => {
    try {
      const res = await api.get('/products/trending');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.slice(2, 7);
  },

  getTopRated: async () => {
    try {
      const res = await api.get('/products/top-rated');
      const prods = res.data?.products || res.products || res;
      if (Array.isArray(prods) && prods.length > 0) return prods;
    } catch (err) {}
    return fallbackProducts.filter((p) => p.rating >= 4.8);
  },
};
