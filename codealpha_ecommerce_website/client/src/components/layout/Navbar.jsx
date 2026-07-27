import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiMapPin,
  FiChevronDown,
  FiZap,
  FiMenu,
  FiX,
  FiAward,
  FiColumns,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
} from 'react-icons/fi';
import Container from '../common/Container';
import AddressModal from '../common/AddressModal';
import BasketlyLogo from '../common/BasketlyLogo';
import LiveSearchSuggestions from './LiveSearchSuggestions';
import VoiceSearchButton from './VoiceSearchButton';
import NotificationCenterDropdown from './NotificationCenterDropdown';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useCompare } from '../../contexts/CompareContext';
import { useRewardPoints } from '../../contexts/RewardPointsContext';
import { useAuth } from '../../hooks/useAuth';
import { useProduct } from '../../hooks/useProduct';
import { getStorage } from '../../utils/storage';
import { productService } from '../../services/product.service';

const getSelectedAddress = () => getStorage('basketly_selected_address', null);
const getSavedMembership = () => getStorage('basketly_membership', { plan: 'free' });

const searchPlaceholderSuggestions = [
  'Search "Alphonso Mangoes"...',
  'Search "Basmati Rice"...',
  'Search "Cold Pressed Oil"...',
  'Search "A2 Gir Cow Ghee"...',
  'Search "Organic Honey"...',
  'Search "Dry Fruits & Nuts"...',
];

const navbarCategories = [
  { name: 'Fresh Fruits', label: '🍎 Fruits' },
  { name: 'Vegetables', label: '🥦 Vegetables' },
  { name: 'Grocery Essentials', label: '🌾 Grocery' },
  { name: 'Organic Foods', label: '🌿 Organic' },
  { name: 'Bakery Items', label: '🍞 Bakery' },
  { name: 'Dairy Products', label: '🥛 Dairy' },
  { name: 'Beverages', label: '🧃 Drinks' },
  { name: 'Snacks', label: '🍿 Snacks' },
  { name: 'Personal Care', label: '🧼 Personal Care' },
  { name: 'Household Items', label: '🧹 Household' },
  { name: 'Meat & Seafood', label: '🥩 Meat & Fish' },
  { name: 'Baby Care', label: '🍼 Baby Care' },
  { name: 'Pet Supplies', label: '🐶 Pet Care' },
  { name: 'Frozen Foods', label: '🧊 Frozen' },
];

const MobileMenuDrawer = ({ isOpen, onClose, navLinks }) => {
  if (!isOpen) return null;
  return (
    <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={onClose}
          className="block text-sm font-bold text-slate-200 hover:text-indigo-400 py-1"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(getSelectedAddress());
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Dynamic Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [matchingCategories, setMatchingCategories] = useState([]);
  const [matchingBrands, setMatchingBrands] = useState([]);

  const searchContainerRef = useRef(null);
  const categoryScrollRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { compareItems, setIsCompareModalOpen } = useCompare();
  const { balance, setIsRewardModalOpen } = useRewardPoints();
  const { isAuthenticated, user } = useAuth();
  const { selectedCategory, setSelectedCategory } = useProduct();

  // Dynamic Rotating Placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholderSuggestions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Debounced Live Search Suggestions Engine
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 1) {
        const res = await productService.getAllProducts({ search: searchQuery, limit: 12 });
        const items = res.products || [];
        setSuggestions(items);

        const cats = new Set();
        const bnds = new Set();
        items.forEach((item) => {
          if (item.category?.toLowerCase().includes(searchQuery.toLowerCase())) {
            cats.add(item.category);
          }
          if (item.brand?.toLowerCase().includes(searchQuery.toLowerCase())) {
            bnds.add(item.brand);
          }
        });
        setMatchingCategories(Array.from(cats));
        setMatchingBrands(Array.from(bnds));
      } else {
        setSuggestions([]);
        setMatchingCategories([]);
        setMatchingBrands([]);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close live search popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSpeechRecognized = (transcript) => {
    setSearchQuery(transcript);
    setIsSearchFocused(true);
    navigate(`/products?search=${encodeURIComponent(transcript.trim())}`);
  };

  const handleSelectSuggestion = (path) => {
    setIsSearchFocused(false);
    navigate(path);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  const scrollCategoryBar = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-colors duration-300 shadow-sm">
        <Container>
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Logo + Header Address Selector */}
            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
              <BasketlyLogo size="md" />

              {/* LOCATION SELECTOR */}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-indigo-500/60 text-left transition-all group cursor-pointer"
                title="Select Delivery Address"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col max-w-[130px] lg:max-w-[160px]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-0.5">
                    {selectedAddress ? 'Delivering to' : 'Select Location'}
                  </span>
                  <span className="text-xs font-bold text-white truncate leading-tight flex items-center gap-1">
                    {selectedAddress
                      ? `${selectedAddress.street.split(',')[0]}, ${selectedAddress.pincode}`
                      : 'Add Address'}
                    <FiChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  </span>
                </div>
              </button>
            </div>

            {/* LIVE SMART SEARCH & VOICE SEARCH CONTAINER (MAXIMUM HORIZONTAL STRETCH) */}
            <div ref={searchContainerRef} className="hidden sm:flex items-center relative flex-1 w-full max-w-none mx-2 sm:mx-6">
              <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder={searchPlaceholderSuggestions[placeholderIndex]}
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 rounded-full pl-9 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-700 transition-all shadow-inner"
                />
                <FiSearch className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <div className="absolute right-3 flex items-center">
                  <VoiceSearchButton onSpeechRecognized={handleSpeechRecognized} />
                </div>
              </form>

              {/* Smart Search Suggestions Overlay */}
              {isSearchFocused && (
                <LiveSearchSuggestions
                  query={searchQuery}
                  suggestions={suggestions}
                  categories={matchingCategories}
                  brands={matchingBrands}
                  onSelectSuggestion={handleSelectSuggestion}
                  onClose={() => setIsSearchFocused(false)}
                />
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* REWARD POINTS BADGE BUTTON */}
              <button
                onClick={() => setIsRewardModalOpen(true)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm"
                title="View Reward Points Balance"
              >
                <FiAward className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{balance} PTS</span>
              </button>

              {/* COMPACT NOTIFICATION CENTER DROPDOWN */}
              <NotificationCenterDropdown />

              {/* Product Compare Tool */}
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="relative p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Compare Products"
                title="Product Comparison Tool"
              >
                <FiColumns className="w-5 h-5" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {compareItems.length}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors"
                aria-label="Shopping Cart"
              >
                <FiShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-slate-800 hover:ring-2 ring-indigo-500 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {getSavedMembership().plan !== 'free' && (
                    <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-indigo-500/40 text-indigo-400 hover:bg-indigo-950/40 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </Container>

        {/* MODERN E-COMMERCE CATEGORY SUB-BAR (NATURAL LINKS + ALL CATEGORIES ACTION BUTTON) */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 py-2 relative">
          <Container className="flex items-center gap-4 overflow-hidden relative">
            {/* CLEAN UNBOXED TEXT NAVIGATION LINKS */}
            <div className="hidden md:flex items-center space-x-5 flex-shrink-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs font-semibold transition-colors duration-200 relative py-1 ${
                      isActive
                        ? 'text-indigo-400 font-bold'
                        : 'text-slate-300 hover:text-indigo-400'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ALL CATEGORIES ACTION BUTTON */}
            <button
              onClick={() => handleCategoryClick('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md ring-2 ring-indigo-400/50'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <FiGrid className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>

            {/* HORIZONTALLY SCROLLABLE CATEGORY CHIPS CONTAINER */}
            <div className="relative flex-1 flex items-center overflow-hidden">
              {/* Left Chevron Button */}
              <button
                onClick={() => scrollCategoryBar('left')}
                className="absolute left-0 z-10 p-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-indigo-600 hover:text-white shadow-md transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-80 hover:opacity-100"
                aria-label="Scroll Categories Left"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {/* Category Chips */}
              <div
                ref={categoryScrollRef}
                className="flex items-center space-x-2.5 overflow-x-auto scrollbar-none scroll-smooth w-full px-7"
              >
                {navbarCategories.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex-shrink-0 transform active:scale-95 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50 scale-105 font-bold'
                          : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Chevron Button */}
              <button
                onClick={() => scrollCategoryBar('right')}
                className="absolute right-0 z-10 p-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-indigo-600 hover:text-white shadow-md transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-80 hover:opacity-100"
                aria-label="Scroll Categories Right"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Container>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileMenuDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
        />
      </header>

      {/* Delivery Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={handleAddressSelect}
      />
    </>
  );
};

export default Navbar;
