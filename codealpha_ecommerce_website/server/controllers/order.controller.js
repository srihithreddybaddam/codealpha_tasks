const orderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?._id || 'user-demo-1';
    const order = await orderService.createOrder(userId, req.body);
    res.status(201).json({
      statusCode: 201,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || 'user-demo-1';
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({
      statusCode: 200,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ statusCode: 404, message: 'Order not found' });
    }
    res.status(200).json({
      statusCode: 200,
      data: order,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      statusCode: 200,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({
      statusCode: 200,
      message: 'Order status updated',
      data: order,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: 'Order cancelled',
      data: order,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
