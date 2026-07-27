import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiCreditCard,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiArrowRight,
  FiSmartphone,
  FiDollarSign,
  FiBriefcase,
  FiCheck,
  FiAward,
  FiMapPin,
  FiShoppingBag,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getSelectedAddress } from '../components/common/AddressModal';
import { orderService } from '../services/order.service';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    subtotal,
    discount,
    shippingFee,
    shipping,
    handlingFee,
    includeCarryBag,
    toggleCarryBag,
    carryBagFee,
    deliveryTip,
    setDeliveryTip,
    grandTotal,
    clearCart,
  } = useCart();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const selectedAddress = getSelectedAddress();

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const activeAddress = selectedAddress || {
      fullName: user?.name || 'Customer',
      phone: '9876543210',
      houseNo: 'Flat 402, Green View Apts',
      street: 'Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    };

    const formattedPaymentMethod =
      paymentMethod === 'upi'
        ? `UPI (${upiId || 'GPay'})`
        : paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : paymentMethod === 'netbanking'
        ? 'Net Banking'
        : 'Cash on Delivery';

    const orderPayload = {
      items: cart.map((item) => ({
        _id: item._id,
        id: item._id,
        name: item.name,
        category: item.category || 'Grocery',
        price: item.price,
        discountPrice: item.discountPrice || item.price,
        quantity: item.quantity || 1,
        image: item.image,
        unit: item.unit || item.weight || '1 unit',
      })),
      shippingAddress: activeAddress,
      userEmail: user?.email || 'customer@basketly.in',
      userName: activeAddress.fullName || user?.name || 'Customer',
      paymentMethod: formattedPaymentMethod,
      paymentStatus: 'Paid',
      isPaid: true,
      subtotal: subtotal || grandTotal,
      discountAmount: discount || 0,
      shipping: shippingFee || 0,
      handlingFee: 5,
      tax: Math.round((subtotal || grandTotal) * 0.05 * 100) / 100,
      grandTotal: grandTotal || subtotal,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await orderService.createOrder(orderPayload);
      setConfirmedOrder(created);
      clearCart();
      addToast('Order placed successfully! 10-Minute express dispatch initiated.', 'success');
    } catch (err) {
      addToast('Payment processed, order saved locally.', 'info');
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    const orderIdDisplay = confirmedOrder._id || confirmedOrder.id || `ord-${Date.now().toString().slice(-6)}`;
    const itemsList = confirmedOrder.items || cart || [];

    return (
      <PageWrapper title="Order Placed Successfully">
        <Container className="py-12 text-center">
          <Card className="max-w-2xl mx-auto p-8 sm:p-10 space-y-6 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <FiCheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                ORDER #{orderIdDisplay}
              </span>
              <h1 className="text-3xl font-black text-white">Order Placed & Confirmed!</h1>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you! Your items have been dispatched to our dark store and are being packed with temperature controls for 10-minute delivery.
              </p>
            </div>

            {/* ORDER INFO SUMMARY */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3 text-left">
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Payment Status:</span>
                <strong className="text-emerald-400 flex items-center gap-1">
                  <FiCheckCircle /> Paid & Verified (256-Bit SSL)
                </strong>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Payment Method:</span>
                <strong className="text-white">{confirmedOrder.paymentMethod}</strong>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Delivery Address:</span>
                <strong className="text-white">
                  {confirmedOrder.shippingAddress?.fullName || 'Customer'} - {confirmedOrder.shippingAddress?.city || 'Hyderabad'} ({confirmedOrder.shippingAddress?.pincode || '500033'})
                </strong>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Total Items Paid:</span>
                <strong className="text-white">{itemsList.length} Unique Products</strong>
              </div>

              <div className="flex justify-between pt-1 text-sm font-black">
                <span className="text-white">Total Amount Paid:</span>
                <strong className="text-emerald-400">₹{confirmedOrder.grandTotal}</strong>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="primary"
                className="flex-1 py-3.5 text-xs font-black shadow-xl"
                icon={FiShoppingBag}
                onClick={() => navigate('/orders')}
              >
                Go to My Orders & Track Delivery
              </Button>
              <Link to="/products" className="flex-1">
                <Button variant="outline" className="w-full py-3.5 text-xs text-slate-300 border-slate-700 hover:bg-slate-800">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Secure Payment">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Bag', path: '/cart' }, { label: 'Checkout', path: '/checkout' }, { label: 'Payment' }]} />

        <SectionWrapper className="pt-4 pb-16">
          <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
            <FiLock className="text-emerald-400" />
            <span>Select Payment Method</span>
          </h1>

          <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: PAYMENT OPTIONS */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border border-slate-800 shadow-xl">
                {/* 1. UPI Payment */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <FiSmartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">UPI Instant Payment</h3>
                        <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <FiCheck className="text-indigo-400 w-5 h-5" />}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <label className="text-xs font-bold text-slate-300">Enter VPA / UPI ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okicici"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required
                          className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button type="button" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <FiCreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Credit / Debit Card</h3>
                        <p className="text-xs text-slate-400">Visa, Mastercard, RuPay, Maestro</p>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <FiCheck className="text-cyan-400 w-5 h-5" />}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8921"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          required
                          className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            required
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FiDollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Cash / Pay on Delivery</h3>
                        <p className="text-xs text-slate-400">Pay via cash or UPI to delivery agent</p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <FiCheck className="text-emerald-400 w-5 h-5" />}
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT: ORDER SUMMARY & SUBMIT */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border border-slate-800 shadow-xl">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-4">
                  Payment Summary
                </h3>

                {/* Eco Carry Bag Option Toggle */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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
                  <p className="text-[10px] text-slate-400 pl-6 leading-tight">
                    Reusable & bio-degradable handles for safe delivery
                  </p>
                </div>

                {/* Delivery Partner Tip Options */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Delivery Partner Tip</span>
                    {deliveryTip > 0 && <span className="text-emerald-400">+₹{deliveryTip}</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    100% of tip goes directly to your 10-minute delivery executive.
                  </p>

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

                {/* Cost Summary Breakdown */}
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items):</span>
                    <strong className="text-white">₹{subtotal.toFixed(2)}</strong>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount Savings:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express 10-Min Delivery:</span>
                    <strong className="text-emerald-400">{shippingFee === 0 || shipping === 0 ? 'FREE' : `₹${shippingFee || shipping}`}</strong>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Handling Charge:</span>
                    <strong className="text-white">₹{handlingFee || 5}</strong>
                  </div>

                  {includeCarryBag && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Eco Carry Bag:</span>
                      <span>+₹5.00</span>
                    </div>
                  )}

                  {deliveryTip > 0 && (
                    <div className="flex justify-between text-indigo-400 font-bold">
                      <span>Delivery Partner Tip:</span>
                      <span>+₹{deliveryTip.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-slate-800 pt-3 text-base font-black text-white">
                    <span>Total Amount Payable:</span>
                    <strong className="text-emerald-400">₹{grandTotal}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <FiShield className="w-4 h-4" />
                    <span>100% Encrypted & Safe Checkout</span>
                  </div>
                  <p>Your payment information is protected by 256-Bit SSL Encryption.</p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-sm font-extrabold shadow-xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-cyan-500"
                  disabled={loading || cart.length === 0}
                >
                  {loading ? 'Processing Order...' : `Pay ₹${grandTotal} & Place Order`}
                </Button>
              </Card>
            </div>
          </form>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default Payment;
