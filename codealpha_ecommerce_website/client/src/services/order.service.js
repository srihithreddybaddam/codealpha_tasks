import api from './api.service';

const LOCAL_ORDERS_KEY = 'basketly_local_user_orders';

export const getLocalOrders = () => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveLocalOrder = (order) => {
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter((o) => (o._id || o.id) !== (order._id || order.id))];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {}
};

export const deduplicateOrders = (ordersList) => {
  if (!Array.isArray(ordersList)) return [];
  const map = new Map();
  ordersList.forEach((order) => {
    if (!order) return;
    const key = order._id || order.id || order.orderNumber;
    if (key && !map.has(key)) {
      map.set(key, order);
    }
  });
  return Array.from(map.values());
};

export const orderService = {
  createOrder: async (orderData) => {
    let createdOrder = null;
    try {
      const res = await api.post('/orders', orderData);
      createdOrder = res.data || res;
    } catch (err) {
      console.warn('Backend order creation fallback:', err);
    }

    if (!createdOrder || !createdOrder._id) {
      createdOrder = {
        _id: `ord-${Date.now().toString().slice(-6)}`,
        ...orderData,
        createdAt: orderData.createdAt || new Date().toISOString(),
        status: orderData.status || 'Order Placed',
        isPaid: true,
      };
    }

    saveLocalOrder(createdOrder);
    return createdOrder;
  },

  getMyOrders: async () => {
    let backendOrders = [];
    try {
      const res = await api.get('/orders');
      backendOrders = res.data || res.orders || (Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Backend order fetch fallback:', err);
    }

    const localOrders = getLocalOrders();
    const combined = [...localOrders, ...backendOrders];
    return deduplicateOrders(combined);
  },

  getOrderById: async (id) => {
    const localOrders = getLocalOrders();
    const foundLocal = localOrders.find((o) => (o._id || o.id) === id);
    if (foundLocal) return foundLocal;

    try {
      const res = await api.get(`/orders/${id}`);
      return res.data || res;
    } catch (err) {
      return null;
    }
  },
};
