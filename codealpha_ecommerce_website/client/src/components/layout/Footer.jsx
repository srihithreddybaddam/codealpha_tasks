import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiLock,
  FiZap,
} from 'react-icons/fi';
import Container from '../common/Container';
import BasketlyLogo from '../common/BasketlyLogo';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors duration-300">
      {/* 1. WHY SHOP WITH US HIGHLIGHTS BAR */}
      <div className="border-b border-slate-800 py-10 bg-slate-900/60">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FiTruck className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">10-Min Express</h4>
              <p className="text-[11px] text-slate-400">Hyperlocal dark store dispatch</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FiShield className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">100% Quality Fresh</h4>
              <p className="text-[11px] text-slate-400">Doorstep quality check</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FiRefreshCw className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">7-Day Easy Return</h4>
              <p className="text-[11px] text-slate-400">Instant refund verification</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FiLock className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">Secure Payments</h4>
              <p className="text-[11px] text-slate-400">UPI, Cards, NetBanking, COD</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <FiHeadphones className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">24/7 Support</h4>
              <p className="text-[11px] text-slate-400">Instant chat & call care</p>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FiZap className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-extrabold text-white">Free Over ₹199</h4>
              <p className="text-[11px] text-slate-400">Zero delivery charges</p>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. MAIN FOOTER NAVIGATION LINKS */}
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BasketlyLogo size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Basketly is your trusted online destination for fresh groceries, daily essentials, premium household products, and fast doorstep delivery.
            </p>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest block">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['Alphonso Mangoes', 'Basmati Rice', 'Cold Pressed Oil', 'A2 Gir Cow Ghee', 'Dry Fruits', 'Organic Honey'].map((s) => (
                  <Link key={s} to={`/products?search=${encodeURIComponent(s)}`} className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {['Fresh Fruits', 'Vegetables', 'Grocery Essentials', 'Organic Foods', 'Bakery Items', 'Dairy Products', 'Snacks', 'Beverages'].map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-emerald-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Policy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQs & Support</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-emerald-400 transition-colors">Shipping & 10-Min Delivery</Link></li>
              <li><Link to="/refund-policy" className="hover:text-emerald-400 transition-colors">7-Day Returns & Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Col 4: App Download & Partner Placeholder */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Download App
            </h4>
            <p className="text-xs text-slate-400">
              Get instant 10-minute grocery delivery on iOS & Android.
            </p>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-emerald-500 flex items-center justify-center gap-2 cursor-pointer">
                <span> App Store (iOS)</span>
              </button>
              <button className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-emerald-500 flex items-center justify-center gap-2 cursor-pointer">
                <span>▶ Google Play Store</span>
              </button>
            </div>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <span className="block text-slate-300 font-bold">Partner With Us:</span>
              <span className="block hover:text-emerald-400 cursor-pointer">Become a Basketly Seller</span>
              <span className="block hover:text-emerald-400 cursor-pointer">Careers at Basketly</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 3. COPYRIGHT & BOTTOM BAR */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Basketly Supermarket. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🇮🇳 Freshness Delivered Daily</span>
            <span>•</span>
            <span>256-Bit SSL Encryption</span>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
