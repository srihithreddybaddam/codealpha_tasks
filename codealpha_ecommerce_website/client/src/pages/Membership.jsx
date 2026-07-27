import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiShield,
  FiZap,
  FiCheckCircle,
  FiStar,
  FiArrowRight,
  FiClock,
  FiAward,
  FiCheck,
  FiX,
  FiLock,
  FiCreditCard,
  FiRefreshCw,
  FiDollarSign,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';

export const getSavedMembership = () => {
  try {
    const data =
      localStorage.getItem('basketly_user_membership') ||
      localStorage.getItem('basketly_membership') ||
      localStorage.getItem('aetheria_membership');
    if (data && data !== 'undefined' && data !== 'null') {
      return JSON.parse(data);
    }
  } catch (err) {}
  return {
    plan: 'free',
    status: 'active',
    activeSince: '2026-01-01',
    renewalDate: 'N/A',
    expiryDate: 'N/A',
    remainingDays: 0,
    history: [],
  };
};

export const saveMembership = (membership) => {
  localStorage.setItem('basketly_user_membership', JSON.stringify(membership));
  localStorage.setItem('basketly_membership', JSON.stringify(membership));
};

const Membership = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [membership, setMembership] = useState(getSavedMembership());
  const [selectedPlan, setSelectedPlan] = useState('pro-monthly'); // 'pro-monthly' | 'pro-yearly'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const isPro = membership.plan === 'pro-monthly' || membership.plan === 'pro-yearly';

  const handleOpenPayment = (planType) => {
    setSelectedPlan(planType);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      const now = new Date();
      const activeSinceDate = now.toISOString().split('T')[0];
      const isYearly = selectedPlan === 'pro-yearly';
      
      const expiry = new Date();
      if (isYearly) {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }
      
      const expiryDateStr = expiry.toISOString().split('T')[0];
      const daysLeft = isYearly ? 365 : 30;
      const price = isYearly ? 999 : 59;
      const txnId = `TXN-MEM-${Date.now().toString().slice(-6)}`;

      const newMembership = {
        plan: selectedPlan,
        status: 'active',
        activeSince: activeSinceDate,
        renewalDate: expiryDateStr,
        expiryDate: expiryDateStr,
        remainingDays: daysLeft,
        pricePaid: price,
        history: [
          {
            txnId,
            plan: isYearly ? 'Basketly Pro Yearly' : 'Basketly Pro Monthly',
            amount: `₹${price}`,
            date: activeSinceDate,
            status: 'Success',
          },
          ...(membership.history || []),
        ],
      };

      saveMembership(newMembership);
      setMembership(newMembership);

      // Sync with user profile
      try {
        if (updateProfile) {
          await updateProfile({ membershipTier: selectedPlan, isPro: true });
        }
      } catch (err) {}

      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      addToast(
        `Congratulations! You are now an active Basketly Pro Member (${isYearly ? 'Yearly' : 'Monthly'}).`,
        'success'
      );
    }, 1200);
  };

  return (
    <PageWrapper title="Basketly Pro — Membership & Perks">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Settings', path: '/profile' }, { label: 'Membership' }]} />

        <SectionWrapper className="pt-4 pb-16 space-y-10">
          
          {/* HEADER BANNER */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-extrabold tracking-wide uppercase">
                <FiStar className="w-4 h-4 fill-amber-400" />
                <span>BASKETLY PRO MEMBERSHIP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Unlock Unlimited Free Express Deliveries & Member Perks
              </h1>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Upgrade to Pro to enjoy priority 10-minute grocery dispatch, exclusive member discounts, zero handling fees, and 24/7 dedicated support.
              </p>

              {/* CURRENT MEMBERSHIP BADGE */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <FiAward className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                      Active Status
                    </span>
                    <span className="text-sm font-black text-white flex items-center gap-1.5">
                      {isPro ? (
                        <>
                          <span className="text-amber-400 font-black">
                            PRO MEMBER ({membership.plan === 'pro-yearly' ? 'Yearly' : 'Monthly'})
                          </span>
                          <FiCheckCircle className="text-emerald-400 w-4 h-4" />
                        </>
                      ) : (
                        <span className="text-slate-300">FREE MEMBERSHIP</span>
                      )}
                    </span>
                  </div>
                </div>

                {isPro && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <FiClock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                        Renewal Date
                      </span>
                      <span className="text-sm font-black text-white">
                        {membership.renewalDate} ({membership.remainingDays} Days Left)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* THREE MEMBERSHIP PLANS COMPARISON */}
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Choose Your Membership Plan</h2>
              <p className="text-xs text-slate-400">
                Select a plan that fits your grocery & lifestyle needs. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* PLAN 1: FREE MEMBERSHIP */}
              <Card className="p-6 sm:p-8 bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between relative">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      Standard Plan
                    </span>
                    <h3 className="text-xl font-black text-white">Free Membership</h3>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-b border-slate-800 pb-4">
                    <span className="text-3xl font-black text-white">₹0</span>
                    <span className="text-xs text-slate-400 font-semibold">/ Forever</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Standard Delivery (1–2 Days)
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Full Access to 500+ Catalog Items
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Saved Wishlist & Shopping Bag
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Live Order Tracking
                    </li>
                    <li className="flex items-center gap-2 opacity-40">
                      <FiX className="text-slate-500 flex-shrink-0" /> No 10-Min Priority Express Queue
                    </li>
                    <li className="flex items-center gap-2 opacity-40">
                      <FiX className="text-slate-500 flex-shrink-0" /> No Exclusive Member Coupons
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {!isPro ? (
                    <div className="p-3 text-center rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                      Current Active Plan
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-xs border-slate-700 text-slate-400"
                      disabled
                    >
                      Included
                    </Button>
                  )}
                </div>
              </Card>

              {/* PLAN 2: PRO MONTHLY (POPULAR) */}
              <Card className="p-6 sm:p-8 bg-slate-900 border-2 border-indigo-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-950/50">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  MOST POPULAR
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider block">
                      Monthly Subscription
                    </span>
                    <h3 className="text-xl font-black text-white">Pro Monthly</h3>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-b border-slate-800 pb-4">
                    <span className="text-4xl font-black text-white">₹59</span>
                    <span className="text-xs text-slate-400 font-semibold">/ Month</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Priority 10-Minute Express Queue
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> FREE Delivery on Orders over ₹99
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Exclusive Members-Only Coupons
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Early Access to Festival Flash Sales
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Premium Member Badge on Profile
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> 24/7 Priority Customer Support
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {membership.plan === 'pro-monthly' ? (
                    <Button
                      variant="outline"
                      className="w-full text-xs border-indigo-500 text-indigo-400"
                      onClick={() => handleOpenPayment('pro-monthly')}
                    >
                      Renew Monthly Plan (₹59)
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full text-xs shadow-xl"
                      icon={FiArrowRight}
                      onClick={() => handleOpenPayment('pro-monthly')}
                    >
                      Subscribe Monthly (₹59)
                    </Button>
                  )}
                </div>
              </Card>

              {/* PLAN 3: PRO YEARLY (BEST VALUE) */}
              <Card className="p-6 sm:p-8 bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between relative hover:border-amber-500/60 transition-all">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  SAVE 30% ANNUALLY
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
                      Annual Pass
                    </span>
                    <h3 className="text-xl font-black text-white">Pro Yearly</h3>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-b border-slate-800 pb-4">
                    <span className="text-4xl font-black text-white">₹999</span>
                    <span className="text-xs text-slate-400 font-semibold">/ Year</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2 font-bold text-amber-400">
                      <FiCheck className="text-amber-400 flex-shrink-0" /> All Pro Monthly Benefits Included
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Unlimited FREE Express Deliveries
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Zero Handling Charges on Checkout
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Dedicated Account Manager Support
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-emerald-400 flex-shrink-0" /> Surprise Organic Tasting Boxes
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {membership.plan === 'pro-yearly' ? (
                    <Button
                      variant="outline"
                      className="w-full text-xs border-amber-500 text-amber-400"
                      onClick={() => handleOpenPayment('pro-yearly')}
                    >
                      Renew Yearly Plan (₹999)
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-xl"
                      icon={FiArrowRight}
                      onClick={() => handleOpenPayment('pro-yearly')}
                    >
                      Subscribe Yearly (₹999)
                    </Button>
                  )}
                </div>
              </Card>

            </div>
          </div>

          {/* BENEFIT FEATURE COMPARISON TABLE */}
          <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-black text-white border-b border-slate-800 pb-4 flex items-center gap-2">
              <FiShield className="text-indigo-400" />
              <span>Full Member Benefits Comparison Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                    <th className="py-3 px-4">Membership Benefit</th>
                    <th className="py-3 px-4 text-center">Free Plan (₹0)</th>
                    <th className="py-3 px-4 text-center text-indigo-400">Pro Monthly (₹59)</th>
                    <th className="py-3 px-4 text-center text-amber-400">Pro Yearly (₹999)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Standard Delivery (1-2 Days)</td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Priority 10-Min Express Dispatch Queue</td>
                    <td className="py-3.5 px-4 text-center text-slate-600"><FiX className="mx-auto" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">FREE Express Shipping Threshold</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">₹499 Minimum</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">₹99 Minimum</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-400">Zero Minimum</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Exclusive Members-Only Flash Sale Coupons</td>
                    <td className="py-3.5 px-4 text-center text-slate-600"><FiX className="mx-auto" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Zero Handling & Convenience Fee</td>
                    <td className="py-3.5 px-4 text-center text-slate-600"><FiX className="mx-auto" /></td>
                    <td className="py-3.5 px-4 text-center text-slate-600"><FiX className="mx-auto" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">24/7 Dedicated Priority Customer Support</td>
                    <td className="py-3.5 px-4 text-center text-slate-600"><FiX className="mx-auto" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                    <td className="py-3.5 px-4 text-center"><FiCheck className="mx-auto text-emerald-400" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* PAYMENT HISTORY & INVOICE LOGS */}
          {membership.history && membership.history.length > 0 && (
            <Card className="p-6 sm:p-8 space-y-4 bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <FiRefreshCw className="text-cyan-400" />
                <span>Membership Payment History</span>
              </h3>

              <div className="space-y-3">
                {membership.history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-white block">{item.plan}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Txn ID: {item.txnId}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-indigo-400 block text-sm">{item.amount}</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">{item.status} ({item.date})</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </SectionWrapper>
      </Container>

      {/* PRO MEMBERSHIP PAYMENT ACTIVATION MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <FiCreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white pt-1">Activate Basketly Pro</h3>
              <p className="text-xs text-slate-400">
                Completing payment will immediately grant Pro status & generate your expiry date.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Selected Plan:</span>
                <span className="text-white font-bold">
                  {selectedPlan === 'pro-yearly' ? 'Pro Yearly Plan' : 'Pro Monthly Plan'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Amount Payable:</span>
                <span className="text-amber-400 font-black text-base">
                  {selectedPlan === 'pro-yearly' ? '₹999' : '₹59'}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border cursor-pointer font-bold text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-950/60 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Instant UPI / GPay
                  </div>
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer font-bold text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-950/60 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Credit / Debit Card
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <FiLock className="text-emerald-400" />
                <span>256-Bit SSL Encrypted Instant Payment</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 text-xs font-extrabold shadow-xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 text-slate-950"
                disabled={isProcessing}
              >
                {isProcessing
                  ? 'Processing Payment...'
                  : `Pay ${selectedPlan === 'pro-yearly' ? '₹999' : '₹59'} & Activate Pro`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Membership;
