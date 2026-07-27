import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiTag,
  FiCopy,
  FiCheck,
  FiGift,
  FiZap,
  FiArrowRight,
  FiShield,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';

const couponList = [
  {
    code: 'BASKETLY10',
    discount: '10% OFF',
    type: 'Available',
    minOrder: 199,
    description: 'Save 10% on all fresh grocery and daily essential orders.',
    expiry: 'Valid till 31 Dec 2026',
    badge: 'Popular',
  },
  {
    code: 'WELCOME20',
    discount: '20% OFF',
    type: 'Available',
    minOrder: 299,
    description: 'Welcome bonus: Get 20% OFF on your organic produce order.',
    expiry: 'Valid till 31 Dec 2026',
    badge: 'New User',
  },
  {
    code: 'FRESH30',
    discount: '₹50 Flat OFF',
    type: 'Available',
    minOrder: 499,
    description: 'Flat ₹50 OFF on orders above ₹499.',
    expiry: 'Valid till 30 Nov 2026',
    badge: 'Super Saver',
  },
  {
    code: 'PROMEGA50',
    discount: '25% OFF',
    type: 'Membership',
    minOrder: 199,
    description: 'Exclusive 25% discount for Aetheria PRO Members.',
    expiry: 'Valid for active PRO Plan',
    badge: 'PRO Exclusive',
  },
  {
    code: 'FLASHFREE',
    discount: 'FREE Shipping',
    type: 'Expired',
    minOrder: 0,
    description: 'Free delivery on all Dark Store priority dispatch orders.',
    expiry: 'Expired yesterday',
    badge: 'Expired',
  },
];

const Coupons = () => {
  const { applyCoupon, appliedCoupon, removeCoupon } = useCart();
  const { addToast } = useToast();

  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleApply = (code) => {
    const res = applyCoupon(code);
    if (res.success) {
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const filteredCoupons =
    activeTab === 'all'
      ? couponList
      : couponList.filter((c) => c.type.toLowerCase() === activeTab.toLowerCase());

  return (
    <PageWrapper title="Store Coupons & Promotional Offers">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Store Coupons' }]} />

        <SectionWrapper className="pt-4 pb-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <FiTag className="text-indigo-400" />
                <span>Store Coupons & Promo Deals</span>
              </h1>
              <p className="text-xs text-slate-400">
                Claim exclusive discounts, free shipping vouchers, and PRO membership savings.
              </p>
            </div>

            <Link to="/cart">
              <Button variant="primary" size="md" icon={FiArrowRight} className="cursor-pointer">
                View Shopping Bag
              </Button>
            </Link>
          </div>

          {/* Active Applied Coupon Banner */}
          {appliedCoupon && (
            <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-white">
                    Coupon <span className="font-mono text-emerald-400">{appliedCoupon.code}</span> is Active!
                  </h4>
                  <p className="text-xs text-emerald-300">
                    You are saving {appliedCoupon.discountPercent}% on your active shopping cart total.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  removeCoupon();
                  addToast('Coupon removed from cart', 'info');
                }}
                className="px-4 py-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 font-bold text-xs cursor-pointer"
              >
                Remove Coupon
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'all', label: 'All Coupons' },
              { id: 'available', label: 'Available' },
              { id: 'membership', label: 'PRO Coupons' },
              { id: 'expired', label: 'Expired' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              const isExpired = coupon.type === 'Expired';

              return (
                <Card
                  key={coupon.code}
                  className={`p-6 space-y-4 bg-slate-900 border rounded-3xl transition-all relative overflow-hidden ${
                    isApplied
                      ? 'border-emerald-500/60 shadow-xl'
                      : isExpired
                      ? 'border-slate-800 opacity-60'
                      : 'border-slate-800 hover:border-indigo-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono font-black text-xs">
                      {coupon.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-extrabold border border-slate-700">
                      {coupon.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">{coupon.discount}</h3>
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">{coupon.description}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-3">
                    <div>Min Order Value: <strong className="text-slate-200">₹{coupon.minOrder}</strong></div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <FiClock className="w-3 h-3" />
                      <span>{coupon.expiry}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === coupon.code ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                      <span>{copiedCode === coupon.code ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    {!isExpired && (
                      <button
                        onClick={() => handleApply(coupon.code)}
                        className={`flex-1 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isApplied ? 'Applied' : 'Apply to Cart'}
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default Coupons;
