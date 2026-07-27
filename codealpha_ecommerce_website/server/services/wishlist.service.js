const Wishlist = require('../models/Wishlist.model');
const { isDBConnected } = require('../config/db.config');

const inMemoryWishlists = {};

class WishlistService {
  async getWishlist(userId) {
    if (isDBConnected()) {
      try {
        let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
        if (!wishlist) {
          wishlist = await Wishlist.create({ user: userId, products: [] });
        }
        return wishlist;
      } catch (err) {}
    }

    if (!inMemoryWishlists[userId]) {
      inMemoryWishlists[userId] = [];
    }
    return { products: inMemoryWishlists[userId] };
  }

  async addToWishlist(userId, product) {
    if (isDBConnected()) {
      try {
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        const exists = wishlist.products.some(
          (p) => p.toString() === product._id
        );
        if (!exists) {
          wishlist.products.push(product._id);
          await wishlist.save();
        }
        return await this.getWishlist(userId);
      } catch (err) {}
    }

    if (!inMemoryWishlists[userId]) {
      inMemoryWishlists[userId] = [];
    }

    const exists = inMemoryWishlists[userId].some((p) => p._id === product._id);
    if (!exists) {
      inMemoryWishlists[userId].push(product);
    }
    return { products: inMemoryWishlists[userId] };
  }

  async removeFromWishlist(userId, productId) {
    if (isDBConnected()) {
      try {
        let wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
          wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
          );
          await wishlist.save();
        }
        return await this.getWishlist(userId);
      } catch (err) {}
    }

    if (inMemoryWishlists[userId]) {
      inMemoryWishlists[userId] = inMemoryWishlists[userId].filter(
        (p) => p._id !== productId
      );
    }
    return { products: inMemoryWishlists[userId] || [] };
  }
}

module.exports = new WishlistService();
