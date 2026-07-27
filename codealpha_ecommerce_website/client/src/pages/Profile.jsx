import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiEdit2,
  FiLogOut,
  FiCheckCircle,
  FiShield,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import AddressModal, { getSavedAddresses } from '../components/common/AddressModal';
import RecentlyViewedSection from '../components/product/RecentlyViewedSection';
import { getSavedMembership } from './Membership';
import { orderService } from '../services/order.service';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { totalWishlistItems } = useWishlist();
  const { totalItems } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState(getSavedAddresses());
  const [membership, setMembership] = useState(getSavedMembership());
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const res = await orderService.getMyOrders();
        const orders = res.data?.orders || res.orders || [];
        setOrderCount(orders.length);
      } catch (err) {
        setOrderCount(0);
      }
    };
    fetchOrderCount();
  }, []);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || 'Alex',
    lastName: user?.lastName || user?.name?.split(' ')[1] || 'Morgan',
    email: user?.email || 'user@basketly.in',
    street: user?.address?.street || '123 Innovation Way',
    city: user?.address?.city || 'San Francisco',
    state: user?.address?.state || 'CA',
    zipCode: user?.address?.zipCode || '94105',
    country: user?.address?.country || 'United States',
  });

  const [saveSuccess, setSaveSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      setSaveSuccess('Profile information saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  return (
    <PageWrapper title="My Profile">
      <Container className="py-10 space-y-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Banner & User Card */}
          <Card glass className="p-8 relative overflow-hidden border border-white/50 dark:border-slate-800 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px]" title="Account Active">
                  ✓
                </span>
              </div>

              {/* Header Info */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {user?.name || 'Alex Morgan'}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                      <FiMail className="w-3.5 h-3.5" />
                      <span>{user?.email || 'user@basketly.in'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant={isEditing ? 'outline' : 'primary'}
                      size="sm"
                      icon={FiEdit2}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={FiLogOut}
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold mt-2">
                  <FiShield className="w-3.5 h-3.5" />
                  <span>Role: {user?.role?.toUpperCase() || 'USER'}</span>
                </div>
              </div>
            </div>
          </Card>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
              <FiCheckCircle className="w-5 h-5" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {/* Live Stats & Settings Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Orders Card */}
            <div
              onClick={() => navigate('/orders')}
              className="p-5 text-center space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500/60 hover:shadow-lg transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 inline-block mb-1 group-hover:scale-110 transition-transform">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {orderCount}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
                My Orders →
              </p>
            </div>

            {/* Wishlist Saved Card */}
            <div
              onClick={() => navigate('/wishlist')}
              className="p-5 text-center space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500/60 hover:shadow-lg transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 inline-block mb-1 group-hover:scale-110 transition-transform">
                <FiHeart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {totalWishlistItems}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                Wishlist Items →
              </p>
            </div>

            {/* Cart Items Card */}
            <div
              onClick={() => navigate('/cart')}
              className="p-5 text-center space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-cyan-500/60 hover:shadow-lg transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 inline-block mb-1 group-hover:scale-110 transition-transform">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {totalItems}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                Shopping Bag →
              </p>
            </div>

            {/* Membership Card */}
            <div
              onClick={() => navigate('/membership')}
              className="p-5 text-center space-y-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-amber-500/60 hover:shadow-lg transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 inline-block mb-1 group-hover:scale-110 transition-transform">
                <FiShield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-amber-400">
                {membership.plan === 'pro-yearly' ? 'PRO YEARLY' : membership.plan === 'pro-monthly' ? 'PRO MONTHLY' : 'FREE PLAN'}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                Membership →
              </p>
            </div>
          </div>

          {/* Profile Details & Shipping Address */}
          <Card className="p-8 space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiUser className="text-indigo-600 dark:text-indigo-400" />
                <span>Personal & Shipping Information</span>
              </h2>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                <Input
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="Zip Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                  <Input
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Contact Details
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Full Name</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {user?.name || `${formData.firstName} ${formData.lastName}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email Address</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {user?.email || formData.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FiMapPin /> Primary Delivery Address
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] py-1 px-2.5 border-slate-700 text-indigo-400"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      Manage Addresses
                    </Button>
                  </div>
                  {savedAddresses.length > 0 ? (
                    <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                      <p className="font-bold text-white">{savedAddresses[0].fullName} ({savedAddresses[0].type || 'Home'})</p>
                      <p>{savedAddresses[0].houseNo}{savedAddresses[0].building ? `, ${savedAddresses[0].building}` : ''}, {savedAddresses[0].street}</p>
                      <p>{savedAddresses[0].city}, {savedAddresses[0].state} - {savedAddresses[0].pincode}</p>
                      <p className="text-slate-400">Mobile: {savedAddresses[0].phone}</p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 space-y-2 py-1">
                      <p className="italic text-amber-400 font-medium">No delivery address saved yet.</p>
                      <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="text-xs text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        + Add Delivery Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Recently Viewed History Section in Profile Dashboard */}
          <div className="pt-4">
            <RecentlyViewedSection limit={5} title="My Recently Viewed History" />
          </div>
        </div>
      </Container>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setSavedAddresses(getSavedAddresses());
        }}
        onAddressSelect={() => {
          setSavedAddresses(getSavedAddresses());
        }}
      />
    </PageWrapper>
  );
};

export default Profile;
