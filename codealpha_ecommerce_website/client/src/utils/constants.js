export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Basketly';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'basketly_auth_token',
  USER: 'basketly_user_data',
  THEME: 'basketly_theme_preference',
  CART: 'basketly_cart_items',
  WISHLIST: 'basketly_wishlist_items',
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY_POLICY: '/privacy-policy',
  SHIPPING_POLICY: '/shipping-policy',
  REFUND_POLICY: '/refund-policy',
  TERMS_CONDITIONS: '/terms-conditions',
  ADMIN_DASHBOARD: '/admin',
  NOT_FOUND: '*',
};

export const CATEGORIES = [
  { id: 'fresh-fruits', name: 'Fresh Fruits', icon: 'FiShoppingBag' },
  { id: 'vegetables', name: 'Organic Vegetables', icon: 'FiShoppingBag' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'FiHome' },
  { id: 'bakery', name: 'Fresh Bakery', icon: 'FiHeart' },
  { id: 'beverages', name: 'Cold Drinks & Juices', icon: 'FiActivity' },
];
