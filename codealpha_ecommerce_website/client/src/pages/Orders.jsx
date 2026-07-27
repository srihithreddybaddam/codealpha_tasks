import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiRefreshCw,
  FiFileText,
  FiArrowRight,
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiMessageSquare,
  FiEye,
  FiLock,
  FiLogIn,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import TaxInvoice from '../components/common/TaxInvoice';
import OrderDetailsModal from '../components/common/OrderDetailsModal';
import ReturnModal from '../components/common/ReturnModal';
import { orderService, saveLocalOrder } from '../services/order.service';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

const orderTimelineSteps = [
  'Order Placed',
  'Payment Verified',
  'Preparing Order',
  'Packed',
  'Out For Delivery',
  'Arriving Soon',
  'Delivered',
];

const Orders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const deduplicatedList = await orderService.getMyOrders();
        setOrders(deduplicatedList);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId) => {
    try {
      setOrders((prev) =>
        prev.map((o) => {
          if ((o._id || o.id) === orderId) {
            const updated = { ...o, status: 'Cancelled' };
            saveLocalOrder(updated);
            return updated;
          }
          return o;
        })
      );
      addToast('Order cancelled successfully', 'info');
    } catch (err) {
      addToast('Failed to cancel order', 'error');
    }
  };

  const handleReorder = (items) => {
    if (items && items.length) {
      items.forEach((item) => addToCart(item, item.quantity || 1));
      addToast('Items added to Shopping Bag!', 'success');
      navigate('/cart');
    }
  };

  const getStepProgressIndex = (status) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Delivered') return 6;
    if (status === 'Out For Delivery') return 4;
    if (status === 'Packed') return 3;
    return 2;
  };

  // If user is not authenticated, render professional login required screen
  if (!isAuthenticated) {
    return (
      <PageWrapper title="My Orders">
        <Container className="py-16">
          <Card className="max-w-md mx-auto p-8 text-center space-y-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center justify-center">
              <FiLock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Orders Require Sign In</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Please sign in to view your orders, track live doorstep deliveries, and manage tax invoices.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full cursor-pointer shadow-lg"
              icon={FiLogIn}
              onClick={() => navigate('/login')}
            >
              Sign In to View Orders
            </Button>
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  if (loading) {
    return (
      <PageWrapper title="Loading Orders...">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Orders & Delivery Tracking">
      <Container className="py-6">
        <SectionWrapper className="pt-2 pb-16 space-y-8">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'My Orders' }]} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FiPackage className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Order History & Live Tracking
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Track 7-stage live delivery progress, download official tax invoices, and request returns
                </p>
              </div>
            </div>

            <Link to="/products">
              <Button variant="outline" size="sm" icon={FiShoppingBag} className="cursor-pointer">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <Card className="p-12 text-center space-y-4 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 inline-flex items-center justify-center border border-slate-700">
                <FiPackage className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-400">
                You haven't placed any orders yet. Explore our farm-fresh grocery store and enjoy 10-min hyperlocal delivery!
              </p>
              <Link to="/products">
                <Button variant="primary" icon={FiArrowRight} className="cursor-pointer">
                  Browse Marketplace
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const orderId = order._id || order.id || order.orderNumber || 'ord-1001';
                const orderItems = order.items || order.orderItems || [];
                const currentStageIdx = getStepProgressIndex(order.status);
                const isCancelled = order.status === 'Cancelled';
                const isDelivered = order.status === 'Delivered';

                return (
                  <Card
                    key={orderId}
                    className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 hover:border-slate-700 transition-all shadow-lg"
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-400 text-sm">
                            #{orderId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              isCancelled
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : isDelivered
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                            }`}
                          >
                            {order.status || 'Order Placed'}
                          </span>
                        </div>
                        <span className="text-slate-400">
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Today'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-base font-black text-white">
                          ₹{(order.grandTotal || order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* 7-STAGE LIVE DELIVERY TIMELINE */}
                    {!isCancelled && (
                      <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <FiTruck className="text-emerald-400" /> Live Delivery Progress
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            ETA: 10 Mins
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-1 relative">
                          {orderTimelineSteps.map((stepLabel, idx) => {
                            const isPassed = currentStageIdx >= idx;
                            const isCurrent = currentStageIdx === idx;
                            return (
                              <div key={stepLabel} className="flex flex-col items-center text-center space-y-1 relative z-10">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                    isCurrent
                                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 ring-4 ring-amber-500/30 animate-pulse'
                                      : isPassed
                                      ? 'bg-emerald-500 text-slate-950 font-bold'
                                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                                  }`}
                                >
                                  {isPassed ? <FiCheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span
                                  className={`text-[8px] sm:text-[9px] font-extrabold leading-tight ${
                                    isCurrent ? 'text-amber-400' : isPassed ? 'text-slate-200' : 'text-slate-500'
                                  }`}
                                >
                                  {stepLabel}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ITEMS LIST PREVIEW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 text-xs"
                        >
                          <img
                            src={
                              item.image ||
                              item.images?.[0] ||
                              'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-white truncate">{item.name}</h4>
                            <span className="text-[10px] text-slate-400">
                              Qty: {item.quantity || 1} • ₹{item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ACTION CONTROLS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDetailOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiEye className="text-indigo-400" /> View Details
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiFileText className="text-indigo-400" /> Tax Invoice
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDelivered && (
                          <button
                            onClick={() => setSelectedReturnOrder(order)}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiRefreshCw /> Return / Exchange
                          </button>
                        )}

                        {!isCancelled && !isDelivered && (
                          <button
                            onClick={() => handleCancelOrder(orderId)}
                            className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiXCircle /> Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => handleReorder(orderItems)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <FiShoppingBag /> Reorder All
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </SectionWrapper>
      </Container>

      {/* POPUP MODALS */}
      <OrderDetailsModal
        isOpen={!!selectedDetailOrder}
        onClose={() => setSelectedDetailOrder(null)}
        order={selectedDetailOrder}
        onOpenInvoice={(ord) => setSelectedInvoiceOrder(ord)}
        onOpenReturn={(ord) => setSelectedReturnOrder(ord)}
      />

      <ReturnModal
        isOpen={!!selectedReturnOrder}
        onClose={() => setSelectedReturnOrder(null)}
        order={selectedReturnOrder}
      />

      {/* TAX INVOICE PRINT MODAL */}
      {selectedInvoiceOrder && (
        <TaxInvoice
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </PageWrapper>
  );
};

export default Orders;
