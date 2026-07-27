import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin,
  FiTruck,
  FiZap,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
  FiLock,
  FiPhone,
  FiUser,
  FiHome,
  FiFileText,
  FiPlus,
  FiEdit2,
  FiAlertCircle,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AddressModal, { getSelectedAddress, getSavedAddresses } from '../components/common/AddressModal';
import { useCart } from '../hooks/useCart';

const deliverySlots = [
  { id: 'express', label: 'Express 10-Min Priority Dispatch', tag: 'Fastest', eta: 'Within 10 Minutes' },
  { id: 'today_morning', label: 'Today (8 AM - 11 AM)', tag: 'Morning Slot', eta: 'Today 8 AM - 11 AM' },
  { id: 'today_afternoon', label: 'Today (1 PM - 4 PM)', tag: 'Afternoon Slot', eta: 'Today 1 PM - 4 PM' },
  { id: 'today_evening', label: 'Today (6 PM - 9 PM)', tag: 'Evening Slot', eta: 'Today 6 PM - 9 PM' },
  { id: 'tomorrow_morning', label: 'Tomorrow (8 AM - 11 AM)', tag: 'Tomorrow Morning', eta: 'Tomorrow 8 AM - 11 AM' },
  { id: 'tomorrow_evening', label: 'Tomorrow (6 PM - 9 PM)', tag: 'Tomorrow Evening', eta: 'Tomorrow 6 PM - 9 PM' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cart,
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
    appliedCoupon,
    deliveryMethod,
    setDeliveryMethod,
  } = useCart();

  const [selectedAddress, setSelectedAddress] = useState(getSelectedAddress());
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('express');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    const current = getSelectedAddress();
    setSelectedAddress(current);
  }, []);

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setAddressError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!selectedAddress) {
      setAddressError('No delivery address found. Please add a shipping address before proceeding.');
      setIsAddressModalOpen(true);
      return;
    }

    const slotInfo = deliverySlots.find((s) => s.id === selectedSlot) || deliverySlots[0];

    const shippingPayload = {
      ...selectedAddress,
      slot: slotInfo.label,
      slotEta: slotInfo.eta,
      instructions: deliveryInstructions || selectedAddress.instructions || '',
    };

    localStorage.setItem('basketly_shipping', JSON.stringify(shippingPayload));
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
      <PageWrapper title="Checkout">
        <Container className="py-16 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Your Bag is Empty</h2>
          <p className="text-xs text-slate-400">Add items to your bag before proceeding to checkout.</p>
          <Link to="/products">
            <Button variant="primary">Return to Store</Button>
          </Link>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Checkout & Shipping">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Bag', path: '/cart' }, { label: 'Checkout' }]} />

        <SectionWrapper className="pt-4 pb-16">
          <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
            <FiMapPin className="text-indigo-400" />
            <span>Delivery & Shipping Information</span>
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: SHIPPING ADDRESS & OPTIONS */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. SHIPPING ADDRESS SECTION */}
              <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <FiUser className="text-indigo-400" />
                    <span>1. Recipient & Delivery Address</span>
                  </h2>

                  {selectedAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={FiEdit2}
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-xs py-1 px-3 border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    >
                      Change Address
                    </Button>
                  )}
                </div>

                {!selectedAddress ? (
                  <div className="p-6 text-center space-y-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <FiAlertCircle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">No delivery address found.</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Please add a delivery address to proceed with your order.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      variant="primary"
                      className="mt-2 text-xs py-2.5 px-5 cursor-pointer"
                      icon={FiPlus}
                    >
                      Add Delivery Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/80 shadow-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{selectedAddress.fullName}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px] uppercase">
                            {selectedAddress.type || 'Home'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <FiCheckCircle /> Selected for Delivery
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-snug">
                        {selectedAddress.houseNo}
                        {selectedAddress.building ? `, ${selectedAddress.building}` : ''},{' '}
                        {selectedAddress.street}
                      </p>

                      <p className="text-xs text-slate-300 font-semibold">
                        {selectedAddress.city}, {selectedAddress.state} -{' '}
                        <strong className="text-white font-extrabold">{selectedAddress.pincode}</strong>
                      </p>

                      <p className="text-xs text-slate-400 pt-1">
                        Contact Number: <span className="text-slate-200 font-mono font-bold">{selectedAddress.phone}</span>
                      </p>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <FiFileText className="text-slate-400" /> Delivery Instructions (Optional)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="e.g. Leave package with apartment guard, Ring doorbell twice"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                )}
              </Card>

              {/* 2. DELIVERY SLOT SELECTION MODULE */}
              <Card className="p-6 space-y-4 bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <FiClock className="text-amber-400" />
                  <span>2. Delivery Slot & Schedule</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliverySlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30'
                            : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white line-clamp-1">{slot.label}</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold text-[9px] uppercase">
                            {slot.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-bold mt-1">
                          ETA: {slot.eta}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* 3. RETURNS & EXCHANGE ASSURANCE */}
              <Card className="p-6 space-y-4 bg-slate-900 border border-slate-800 shadow-xl">
                <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <FiRefreshCw className="text-cyan-400" />
                  <span>3. Easy Returns & Exchange Assurance</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-400" /> 7-Day Return Policy
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Eligible fresh produce, groceries, and packaged items can be returned within 7 days.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FiCheckCircle className="text-indigo-400" /> 14-Day Household Return
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Kitchenware and household appliances are eligible for a 14-day return window.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-5 space-y-6">
              <Card glass className="p-6 space-y-6 border border-slate-800 shadow-2xl bg-slate-900 sticky top-24">
                <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-indigo-400 font-bold">{cart.length} items</span>
                </h2>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {cart.map((item) => {
                    const price = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    return (
                      <div key={item._id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-bold text-slate-300">{item.quantity}x</span>
                          <span className="text-slate-300 truncate">{item.name}</span>
                        </div>
                        <span className="font-bold text-white ml-2">₹{(price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeCarryBag}
                        onChange={toggleCarryBag}
                        className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-200">Get order in an Eco Carry Bag</span>
                    </div>
                    <span className={`text-xs font-black ${includeCarryBag ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {includeCarryBag ? '+₹5.00' : '₹0'}
                    </span>
                  </label>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Delivery Partner Tip</span>
                    {deliveryTip > 0 && <span className="text-emerald-400">+₹{deliveryTip}</span>}
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[10, 20, 30].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDeliveryTip(deliveryTip === amount ? 0 : amount)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          deliveryTip === amount
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDeliveryTip(0)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        deliveryTip === 0
                          ? 'bg-slate-800 border-slate-600 text-slate-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
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
                    <span>Grand Total Payable</span>
                    <span className="text-emerald-400 font-mono">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {addressError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{addressError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-xl cursor-pointer"
                  icon={FiArrowRight}
                  disabled={!selectedAddress}
                >
                  {selectedAddress ? 'Proceed to Payment' : 'Add Address to Continue'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                  <FiLock className="text-emerald-400" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
              </Card>
            </div>
          </form>
        </SectionWrapper>
      </Container>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          const current = getSelectedAddress();
          setSelectedAddress(current);
        }}
        onAddressSelect={handleAddressSelect}
      />
    </PageWrapper>
  );
};

export default Checkout;
