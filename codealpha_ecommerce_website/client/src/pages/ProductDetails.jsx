import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiArrowLeft,
  FiShare2,
  FiMessageSquare,
  FiAlertCircle,
  FiCheck,
  FiThumbsUp,
  FiImage,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import FrequentlyBoughtTogether from '../components/product/FrequentlyBoughtTogether';
import RecentlyViewedSection from '../components/product/RecentlyViewedSection';
import RecommendedProductsSection from '../components/product/RecommendedProductsSection';
import ShareModal from '../components/common/ShareModal';
import { productService } from '../services/product.service';
import { reviewService } from '../services/review.service';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useToast } from '../contexts/ToastContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [allProductsPool, setAllProductsPool] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Share Modal state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('');
  const [reviewStatus, setReviewStatus] = useState({ loading: false, success: '', error: '' });
  const [helpfulVotes, setHelpfulVotes] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodData = await productService.getProductById(id);
        setProduct(prodData);

        if (prodData && prodData._id) {
          addRecentlyViewed(prodData);
        }

        const allRes = await productService.getAllProducts({ limit: 100 });
        const allList = allRes.products || [];
        setAllProductsPool(allList);

        if (prodData?.category) {
          setRelatedProducts(
            allList.filter((p) => p.category === prodData.category && p._id !== prodData._id)
          );
        }

        const revData = await reviewService.getProductReviews(id);
        setReviews(revData || []);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <PageWrapper title="Loading Product...">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper title="Product Not Found">
        <Container className="py-16 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-800 text-slate-400 inline-block">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
          <p className="text-xs text-slate-400">The product you are looking for does not exist or has been removed.</p>
          <Link to="/products">
            <Button variant="primary">Return to Store</Button>
          </Link>
        </Container>
      </PageWrapper>
    );
  }

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`${product.name} added to shopping bag!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    addToast('Marked review as helpful!', 'info');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setReviewStatus({ loading: true, success: '', error: '' });
    try {
      const res = await reviewService.addReview(product._id, {
        rating: reviewRating,
        comment: reviewComment,
        userName: user?.name || 'Verified Customer',
        photoUrl: reviewPhotoUrl,
        isVerifiedPurchase: true,
      });

      const newRev = res.data?.review || res.review || {
        _id: `rev-${Date.now()}`,
        userName: user?.name || 'Verified Customer',
        rating: reviewRating,
        comment: reviewComment,
        photoUrl: reviewPhotoUrl,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };

      setReviews([newRev, ...reviews]);
      setReviewComment('');
      setReviewPhotoUrl('');
      setReviewStatus({
        loading: false,
        success: 'Thank you! Your verified review & photo have been published.',
        error: '',
      });
      setTimeout(() => setReviewStatus({ loading: false, success: '', error: '' }), 4000);
    } catch (err) {
      setReviewStatus({
        loading: false,
        success: '',
        error: err.message || 'Failed to submit review.',
      });
    }
  };

  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80'];

  return (
    <PageWrapper title={product.name}>
      <Container className="py-6 space-y-12">
        <div className="flex items-center justify-between mb-4">
          <Breadcrumb
            items={[
              { label: 'Store', path: '/products' },
              { label: product.category, path: `/products?category=${encodeURIComponent(product.category)}` },
              { label: product.name },
            ]}
          />
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline">
            <FiArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* MAIN PRODUCT SPECS & IMAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg">
                  {product.discount}% OFF
                </span>
              )}
              <button
                onClick={() => setIsShareOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:bg-indigo-600 hover:text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                title="Share Product"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? 'border-indigo-500 scale-105 shadow-md'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span className="uppercase tracking-widest">{product.category} • {product.brand}</span>
                <span className="text-slate-400 font-mono">SKU: {product.sku || 'AETH-001'}</span>
              </div>

              <h1 className="text-3xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-amber-400 font-bold text-sm">
                  <FiStar className="fill-current w-4 h-4 mr-1" />
                  <span>{product.rating || 4.8}</span>
                </div>
                <span className="text-slate-700">•</span>
                <span className="text-xs text-slate-400 font-medium">
                  {reviews.length || product.numReviews || 12} Verified Reviews
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-xs font-bold text-emerald-400">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                ₹{discountedPrice}
              </span>
              {product.discount > 0 && (
                <span className="text-base text-slate-500 line-through font-semibold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-xs font-black text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2.5 font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 cursor-pointer"
                  icon={FiShoppingBag}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none cursor-pointer"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Wishlist"
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <FiTruck className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300">Fresh Express 10-Min Dispatch</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <FiShield className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300">100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE WIDGET */}
        <FrequentlyBoughtTogether
          currentProduct={product}
          complementaryProducts={relatedProducts}
        />

        {/* CUSTOMER REVIEWS & VERIFIED PURCHASER PHOTO REVIEWS */}
        <div className="pt-8 border-t border-slate-800 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <FiMessageSquare className="text-indigo-400" />
              <span>Customer Reviews & Ratings ({reviews.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Review Submission Form */}
            <div className="lg:col-span-5">
              <Card className="p-6 space-y-4 bg-slate-900 border border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <FiShield className="text-emerald-400" /> Write Verified Purchaser Review
                </h3>

                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewStatus.error && (
                      <div className="p-3 rounded-xl bg-rose-950/40 text-rose-400 text-xs font-semibold border border-rose-800">
                        {reviewStatus.error}
                      </div>
                    )}
                    {reviewStatus.success && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-400 text-xs font-semibold border border-emerald-800">
                        {reviewStatus.success}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Rating</label>
                      <div className="flex items-center gap-1 text-amber-400 text-lg cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Your Feedback</label>
                      <textarea
                        rows="3"
                        placeholder="Share your experience with this item..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <FiImage className="text-indigo-400" /> Upload Product Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={reviewPhotoUrl}
                        onChange={(e) => setReviewPhotoUrl(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-full cursor-pointer" disabled={reviewStatus.loading}>
                      {reviewStatus.loading ? 'Publishing...' : 'Publish Verified Review'}
                    </Button>
                  </form>
                ) : (
                  <div className="p-6 text-center space-y-3 bg-slate-800/50 rounded-2xl">
                    <p className="text-xs text-slate-400">Please sign in to share your verified review.</p>
                    <Link to="/login">
                      <Button variant="outline" size="sm">Sign In to Review</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Reviews List with Photo Attachments */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-800/30 rounded-2xl space-y-2 border border-slate-800">
                  <p className="text-xs text-slate-400">No reviews submitted yet for this product. Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <Card key={rev._id} className="p-5 space-y-3 bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                          {rev.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.userName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px] border border-emerald-500/30 flex items-center gap-1">
                              <FiCheckCircle className="w-3 h-3" /> Verified Purchaser
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <FiStar key={i} className="fill-current w-3.5 h-3.5" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.photoUrl && (
                      <div className="pt-2">
                        <img
                          src={rev.photoUrl}
                          alt="Customer product proof"
                          className="w-24 h-24 rounded-xl object-cover border border-slate-700 bg-slate-800"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleHelpfulClick(rev._id)}
                        className="text-[11px] font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
                      >
                        <FiThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({helpfulVotes[rev._id] || 3})</span>
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* PERSONALIZED RECOMMENDATIONS */}
        <RecommendedProductsSection
          allProducts={allProductsPool}
          currentCategory={product.category}
          title={`Popular in ${product.category}`}
          type="category"
          limit={5}
        />

        {/* RECENTLY VIEWED SECTION */}
        <RecentlyViewedSection limit={5} title="Recently Viewed Products" />
      </Container>

      {/* Share Product Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={product}
      />
    </PageWrapper>
  );
};

export default ProductDetails;
