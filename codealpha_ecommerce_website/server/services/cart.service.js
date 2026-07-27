const Cart = require('../models/Cart.model');
const { isDBConnected } = require('../config/db.config');

const inMemoryCarts = {};

class CartService {
  async getCart(userId) {
    if (isDBConnected()) {
      try {
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
          cart = await Cart.create({ user: userId, items: [] });
        }
        return cart;
      } catch (err) {}
    }

    if (!inMemoryCarts[userId]) {
      inMemoryCarts[userId] = [];
    }
    return { items: inMemoryCarts[userId] };
  }

  async addToCart(userId, product, quantity = 1) {
    if (isDBConnected()) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
          cart = await Cart.create({ user: userId, items: [] });
        }

        const existingIdx = cart.items.findIndex(
          (item) => item.product.toString() === product._id
        );

        if (existingIdx > -1) {
          cart.items[existingIdx].quantity += quantity;
        } else {
          cart.items.push({ product: product._id, quantity });
        }

        await cart.save();
        return await this.getCart(userId);
      } catch (err) {}
    }

    if (!inMemoryCarts[userId]) {
      inMemoryCarts[userId] = [];
    }

    const itemIdx = inMemoryCarts[userId].findIndex(
      (item) => item.product._id === product._id
    );

    if (itemIdx > -1) {
      inMemoryCarts[userId][itemIdx].quantity += quantity;
    } else {
      inMemoryCarts[userId].push({ product, quantity });
    }

    return { items: inMemoryCarts[userId] };
  }

  async updateQuantity(userId, productId, quantity) {
    if (isDBConnected()) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          const item = cart.items.find(
            (i) => i.product.toString() === productId
          );
          if (item) {
            item.quantity = quantity;
            await cart.save();
          }
        }
        return await this.getCart(userId);
      } catch (err) {}
    }

    if (inMemoryCarts[userId]) {
      const item = inMemoryCarts[userId].find((i) => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    return { items: inMemoryCarts[userId] || [] };
  }

  async removeFromCart(userId, productId) {
    if (isDBConnected()) {
      try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          cart.items = cart.items.filter(
            (i) => i.product.toString() !== productId
          );
          await cart.save();
        }
        return await this.getCart(userId);
      } catch (err) {}
    }

    if (inMemoryCarts[userId]) {
      inMemoryCarts[userId] = inMemoryCarts[userId].filter(
        (i) => i.product._id !== productId
      );
    }
    return { items: inMemoryCarts[userId] || [] };
  }

  async clearCart(userId) {
    if (isDBConnected()) {
      try {
        await Cart.findOneAndUpdate({ user: userId }, { items: [] });
      } catch (err) {}
    }
    inMemoryCarts[userId] = [];
    return { items: [] };
  }
}

module.exports = new CartService();
