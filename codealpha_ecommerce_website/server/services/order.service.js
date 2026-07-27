const Order = require('../models/Order.model');
const { isDBConnected } = require('../config/db.config');

// In-Memory Order Storage Fallback
let inMemoryOrders = [
  {
    _id: 'ord-1001',
    user: 'user-demo-1',
    userName: 'Srihith Reddy',
    userEmail: 'john@example.com',
    items: [
      {
        _id: 'prod-1',
        name: 'Alphonso Mangoes Premium',
        category: 'Fresh Fruits',
        price: 299,
        quantity: 2,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
      },
      {
        _id: 'prod-31',
        name: 'Amul Taaza Toned Milk 1L Tetra',
        category: 'Dairy Products',
        price: 72,
        quantity: 3,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Srihith Reddy',
      phone: '9876543210',
      houseNo: 'Flat 402, Green View Apts',
      street: 'Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    paymentMethod: 'UPI (Google Pay)',
    subtotal: 754,
    discountAmount: 59.8,
    shipping: 0,
    handlingFee: 5,
    tax: 34.71,
    grandTotal: 733.91,
    isPaid: true,
    status: 'Out For Delivery',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'ord-1002',
    user: 'user-demo-1',
    userName: 'john',
    userEmail: 'john@example.com',
    items: [
      {
        _id: 'prod-21',
        name: 'Aashirvaad Shuddh Chakki Atta 5kg',
        category: 'Grocery Essentials',
        price: 275,
        quantity: 1,
        discount: 5,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Srihith Reddy',
      phone: '9876543210',
      houseNo: 'Flat 402, Green View Apts',
      street: 'Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    paymentMethod: 'Cash on Delivery',
    subtotal: 261.25,
    discountAmount: 13.75,
    shipping: 0,
    handlingFee: 5,
    tax: 12.38,
    grandTotal: 264.88,
    isPaid: true,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

class OrderService {
  async createOrder(userId, orderData) {
    if (isDBConnected()) {
      try {
        const order = await Order.create({
          user: userId,
          ...orderData,
        });
        return order;
      } catch (err) {
        console.error('DB Order Creation error:', err);
      }
    }

    const newOrder = {
      _id: `ord-${Date.now().toString().slice(-6)}`,
      user: userId || 'user-demo-1',
      userName: orderData.shippingAddress?.fullName || 'Customer',
      userEmail: orderData.userEmail || 'customer@example.com',
      items: orderData.items || [],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'UPI',
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      shipping: orderData.shipping || 0,
      handlingFee: orderData.handlingFee || 5,
      tax: orderData.tax || 0,
      grandTotal: orderData.grandTotal || 0,
      isPaid: true,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    };

    inMemoryOrders.unshift(newOrder);
    return newOrder;
  }

  async getUserOrders(userId) {
    if (isDBConnected()) {
      try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        if (orders && orders.length > 0) return orders;
      } catch (err) { }
    }

    return inMemoryOrders.filter(
      (o) => !userId || o.user === userId || o.user === 'user-demo-1'
    );
  }

  async getOrderById(orderId) {
    if (isDBConnected()) {
      try {
        const order = await Order.findById(orderId);
        if (order) return order;
      } catch (err) { }
    }

    return inMemoryOrders.find((o) => o._id === orderId) || inMemoryOrders[0];
  }

  async getAllOrders() {
    if (isDBConnected()) {
      try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        if (orders && orders.length > 0) return orders;
      } catch (err) { }
    }

    return inMemoryOrders;
  }

  async updateOrderStatus(orderId, status) {
    if (isDBConnected()) {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        );
        if (order) return order;
      } catch (err) { }
    }

    const idx = inMemoryOrders.findIndex((o) => o._id === orderId);
    if (idx !== -1) {
      inMemoryOrders[idx].status = status;
      return inMemoryOrders[idx];
    }
    return null;
  }

  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'Cancelled');
  }
}

module.exports = new OrderService();
