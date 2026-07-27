const Product = require('../models/Product.model');
const { productsData: fallbackProducts } = require('../data/products.data');
const { isDBConnected } = require('../config/db.config');

const fallbackMap = {};
if (Array.isArray(fallbackProducts)) {
  fallbackProducts.forEach((p) => {
    if (p._id && p.images && p.images.length > 0) {
      fallbackMap[p._id] = p.images;
    }
  });
}

const ensureValidPrimaryImage = (product) => {
  if (!product) return null;
  const item = typeof product.toObject === 'function' ? product.toObject() : { ...product };

  if (item._id && fallbackMap[item._id]) {
    item.images = fallbackMap[item._id];
  }

  if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
    return null; // Purge listing if no images array
  }

  // Strict URL filter: must be valid http/https URL
  item.images = item.images.filter(
    (img) => typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://')) && !img.includes('broken') && !img.includes('placeholder')
  );

  if (item.images.length === 0) {
    return null; // Purge listing if no valid image remains
  }

  return item;
};

class ProductService {
  async getAllProducts(queryParams = {}) {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      discount,
      sort = 'newest',
      page = 1,
      limit = 100,
    } = queryParams;

    if (isDBConnected()) {
      try {
        const query = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ];
        }

        if (category && category.toLowerCase() !== 'all') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (brand) {
          query.brand = { $regex: new RegExp(brand, 'i') };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (rating) {
          query.rating = { $gte: Number(rating) };
        }

        if (inStock === 'true' || inStock === true) {
          query.stock = { $gt: 0 };
        }

        if (discount) {
          query.discount = { $gte: Number(discount) };
        }

        let sortOption = { createdAt: -1 };
        switch (sort) {
          case 'oldest':
            sortOption = { createdAt: 1 };
            break;
          case 'price-low':
            sortOption = { price: 1 };
            break;
          case 'price-high':
            sortOption = { price: -1 };
            break;
          case 'rating':
            sortOption = { rating: -1 };
            break;
          case 'popular':
            sortOption = { numReviews: -1 };
            break;
          case 'a-z':
            sortOption = { name: 1 };
            break;
          case 'z-a':
            sortOption = { name: -1 };
            break;
          case 'newest':
          default:
            sortOption = { createdAt: -1 };
            break;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const rawProducts = await Product.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(Number(limit));

        const products = rawProducts.map(ensureValidPrimaryImage).filter(Boolean);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / Number(limit)) || 1;

        if (products.length > 0) {
          return {
            products,
            totalProducts,
            totalPages,
            currentPage: Number(page),
          };
        }
      } catch (err) {
        console.error('DB query error in ProductService:', err);
      }
    }

    // In-Memory Fallback with Score-Based Search Relevance Sorting & Strict Image Validation
    let filtered = (fallbackProducts || []).map(ensureValidPrimaryImage).filter(Boolean);

    if (search) {
      const term = search.toLowerCase();
      const scored = [];

      filtered.forEach((p) => {
        let score = 0;
        const nameLower = (p.name || '').toLowerCase();
        const brandLower = (p.brand || '').toLowerCase();
        const catLower = (p.category || '').toLowerCase();

        if (nameLower === term || nameLower.startsWith(term)) {
          score += 100;
        } else if (nameLower.includes(term)) {
          score += 80;
        }

        if (brandLower === term || brandLower.startsWith(term)) {
          score += 60;
        } else if (brandLower.includes(term)) {
          score += 40;
        }

        if (catLower === term || catLower.startsWith(term)) {
          score += 50;
        } else if (catLower.includes(term)) {
          score += 30;
        }

        if (p.tags && p.tags.some((t) => t.toLowerCase().includes(term))) {
          score += 20;
        }

        if (p.description && p.description.toLowerCase().includes(term)) {
          score += 10;
        }

        if (score > 0) {
          scored.push({ product: p, score });
        }
      });

      scored.sort((a, b) => b.score - a.score);
      filtered = scored.map((s) => s.product);
    }

    if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      filtered = filtered.filter(
        (p) => p.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (rating) {
      filtered = filtered.filter((p) => p.rating >= Number(rating));
    }

    if (inStock === 'true' || inStock === true) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (discount) {
      filtered = filtered.filter((p) => p.discount >= Number(discount));
    }

    if (!search) {
      switch (sort) {
        case 'oldest':
          filtered.sort((a, b) => (a._id > b._id ? 1 : -1));
          break;
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          filtered.sort((a, b) => b.numReviews - a.numReviews);
          break;
        case 'a-z':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'z-a':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
        default:
          filtered.sort((a, b) => (b._id > a._id ? 1 : -1));
          break;
      }
    }

    const totalProducts = filtered.length;
    const totalPages = Math.ceil(totalProducts / Number(limit)) || 1;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(skip, skip + Number(limit));

    return {
      products: paginated,
      totalProducts,
      totalPages,
      currentPage: Number(page),
    };
  }

  async getProductById(id) {
    if (isDBConnected()) {
      try {
        const prod = await Product.findById(id);
        if (prod) return ensureValidPrimaryImage(prod);
      } catch (err) {}
    }

    const found = (fallbackProducts || []).find((p) => p._id === id);
    return found ? ensureValidPrimaryImage(found) : null;
  }

  async getCategories() {
    if (isDBConnected()) {
      try {
        const cats = await Product.distinct('category');
        if (cats.length > 0) {
          return cats.map((name) => ({ name, count: 0 }));
        }
      } catch (err) {}
    }

    const catMap = {};
    const validProds = (fallbackProducts || []).map(ensureValidPrimaryImage).filter(Boolean);
    validProds.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    return Object.keys(catMap).map((name) => ({
      name,
      count: catMap[name],
    }));
  }
}

module.exports = new ProductService();
