const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        category: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      houseNo: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      instructions: String,
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
    },
    subtotal: Number,
    discountAmount: Number,
    shipping: Number,
    handlingFee: Number,
    tax: Number,
    grandTotal: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Confirmed',
        'Packed',
        'Out For Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Refunded',
      ],
      default: 'Order Placed',
    },
    deliveryEstimatedDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
