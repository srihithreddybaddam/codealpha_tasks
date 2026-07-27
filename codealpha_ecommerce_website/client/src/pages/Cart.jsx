import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
  FiArrowLeft,
  FiTag,
  FiShield,
  FiTruck,
  FiZap,
  FiClock,
  FiGift,
  FiCheckCircle,
  FiHeart,
  FiFeather,
  FiBookmark,
  FiAward,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import CouponModal from '../components/common/CouponModal';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useRewardPoints } from '../contexts/RewardPointsContext';
import { productService } from '../services/product.service';
import { useToast } from '../contexts/ToastContext';

const Cart = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    savedForLater,
    moveToSavedForLater,
    moveToCartFromSaved,
    removeFromSavedForLater,
    subtotal,
    discountAmount,
    shipping,
    handlingFee,
    includeCarryBag,
    toggleCarryBag,
    carryBagFee,
    deliveryTip,
    setDeliveryTip,
    grandTotal,
    totalSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { addToWishlist } = useWishlist();
  const { balance, redeemPoints } = useRewardPoints();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ message: '', error: false });
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [redeemedPointsInput, setRedeemedPointsInput] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await productService.getAllProducts({ limit: 12 });
        const allItems = res.products || [];
        const cartIds = new Set(cart.map((item) => item._id));
        const filtered = allItems.filter((item) => !cartIds.has(item._id)).slice(0, 4);
        setRecommendedProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };

    fetchRecommendations();
  }, [cart]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    setCouponFeedback({ message: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleRedeemRewardPoints = () => {
    const pointsToUse = Math.min(balance, Math.floor(grandTotal));
    if (pointsToUse <= 0) {
      addToast('No reward points available to redeem.', 'warning');
      return;
    }

    const success = redeemPoints(pointsToUse);
    if (success) {
      setRedeemedPointsInput(pointsToUse);
      addToast(`Successfully redeemed ${pointsToUse} Reward Points (Saved ₹${pointsToUse})!`, 'success');
    }
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist(item);
    removeFromCart(item._id);
    addToast(`${item.name} moved to your Wishlist!`, 'success');
  };

  // Final grand total minus redeemed reward points
  const finalPayableTotal = Math.max(0, grandTotal - redeemedPointsInput);

  return (
    <PageWrapper title="Your Shopping Cart">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Shopping Cart' }]} />

        <SectionWrapper className="pt-2 pb-16 space-y-12">
          {cart.length === 0 && savedForLater.length === 0 ? (
            /* EMPTY CART & EMPTY SAVED FOR LATER STATE */
            <div className="py-20 text-center space-y-6 max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <FiShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Your Cart & Saved List is Empty</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Explore over 500+ farm-fresh fruits, organic vegetables, and daily pantry staples.
                </p>
              </div>
              <Link to="/products">
                <Button variant="primary" size="lg" icon={FiArrowRight} className="w-full cursor-pointer">
                  Explore Fresh Produce & Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            /* MAIN CART TWO-COLUMN LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SECTION: CART ITEMS + ECO BAG + DELIVERY TIP + SAVED FOR LATER */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Header controls */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-white">Shopping Cart</h1>
                    {cart.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                        {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
                      </span>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                  )}
                </div>

                {/* Items Feed */}
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const itemUnitPrice = item.discount
                        ? (item.price * (1 - item.discount / 100)).toFixed(2)
                        : item.price.toFixed(2);
                      const itemTotalPrice = (itemUnitPrice * item.quantity).toFixed(2);

                      const mainImg =
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80';

                      return (
                        <div
                          key={item._id}
                          className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                        >
                          <Link to={`/products/${item._id}`} className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                            <img src={mainImg} alt={item.name} className="w-full h-full object-cover" />
                          </Link>

                          <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                              {item.category} • {item.brand}
                            </span>
                            <Link to={`/products/${item._id}`}>
                              <h3 className="text-sm font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="text-xs text-slate-400 font-medium">
                              Unit Price: <strong className="text-white">₹{itemUnitPrice}</strong>
                              {item.discount > 0 && (
                                <span className="text-slate-500 line-through text-[11px] ml-1 font-normal">
                                  ₹{item.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Item Actions: Save For Later & Wishlist */}
                            <div className="flex items-center gap-4 pt-1 text-[11px] font-bold text-slate-400 justify-center sm:justify-start">
                              <button
                                onClick={() => moveToSavedForLater(item)}
                                className="hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                              >
                                <FiBookmark className="w-3.5 h-3.5 text-indigo-400" /> Save For Later
                              </button>
                              <span>•</span>
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                              >
                                <FiHeart className="w-3.5 h-3.5 text-rose-400" /> Move to Wishlist
                              </button>
                            </div>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-3 py-1.5 font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-3.5 py-1.5 text-xs font-black text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-3 py-1.5 font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Total Price & Delete */}
                          <div className="flex items-center gap-4">
                            <div className="text-base font-black text-white min-w-[80px] text-right">
                              ₹{itemTotalPrice}
                            </div>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Remove Item"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                    <p className="text-sm font-bold text-white">Your Active Cart is Empty</p>
                    <p className="text-xs text-slate-400">Items in your Saved For Later list are displayed below.</p>
                  </div>
                )}

                {/* ECO BAG CARD */}
                {cart.length > 0 && (
                  <Card
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      includeCarryBag
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={toggleCarryBag}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 mt-0.5">
                          <FiFeather className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-white">
                              Get your order in an Eco-Friendly Carry Bag
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                              Eco Choice
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            100% bio-degradable, reusable handles designed to safely carry your fresh groceries while protecting our environment.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={includeCarryBag}
                            onChange={(e) => e.stopPropagation()}
                            onClick={toggleCarryBag}
                            className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                          />
                          <span className={`text-sm font-black ${includeCarryBag ? 'text-emerald-400' : 'text-slate-300'}`}>
                            +₹5.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* DELIVERY PARTNER TIP CARD */}
                {cart.length > 0 && (
                  <Card className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                          <FiHeart className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-white">
                            Delivery Partner Tip
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Your tip goes directly to the delivery partner powering your 10-minute express delivery.
                          </p>
                        </div>
                      </div>

                      {deliveryTip > 0 && (
                        <span className="text-xs font-black text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          +₹{deliveryTip}.00 Added
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-3 pt-1">
                      {[10, 20, 30].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDeliveryTip(deliveryTip === amount ? 0 : amount)}
                          className={`py-2.5 px-3 text-xs font-black rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            deliveryTip === amount
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-500/30'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-sm">₹{amount}</span>
                          <span className="text-[10px] font-normal opacity-80">Tip</span>
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setDeliveryTip(0)}
                        className={`py-2.5 px-3 text-xs font-extrabold rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                          deliveryTip === 0
                            ? 'bg-slate-800 border-slate-600 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        None
                      </button>
                    </div>
                  </Card>
                )}

                {/* DEDICATED SAVED FOR LATER SECTION */}
                {savedForLater.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <FiBookmark className="w-5 h-5 text-indigo-400" />
                      <h2 className="text-xl font-black text-white">
                        Saved For Later ({savedForLater.length})
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {savedForLater.map((item) => (
                        <div
                          key={item._id}
                          className="p-4 bg-slate-900/70 border border-slate-800 rounded-3xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                item.images?.[0] ||
                                'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
                              }
                              alt={item.name}
                              className="w-16 h-16 rounded-2xl object-cover bg-slate-800"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                              <span className="text-xs font-black text-indigo-400">₹{item.price}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => moveToCartFromSaved(item)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => removeFromSavedForLater(item._id)}
                              className="p-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Remove"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SECTION: ORDER SUMMARY & POPUPS */}
              {cart.length > 0 && (
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Total Savings Card */}
                  {totalSavings > 0 && (
                    <div className="p-4 rounded-3xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 flex items-center gap-3">
                      <FiGift className="w-6 h-6 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-extrabold uppercase tracking-wide block text-[10px]">Your Total Savings</span>
                        <span className="font-black text-sm">₹{totalSavings.toFixed(2)} saved on this order!</span>
                      </div>
                    </div>
                  )}

                  <Card glass className="p-6 space-y-6 border border-slate-800 shadow-xl bg-slate-900 sticky top-24">
                    <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                      Price Details
                    </h2>

                    {/* Coupon Section with View Modal Trigger */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                          <FiTag className="text-indigo-400" /> Coupon Discount
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCouponModalOpen(true)}
                          className="text-xs text-indigo-400 font-extrabold hover:underline cursor-pointer"
                        >
                          View Coupons →
                        </button>
                      </div>

                      {appliedCoupon ? (
                        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                          <span>{appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                          <button onClick={removeCoupon} className="text-rose-400 hover:underline text-[11px] cursor-pointer">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Code: BASKETLY10"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 bg-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </form>
                      )}

                      {couponFeedback.message && (
                        <p className={`text-[11px] font-semibold ${couponFeedback.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {couponFeedback.message}
                        </p>
                      )}
                    </div>

                    {/* Reward Points Redemption Box */}
                    {balance > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-amber-400 flex items-center gap-1">
                            <FiAward /> Redeem Rewards ({balance} Pts)
                          </span>
                          <button
                            onClick={handleRedeemRewardPoints}
                            disabled={redeemedPointsInput > 0}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-40"
                          >
                            {redeemedPointsInput > 0 ? 'Redeemed' : 'Redeem All'}
                          </button>
                        </div>
                        {redeemedPointsInput > 0 && (
                          <span className="text-[11px] font-bold text-emerald-400 block">
                            -₹{redeemedPointsInput}.00 Discount Applied!
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-xs pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal ({cart.length} items)</span>
                        <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Coupon Discount ({appliedCoupon?.discountPercent}%)</span>
                          <span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {redeemedPointsInput > 0 && (
                        <div className="flex justify-between text-amber-400 font-bold">
                          <span>Reward Points Discount</span>
                          <span>-₹{redeemedPointsInput.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-white">
                          {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-400">
                        <span>Handling Charge</span>
                        <span className="font-bold text-white">₹{handlingFee.toFixed(2)}</span>
                      </div>

                      {includeCarryBag && (
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Eco Carry Bag</span>
                          <span>+₹5.00</span>
                        </div>
                      )}

                      {deliveryTip > 0 && (
                        <div className="flex justify-between text-indigo-400 font-bold">
                          <span>Delivery Partner Tip</span>
                          <span>+₹{deliveryTip.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
                        <span>Total Amount Payable</span>
                        <span className="text-indigo-400 font-mono">₹{finalPayableTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full shadow-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 cursor-pointer"
                      icon={FiArrowRight}
                      onClick={() => navigate('/checkout')}
                    >
                      Proceed to Checkout
                    </Button>

                    {/* Trust Highlights */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-amber-400 w-4 h-4 flex-shrink-0" />
                        <span>10-Minute Express Delivery available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiShield className="text-indigo-400 w-4 h-4 flex-shrink-0" />
                        <span>100% Doorstep Quality Guarantee</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

            </div>
          )}

          {/* RECOMMENDED PRODUCTS */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16 space-y-6 pt-12 border-t border-slate-800">
              <h2 className="text-2xl font-black text-white">
                Frequently Bought Together
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} viewMode="grid" />
                ))}
              </div>
            </div>
          )}
        </SectionWrapper>
      </Container>

      {/* Coupon Popup Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
    </PageWrapper>
  );
};

export default Cart;
