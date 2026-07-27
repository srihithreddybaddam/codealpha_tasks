import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
  FiStar,
  FiZap,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/product.service';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await productService.getAllProducts({ limit: 30, sort: 'newest' });
        const allList = res.products || [];
        const wishIds = new Set(wishlist.map((item) => item._id));

        // DEDUPLICATE: Exclude items already in Wishlist
        const filteredSuggested = allList.filter((p) => !wishIds.has(p._id)).slice(0, 5);
        setSuggestedProducts(filteredSuggested);
      } catch (err) {}
    };
    fetchSuggested();
  }, [wishlist]);

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((p) => addToCart(p, 1));
    clearWishlist();
  };

  return (
    <PageWrapper title="My Saved Wishlist">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'My Saved Wishlist' }]} />

        <SectionWrapper className="pt-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FiHeart className="text-emerald-500 fill-current" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </h1>

            {wishlist.length > 0 && (
              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm" icon={FiShoppingBag} onClick={handleMoveAllToCart}>
                  Move All to Bag
                </Button>
                <button
                  onClick={clearWishlist}
                  className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
                >
                  <FiTrash2 className="w-4 h-4" /> Clear All
                </button>
              </div>
            )}
          </div>

          {wishlist.length === 0 ? (
            /* ENHANCED EMPTY WISHLIST STATE WITH GRAPHICS */
            <div className="py-16 text-center space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500/20 via-indigo-500/20 to-emerald-500/20 flex items-center justify-center mx-auto text-rose-400 border border-rose-500/30">
                <FiHeart className="w-12 h-12 fill-current" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Your Wishlist is Empty</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Save your favorite items here to purchase later or track price drops on organic produce, dry fruits, and household goods.
                </p>
              </div>
              <Link to="/products">
                <Button variant="primary" size="lg" icon={FiArrowRight} className="mt-2">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                const discountedPrice = product.discount
                  ? (product.price * (1 - product.discount / 100)).toFixed(2)
                  : product.price.toFixed(2);

                const mainImg =
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80';

                return (
                  <Card
                    key={product._id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 mb-3">
                        <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white backdrop-blur-md transition-all shadow-sm"
                          title="Remove from Wishlist"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          {product.category}
                        </span>
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-sm font-bold text-white hover:text-indigo-400 line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold my-1">
                          <FiStar className="fill-current w-3.5 h-3.5" />
                          <span>{product.rating || 4.8}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-3 mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">
                          ₹{discountedPrice}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-slate-500 line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        icon={FiShoppingBag}
                        onClick={() => handleMoveToCart(product)}
                      >
                        Move to Bag
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* SUGGESTED PRODUCTS SECTION (DEDUPLICATED) */}
          {suggestedProducts.length > 0 && (
            <div className="mt-16 space-y-6 pt-12 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <FiZap className="text-amber-400 w-5 h-5" />
                <h2 className="text-2xl font-black text-white">
                  Trending Fresh Suggestions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {suggestedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default Wishlist;
