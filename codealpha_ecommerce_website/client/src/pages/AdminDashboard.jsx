import React, { useState, useEffect } from 'react';
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSlash,
  FiCheck,
  FiRefreshCw,
  FiSearch,
  FiTag,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiShield,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useToast } from '../contexts/ToastContext';

const initialCoupons = [
  { code: 'BASKETLY10', discount: '10% OFF', minOrder: 199, expiry: '2026-12-31', active: true },
  { code: 'WELCOME20', discount: '20% OFF', minOrder: 299, expiry: '2026-12-31', active: true },
  { code: 'FRESH30', discount: '₹50 OFF', minOrder: 499, expiry: '2026-11-30', active: true },
];

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'customers', 'coupons', 'analytics'

  // Overview Stats State
  const [stats, setStats] = useState({
    totalProducts: 500,
    totalCategories: 14,
    totalOrders: 18,
    totalCustomers: 12,
    totalRevenue: 38450,
    todaysOrders: 6,
    pendingOrders: 4,
    deliveredOrders: 13,
    cancelledOrders: 1,
    lowStockProducts: 14,
    outOfStockProducts: 2,
  });

  // Products Tab State
  const [productsList, setProductsList] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fresh Fruits',
    brand: 'Farm Fresh',
    price: '',
    stock: '',
    discount: '0',
    description: '',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
    isBestSeller: false,
    isOrganic: true,
  });

  // Orders Tab State
  const [ordersList, setOrdersList] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');

  // Customers Tab State
  const [customersList, setCustomersList] = useState([
    { id: 'c-1', name: 'Srihith Reddy', email: 'srihith@basketly.in', phone: '9876543210', totalSpend: 14500, ordersCount: 5, blocked: false, role: 'PRO USER' },
    { id: 'c-2', name: 'Ananya Sharma', email: 'ananya@example.com', phone: '9812345678', totalSpend: 8200, ordersCount: 3, blocked: false, role: 'USER' },
    { id: 'c-3', name: 'Rahul Verma', email: 'rahul@example.com', phone: '9765432109', totalSpend: 2150, ordersCount: 1, blocked: false, role: 'USER' },
    { id: 'c-4', name: 'Priya Patel', email: 'priya@example.com', phone: '9654321098', totalSpend: 0, ordersCount: 0, blocked: true, role: 'USER' },
  ]);

  // Coupons Tab State
  const [coupons, setCoupons] = useState(initialCoupons);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minOrder: '', expiry: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=100')
      .then((r) => r.json())
      .then((d) => setProductsList(d.data?.products || d.products || []))
      .catch(() => {});

    fetch('http://localhost:5000/api/orders/all')
      .then((r) => r.json())
      .then((d) => setOrdersList(d.data?.orders || d.orders || []))
      .catch(() => {});
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created = {
      _id: `prod-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock || 50),
      discount: Number(newProduct.discount || 0),
      description: newProduct.description || 'Farm-fresh grocery item.',
      images: [newProduct.image],
      rating: 4.8,
      numReviews: 1,
    };

    setProductsList([created, ...productsList]);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      category: 'Fresh Fruits',
      brand: 'Farm Fresh',
      price: '',
      stock: '',
      discount: '0',
      description: '',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
    });
    addToast(`Product "${created.name}" added to Store catalog!`, 'success');
  };

  const handleDeleteProduct = (id, name) => {
    setProductsList((prev) => prev.filter((p) => p._id !== id));
    addToast(`Product "${name}" deleted from Store.`, 'info');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => ((o._id || o.id) === orderId ? { ...o, status: newStatus } : o))
    );
    addToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
  };

  const handleToggleCustomerBlock = (id, name, currentBlocked) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, blocked: !currentBlocked } : c))
    );
    addToast(`Customer ${name} ${currentBlocked ? 'reactivated' : 'suspended'}!`, currentBlocked ? 'success' : 'warning');
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    const couponObj = {
      code: newCoupon.code.toUpperCase().trim(),
      discount: newCoupon.discount || '15% OFF',
      minOrder: Number(newCoupon.minOrder || 199),
      expiry: newCoupon.expiry || '2026-12-31',
      active: true,
    };

    setCoupons([couponObj, ...coupons]);
    setNewCoupon({ code: '', discount: '', minOrder: '', expiry: '' });
    addToast(`Coupon ${couponObj.code} created successfully!`, 'success');
  };

  const handleDeleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addToast(`Coupon ${code} removed`, 'info');
  };

  const filteredProducts = productsList.filter(
    (p) =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <PageWrapper title="Admin Control Dashboard">
      <Container className="py-8">
        <SectionWrapper className="pt-2 pb-16 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">Basketly Admin Dashboard</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage inventory, live orders, customer accounts, promo coupons, and sales analytics.
              </p>
            </div>

            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => setShowAddProductModal(true)}
              className="cursor-pointer shadow-lg"
            >
              Add New Product
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: FiGrid },
              { id: 'products', label: 'Products Catalog', icon: FiBox },
              { id: 'orders', label: 'Live Orders', icon: FiShoppingBag },
              { id: 'customers', label: 'Customers', icon: FiUsers },
              { id: 'coupons', label: 'Coupons', icon: FiTag },
              { id: 'analytics', label: 'Sales Analytics', icon: FiTrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Total Revenue</span>
                    <FiDollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white">₹{stats.totalRevenue.toLocaleString()}</div>
                  <span className="text-[11px] text-emerald-400 font-bold">↑ 18.5% from last month</span>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Total Orders</span>
                    <FiShoppingBag className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.totalOrders}</div>
                  <span className="text-[11px] text-indigo-400 font-bold">{stats.pendingOrders} Pending Dispatch</span>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Active Catalog</span>
                    <FiBox className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{productsList.length || stats.totalProducts}</div>
                  <span className="text-[11px] text-slate-400">across 14 categories</span>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase">Registered Customers</span>
                    <FiUsers className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{customersList.length}</div>
                  <span className="text-[11px] text-purple-400 font-bold">Active User Base</span>
                </Card>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FiAlertTriangle className="text-amber-400" /> Low Stock Inventory Alerts
                  </h3>
                  <div className="space-y-3 text-xs">
                    {productsList.slice(0, 4).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <div>
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">{item.category}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black">
                          {item.stock || 5} Left
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FiClock className="text-indigo-400" /> Recent Live Orders
                  </h3>
                  <div className="space-y-3 text-xs">
                    {ordersList.slice(0, 4).map((order) => (
                      <div key={order._id || order.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <div>
                          <h4 className="font-mono font-bold text-indigo-400">#{order._id || order.id || 'ord-1001'}</h4>
                          <span className="text-[10px] text-slate-400">₹{order.grandTotal || 450} • {order.paymentMethod || 'UPI'}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold text-[10px]">
                          {order.status || 'Order Placed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                </div>

                <Button
                  variant="primary"
                  icon={FiPlus}
                  onClick={() => setShowAddProductModal(true)}
                  className="cursor-pointer"
                >
                  Add Product
                </Button>
              </div>

              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-xl scrollbar-thin">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-800/60 text-slate-400 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredProducts.slice(0, 20).map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-800"
                          />
                          <span className="line-clamp-1">{prod.name}</span>
                        </td>
                        <td className="p-4 text-indigo-400 font-semibold">{prod.category}</td>
                        <td className="p-4 font-black text-white">₹{prod.price}</td>
                        <td className="p-4 font-bold">
                          <span className={prod.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}>
                            {prod.stock} left
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold">
                            ORGANIC
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Manage Customer Orders ({ordersList.length})</h3>
              </div>

              <div className="space-y-4">
                {ordersList.map((order) => {
                  const orderId = order._id || order.id || 'ord-1001';
                  return (
                    <Card key={orderId} className="p-6 bg-slate-900 border border-slate-800 space-y-4 rounded-3xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-indigo-400 text-sm">#{orderId}</span>
                          <p className="text-slate-400">Total Amount: <strong className="text-white">₹{order.grandTotal || 450}</strong> • {order.paymentMethod || 'UPI'}</p>
                        </div>

                        {/* Order Status Controller */}
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || 'Order Placed'}
                            onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-2 font-bold focus:outline-none"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Payment Verified">Payment Verified</option>
                            <option value="Preparing Order">Preparing Order</option>
                            <option value="Packed">Packed</option>
                            <option value="Out For Delivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1">
                        <p>Delivery Runner: <strong className="text-emerald-400">Rajesh Kumar (TS-09-EX-4092)</strong></p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Customer User Base</h3>
              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-xl scrollbar-thin">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-800/60 text-slate-400 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Total Spending</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {customersList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/30">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-white font-bold">{c.name}</span>
                            <span className="text-[10px] text-indigo-400 font-extrabold">{c.role}</span>
                          </div>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <span className="block text-slate-300">{c.email}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{c.phone}</span>
                        </td>
                        <td className="p-4 font-black text-white">₹{c.totalSpend.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            c.blocked
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {c.blocked ? 'SUSPENDED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleCustomerBlock(c.id, c.name, c.blocked)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors cursor-pointer ${
                              c.blocked
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                            }`}
                          >
                            {c.blocked ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Coupon Form */}
              <Card className="p-6 bg-slate-900 border border-slate-800 space-y-4 rounded-3xl">
                <h3 className="text-base font-bold text-white">Create Promo Coupon Code</h3>
                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. FLASH50)"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    required
                    className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-3 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Discount (e.g. 15% OFF)"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-3 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Min Order Value (₹)"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-3 text-xs"
                  />
                  <Button type="submit" variant="primary" className="cursor-pointer">
                    Create Coupon
                  </Button>
                </form>
              </Card>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {coupons.map((c) => (
                  <Card key={c.code} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-indigo-400 text-sm">{c.code}</span>
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xl font-black text-white">{c.discount}</div>
                    <p className="text-xs text-slate-400">Min Order: ₹{c.minOrder} • Expiry: {c.expiry}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS DASHBOARD */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Sales & Revenue Analytics</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Daily Sales</span>
                  <div className="text-3xl font-black text-emerald-400">₹8,450.00</div>
                  <span className="text-[10px] text-slate-500 font-semibold">12 Orders Processed</span>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Weekly Revenue</span>
                  <div className="text-3xl font-black text-indigo-400">₹42,100.00</div>
                  <span className="text-[10px] text-slate-500 font-semibold">58 Orders Processed</span>
                </Card>

                <Card className="p-6 bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Monthly Growth</span>
                  <div className="text-3xl font-black text-purple-400">+24.5%</div>
                  <span className="text-[10px] text-slate-500 font-semibold">User Base Expansion</span>
                </Card>
              </div>
            </div>
          )}
        </SectionWrapper>
      </Container>

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div
          onClick={() => setShowAddProductModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <Input
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <Input
                  label="Brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
                <Input
                  label="Stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
                <Input
                  label="Discount %"
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                />
              </div>

              <Input
                label="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="outline" type="button" onClick={() => setShowAddProductModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default AdminDashboard;
