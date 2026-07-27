import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiRotateCcw,
  FiLayers,
  FiX,
  FiZap,
  FiCheck,
  FiGrid,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import FilterSidebar from '../components/product/FilterSidebar';
import QuickViewModal from '../components/product/QuickViewModal';
import RecentlyViewedSection from '../components/product/RecentlyViewedSection';
import RecommendedProductsSection from '../components/product/RecommendedProductsSection';
import { useProduct } from '../hooks/useProduct';
import { productService } from '../services/product.service';
import { shuffleArray } from '../utils/shuffle';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    priceRange,
    setPriceRange,
    selectedBrand,
    setSelectedBrand,
    selectedRating,
    setSelectedRating,
    inStockOnly,
    setInStockOnly,
    selectedDiscount,
    setSelectedDiscount,
    expressOnly,
    setExpressOnly,
    organicOnly,
    setOrganicOnly,
    resetFilters,
  } = useProduct();

  const [searchResults, setSearchResults] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allStoreProducts, setAllStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Sync URL search params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCat = searchParams.get('category');
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCat) setSelectedCategory(urlCat);
  }, [searchParams]);

  // Fetch Products & Brands
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = {
          search: searchQuery || '',
          category: selectedCategory || 'all',
          brand: selectedBrand || '',
          minPrice: Array.isArray(priceRange) ? priceRange[0] : 0,
          maxPrice: Array.isArray(priceRange) ? priceRange[1] : 50000,
          rating: selectedRating || 0,
          inStock: inStockOnly || false,
          discount: selectedDiscount || 0,
          sort: sortBy || 'newest',
          page: page || 1,
          limit: 100,
        };

        let res = await productService.getAllProducts(query);
        let fetchedList = res.products || [];

        // Apply Express & Organic local filters if toggled
        if (expressOnly) {
          fetchedList = fetchedList.filter((p) => p.stock > 0);
        }
        if (organicOnly) {
          fetchedList = fetchedList.filter(
            (p) =>
              p.category?.toLowerCase().includes('organic') ||
              p.name?.toLowerCase().includes('organic') ||
              p.tags?.some((t) => t.toLowerCase().includes('organic'))
          );
        }

        const finalDisplayList =
          !sortBy || sortBy === 'featured' || sortBy === 'newest'
            ? shuffleArray(fetchedList)
            : fetchedList;

        setSearchResults(finalDisplayList);
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || finalDisplayList.length);

        // Load all store products pool for related/suggested feeds
        const allRes = await productService.getAllProducts({ limit: 100 });
        const allItems = allRes.products || [];
        setAllStoreProducts(allItems);

        // Extract Brands list
        const bSet = new Set(allItems.map((p) => p.brand).filter(Boolean));
        setAllBrands(Array.from(bSet));

        // Fetch Related Products if search is active
        if (searchQuery && searchQuery.trim()) {
          const searchIds = new Set(fetchedList.map((p) => p._id));
          const related = allItems
            .filter((p) => !searchIds.has(p._id))
            .slice(0, 8);
          setRelatedProducts(related);
        } else {
          setRelatedProducts([]);
        }

        // Fetch category list
        try {
          const catRes = await productService.getCategories();
          setCategories(catRes || []);
        } catch (catErr) {
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    priceRange,
    selectedRating,
    inStockOnly,
    selectedDiscount,
    expressOnly,
    organicOnly,
    sortBy,
    page,
  ]);

  // Compute active filters list for interactive chips
  const activeFilters = [];
  if (searchQuery) activeFilters.push({ label: `Search: "${searchQuery}"`, type: 'search' });
  if (selectedCategory && selectedCategory !== 'all')
    activeFilters.push({ label: `Category: ${selectedCategory}`, type: 'category' });
  if (selectedBrand) activeFilters.push({ label: `Brand: ${selectedBrand}`, type: 'brand' });
  if (selectedRating > 0) activeFilters.push({ label: `Rating: ${selectedRating}★ & Up`, type: 'rating' });
  if (selectedDiscount > 0) activeFilters.push({ label: `Discount: ${selectedDiscount}%+`, type: 'discount' });
  if (expressOnly) activeFilters.push({ label: 'Express 10-Min Delivery', type: 'express' });
  if (organicOnly) activeFilters.push({ label: 'Organic Certified', type: 'organic' });
  if (inStockOnly) activeFilters.push({ label: 'In Stock Only', type: 'inStock' });

  const removeFilterChip = (type) => {
    if (type === 'search') {
      setSearchQuery('');
      setSearchParams({});
    }
    if (type === 'category') {
      setSelectedCategory('all');
      setSearchParams({});
    }
    if (type === 'brand') setSelectedBrand('');
    if (type === 'rating') setSelectedRating(0);
    if (type === 'discount') setSelectedDiscount(0);
    if (type === 'express') setExpressOnly && setExpressOnly(false);
    if (type === 'organic') setOrganicOnly && setOrganicOnly(false);
    if (type === 'inStock') setInStockOnly(false);
  };

  return (
    <PageWrapper title="Marketplace Store">
      <Container className="py-6 space-y-8">
        {/* Active Category & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <FiFilter className="w-4 h-4 text-indigo-400" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                {selectedCategory !== 'all' ? selectedCategory : 'All Marketplace Products'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {totalProducts} Items
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setSearchResults(shuffleArray(searchResults))}
              className="text-xs text-indigo-400 font-bold hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Shuffle Store Listing Order"
            >
              <FiRotateCcw className="w-3.5 h-3.5" /> Shuffle Store Order
            </button>

            {activeFilters.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 font-bold hover:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Clear All ({activeFilters.length})
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS BAR */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {activeFilters.map((chip) => (
              <span
                key={chip.type}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => removeFilterChip(chip.type)}
                  className="p-0.5 rounded-full hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer"
                  title="Remove filter"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex items-start gap-8">
          {/* Left Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            brands={allBrands}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Right Product Grid Feed */}
          <div className="flex-1 space-y-12">
            {loading ? (
              <ProductSkeleton count={10} viewMode="grid" />
            ) : (
              <div className="space-y-12">
                {/* SEARCH RESULTS HEADER */}
                <div className="space-y-4">
                  {searchQuery && (
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FiSearch className="text-emerald-400 w-5 h-5" />
                        <h2 className="text-xl font-black text-white">
                          Showing results for: "{searchQuery}"
                        </h2>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {searchResults.length} Products Found
                      </span>
                    </div>
                  )}

                  {searchResults.length === 0 ? (
                    <div className="py-10 text-center space-y-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-sm">
                      <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 inline-block border border-amber-500/30">
                        <FiAlertCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-extrabold text-white">No exact matches found for "{searchQuery || 'selected criteria'}"</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        We couldn't find an exact product matching your query. Explore our popular categories below or view our trending store recommendations.
                      </p>

                      {/* Suggested Category Quick Actions */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-lg mx-auto">
                        {['Fresh Fruits', 'Dairy Products', 'Grocery Essentials', 'Organic Foods', 'Snacks', 'Beverages'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="text-xs px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all font-semibold cursor-pointer border border-slate-700"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={resetFilters}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-black text-xs shadow-md hover:from-indigo-500 hover:to-cyan-400 transition-all inline-flex items-center gap-2 cursor-pointer"
                        >
                          <FiRotateCcw className="w-4 h-4" /> Reset All Filters & View Full Catalog
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {searchResults.map((prod) => (
                        <ProductCard key={prod._id} product={prod} />
                      ))}
                    </div>
                  )}
                </div>

                {/* RELATED PRODUCTS SECTION */}
                {searchQuery && relatedProducts.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <FiLayers className="text-indigo-400 w-5 h-5" />
                      <h2 className="text-xl font-black text-white">Related Products</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {relatedProducts.map((prod) => (
                        <ProductCard key={prod._id} product={prod} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination Controls (Pages Shifting Numbers) ABOVE Customers Also Viewed */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-6 my-4 border-t border-b border-slate-800">
                    <button
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={page === 1}
                      className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                      title="Previous Page"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            page === pageNum
                              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={page === totalPages}
                      className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                      title="Next Page"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* PERSONALIZED RECOMMENDATIONS */}
                <RecommendedProductsSection
                  allProducts={allStoreProducts}
                  title="Customers Also Viewed"
                  type="personalized"
                  limit={4}
                />

                {/* RECENTLY VIEWED SECTION */}
                <RecentlyViewedSection limit={5} title="Your Recently Viewed Products" />
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Global Quick View Modal */}
      <QuickViewModal />
    </PageWrapper>
  );
};

export default Products;
