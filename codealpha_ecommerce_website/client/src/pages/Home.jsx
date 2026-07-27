import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiZap,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import QuickViewModal from '../components/product/QuickViewModal';
import RecentlyViewedSection from '../components/product/RecentlyViewedSection';
import RecommendedProductsSection from '../components/product/RecommendedProductsSection';
import DailyDealsCountdown from '../components/product/DailyDealsCountdown';
import { productService } from '../services/product.service';
import { shuffleArray, getInterleavedProducts } from '../utils/shuffle';

const Home = () => {
  const navigate = useNavigate();

  const [allProductsPool, setAllProductsPool] = useState([]);
  const [mixedProductsFeed, setMixedProductsFeed] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Helper to shuffle & rotate homepage feeds from existing product pool
  const rotateHomeFeeds = (pool) => {
    if (!pool || !pool.length) return;
    const shuffledPool = shuffleArray(pool);

    // 1. Top deals (shuffled discount items or pool items)
    const discountItems = shuffledPool.filter((p) => (p.discount || 0) >= 15);
    const deals = (discountItems.length >= 5 ? discountItems : shuffledPool).slice(0, 5);
    const dealIds = new Set(deals.map((d) => d._id));

    // 2. Interleaved main feed
    const remaining = shuffledPool.filter((p) => !dealIds.has(p._id));
    const interleaved = getInterleavedProducts(remaining, 20);

    setDealProducts(shuffleArray(deals));
    setMixedProductsFeed(interleaved);
  };

  useEffect(() => {
    const fetchHomeFeed = async () => {
      setLoading(true);
      try {
        const res = await productService.getAllProducts({ limit: 100, sort: 'newest' });
        const allList = res.products || [];

        // Deduplicate by ID
        const uniqueProducts = [];
        const seenIds = new Set();
        allList.forEach((item) => {
          if (!seenIds.has(item._id)) {
            seenIds.add(item._id);
            uniqueProducts.push(item);
          }
        });

        setAllProductsPool(uniqueProducts);
        rotateHomeFeeds(uniqueProducts);
      } catch (err) {
        console.error('Failed to fetch homepage products feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeFeed();
  }, []);

  // Automatic 15-Second Dynamic Listing Rotation Timer
  useEffect(() => {
    if (!allProductsPool.length) return;

    const interval = setInterval(() => {
      rotateHomeFeeds(allProductsPool);
    }, 15000);

    return () => clearInterval(interval);
  }, [allProductsPool]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <PageWrapper title="Basketly — Fresh Groceries & Daily Essentials">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full overflow-hidden bg-slate-950 text-white pt-2 sm:pt-4 pb-12 sm:pb-16 transition-all">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&auto=format&fit=crop&q=80"
            alt="Basketly Grocery Marketplace"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-6 text-left pt-6 sm:pt-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide uppercase shadow-sm">
              <FiZap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Welcome to Basketly — Hyperlocal 10-Minute Doorstep Delivery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Fresh Organic Produce & Daily Pantry Essentials
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
              Basketly is India's trusted grocery marketplace delivering fresh produce, daily essentials, and household favorites right to your doorstep.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" icon={FiArrowRight} className="cursor-pointer">
                  Explore Marketplace Store
                </Button>
              </Link>

              <Link to="/products?category=Fresh+Fruits">
                <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer">
                  Shop Fresh Fruits
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-300 font-semibold border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <FiTruck className="text-emerald-400 w-4 h-4 flex-shrink-0" />
                <span>FREE Shipping Over ₹199</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-indigo-400 w-4 h-4 flex-shrink-0" />
                <span>100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <FiRefreshCw className="text-cyan-400 w-4 h-4 flex-shrink-0" />
                <span>Easy 7-Day Doorstep Returns</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SMART INTERLEAVED MARKETPLACE FEED */}
      <SectionWrapper className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Live Inventory • Smart Category Distribution
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>Featured Marketplace Discovery</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                  <FiRefreshCw className="animate-spin text-indigo-400 w-3 h-3" />
                  <span>Auto-Rotating Live Feed</span>
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => rotateHomeFeeds(allProductsPool)}
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 inline-flex items-center gap-1.5 transition-all cursor-pointer"
                title="Shuffle & Rotate Product Showcase"
              >
                <FiRefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Shuffle Feed</span>
              </button>

              <Link
                to="/products"
                className="text-xs font-bold text-indigo-400 hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>View All 500 Products</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <ProductSkeleton count={10} viewMode="grid" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {mixedProductsFeed.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="grid" />
              ))}
            </div>
          )}
        </Container>
      </SectionWrapper>

      {/* 3. HOT DEALS & DISCOUNTS SECTION WITH LIVE COUNTDOWN TIMER */}
      {dealProducts.length > 0 && (
        <SectionWrapper className="py-12 bg-slate-900/60 border-y border-slate-800">
          <Container className="space-y-8">
            <DailyDealsCountdown title="Today's Flash Lightning Deals" expiryHours={8} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {dealProducts.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="grid" />
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}

      {/* 4. PERSONALIZED RECOMMENDATIONS FEED */}
      <SectionWrapper className="py-12">
        <Container>
          <RecommendedProductsSection
            allProducts={allProductsPool}
            title="Recommended For You"
            type="personalized"
            limit={5}
          />
        </Container>
      </SectionWrapper>

      {/* 5. RECENTLY VIEWED PRODUCTS SECTION */}
      <SectionWrapper className="py-12 bg-slate-900/40 border-t border-slate-800">
        <Container>
          <RecentlyViewedSection limit={5} title="Recently Viewed Products" />
        </Container>
      </SectionWrapper>

      {/* 6. WHY CHOOSE AETHERIA */}
      <SectionWrapper className="py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why Millions of Families Choose Aetheria
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              India's most trusted online grocery marketplace for quality, speed, and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">10-Minute Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hyperlocal dark stores positioned within 2 km radius ensure lighting fast doorstep delivery.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Quality Assurance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-point quality checks at farm gates and dark stores guarantee fresh, residue-free produce.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <FiRefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Hassle-Free Returns</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant doorstep quality inspection and 7-day return policy with immediate refund processing.
              </p>
            </Card>

            <Card className="p-6 bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <FiAward className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Direct-From-Source Prices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cutting out middlemen allows us to pass 15–20% savings directly to our customers.
              </p>
            </Card>
          </div>
        </Container>
      </SectionWrapper>

      {/* 7. NEWSLETTER CTA */}
      <SectionWrapper className="py-16 bg-slate-900 border-t border-slate-800">
        <Container className="max-w-4xl">
          <Card glass className="p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-2xl bg-slate-900/90">
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Get ₹100 Off Your First Grocery Order
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Subscribe to Basketly Fresh Alerts for weekly organic produce discounts, seasonal fruit arrivals, and flash sales.
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold inline-flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5" />
                <span>Thank you! Your ₹100 promo code HAS BEEN SENT to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Button type="submit" variant="primary" size="md" className="cursor-pointer">
                  Subscribe & Save
                </Button>
              </form>
            )}
          </Card>
        </Container>
      </SectionWrapper>

      {/* Quick View Modal */}
      <QuickViewModal />
    </PageWrapper>
  );
};

export default Home;
