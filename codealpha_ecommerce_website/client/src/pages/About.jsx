import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTarget,
  FiAward,
  FiClock,
  FiShield,
  FiRefreshCw,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiTruck,
  FiFeather,
  FiTag,
  FiLayers,
  FiTrendingUp,
  FiHelpCircle,
  FiSmile,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const statsData = [
  { label: 'Curated Products', value: '1,000+', icon: FiLayers, color: 'text-emerald-400' },
  { label: 'Happy Families', value: '25,000+', icon: FiSmile, color: 'text-cyan-400' },
  { label: 'Product Categories', value: '16+', icon: FiTag, color: 'text-blue-400' },
  { label: 'On-Time Delivery Rate', value: '99.8%', icon: FiClock, color: 'text-amber-400' },
  { label: 'Customer Care', value: '24/7 Care', icon: FiHelpCircle, color: 'text-purple-400' },
];

const featuresData = [
  {
    title: 'Fresh Farm Produce',
    desc: 'Sourced daily from organic partner farms to guarantee peak freshness, crisp taste, and nutrition.',
    icon: FiFeather,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'Fast Doorstep Delivery',
    desc: 'Powered by hyperlocal dark store fulfillment nodes for ultra-fast 10-minute doorstep arrival.',
    icon: FiClock,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    title: 'Trusted Quality Inspection',
    desc: 'Every item undergoes strict 3-stage quality checks before being packed into your basket.',
    icon: FiShield,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: '7-Day Easy Returns',
    desc: 'Zero-friction doorstep returns and instant refund processing on all eligible grocery goods.',
    icon: FiRefreshCw,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    title: 'Best Price Guarantee',
    desc: 'Direct farm pricing with daily deals, coupons, and member discounts to maximize household savings.',
    icon: FiTag,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    title: '1,000+ Supermarket Items',
    desc: 'Wide range across fresh fruits, vegetables, dairy, bakery, snacks, staples, and home care.',
    icon: FiLayers,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
];

const valuesData = [
  {
    title: 'Customer First',
    desc: 'Every feature and delivery decision begins with putting our shoppers first.',
    icon: FiHeart,
    color: 'text-rose-400',
  },
  {
    title: 'Freshness Promise',
    desc: '100% farm-checked produce with guaranteed freshness or immediate replacement.',
    icon: FiShield,
    color: 'text-emerald-400',
  },
  {
    title: 'Sustainability',
    desc: '100% bio-degradable eco carry bags and optimized delivery routes to reduce carbon footprint.',
    icon: FiFeather,
    color: 'text-cyan-400',
  },
  {
    title: 'Hyperlocal Speed',
    desc: 'Pioneering micro-warehouse dark stores to deliver groceries right when you need them.',
    icon: FiTruck,
    color: 'text-amber-400',
  },
  {
    title: 'Uncompromising Quality',
    desc: 'Consistently fresh quality, accurate orders, and dependable doorstep service.',
    icon: FiCheckCircle,
    color: 'text-blue-400',
  },
];

const timelineData = [
  {
    year: '2024',
    title: 'Basketly Founded',
    desc: 'Basketly was established with a vision to transform daily grocery shopping into a seamless digital experience.',
  },
  {
    year: '2025',
    title: '1,000+ Product Catalog',
    desc: 'Expanded catalog to 16 categories by partnering with local organic farms and top supermarkets.',
  },
  {
    year: '2025',
    title: '10-Minute Dark Stores',
    desc: 'Launched hyperlocal micro-fulfillment centers, achieving sub-10-minute average delivery speeds.',
  },
  {
    year: '2026',
    title: 'Basketly Pro Membership',
    desc: 'Introduced Basketly Pro membership benefits, eco carry bag initiatives, and 24/7 customer care.',
  },
  {
    year: 'Future',
    title: 'Smart Pantry Subscriptions',
    desc: 'Pioneering automated pantry replenishments and eco-friendly electric delivery fleets.',
  },
];

const About = () => {
  return (
    <PageWrapper title="About Basketly — Freshness Delivered Daily">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About Basketly' }]} />

        <SectionWrapper className="pt-4 pb-16 space-y-16">
          
          {/* 1. HERO SECTION */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[420px] flex items-center p-8 sm:p-14">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80"
              alt="Basketly Fresh Produce Hero"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wide">
                <FiShoppingBag className="w-4 h-4 fill-current" />
                <span>ABOUT BASKETLY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Freshness Delivered Daily, Right to Your Doorstep.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                Basketly is India's trusted online destination for fresh groceries, daily essentials, premium household products, and fast 10-minute doorstep delivery.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="primary" size="lg" icon={FiArrowRight} className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400">
                    Explore Basketly Store
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. OUR STORY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <FiTarget className="text-emerald-400" />
                <span>OUR MISSION & VISION</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Bringing Freshness Home to Every Family
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Basketly was born from a simple mission: everyday grocery shopping should be effortless, fresh, and lightning-fast. Traditional supermarkets require long travel times and crowded checkout queues, while traditional online deliveries often suffer from delayed dispatches.
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We re-engineered the entire fulfillment chain by placing micro-warehouses (Dark Stores) directly inside communities. By combining direct farm sourcing with sub-10-minute dispatch routing, Basketly delivers fresh fruits, organic vegetables, dairy, and essential household staples right when you need them.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <FiCheckCircle className="text-emerald-400 w-4 h-4 flex-shrink-0" />
                  <span>Direct Farm Sourcing</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <FiCheckCircle className="text-blue-400 w-4 h-4 flex-shrink-0" />
                  <span>100% Quality Inspected</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80"
                  alt="Basketly Supermarket & Fresh Produce"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-xs text-slate-200">
                  <span className="font-extrabold text-white block text-sm">Basketly Dark Store Hub</span>
                  <span>Hyperlocal dark stores ensuring sub-10-minute doorstep arrival.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACHIEVEMENTS / STATS COUNTER */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statsData.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2 hover:border-slate-700 transition-all">
                  <Icon className={`w-6 h-6 mx-auto ${stat.color}`} />
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">{stat.value}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* 4. WHY BASKETLY (FEATURE CARDS) */}
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <FiAward className="text-amber-400" />
                <span>WHY BASKETLY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Why Customers Trust Basketly</h2>
              <p className="text-xs text-slate-400">
                Built on high speed, transparent pricing, and zero-compromise freshness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuresData.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="p-6 space-y-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all group">
                    <div className={`p-3.5 rounded-xl border w-fit group-hover:scale-110 transition-transform ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 5. OUR CORE VALUES */}
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <FiHeart className="text-rose-400" />
                <span>OUR CORE VALUES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Driven by Principles</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {valuesData.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <Card key={idx} className="p-5 bg-slate-900 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all text-center">
                    <div className="p-3 rounded-xl bg-slate-800/80 w-fit mx-auto">
                      <Icon className={`w-5 h-5 ${val.color}`} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{val.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{val.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 6. TIMELINE */}
          <div className="space-y-8 pt-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <FiTrendingUp className="text-cyan-400" />
                <span>JOURNEY & MILESTONES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Our Growth Story</h2>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {timelineData.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative hover:border-emerald-500/50 transition-all">
                  <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                    {step.year}
                  </span>
                  <h4 className="text-xs font-black text-white">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. BRAND PHILOSOPHY QUOTE */}
          <Card className="p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-slate-800 text-center space-y-4 rounded-3xl shadow-xl">
            <FiShoppingBag className="w-8 h-8 text-emerald-400 mx-auto fill-current" />
            <blockquote className="text-base sm:text-xl font-extrabold text-white max-w-2xl mx-auto leading-relaxed italic">
              "Freshness is not a luxury. It is a fundamental right. At Basketly, we work every day to deliver farm-fresh produce and groceries with unyielding speed and care."
            </blockquote>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              — Basketly Brand Promise
            </p>
          </Card>

          {/* 8. CALL TO ACTION Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 border border-emerald-800/80 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Experience Basketly 10-Minute Delivery</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Join over 25,000+ satisfied households enjoying fresh doorstep groceries today.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/products">
                <Button variant="primary" size="md" icon={FiArrowRight} className="bg-emerald-600 hover:bg-emerald-500">
                  Explore Store
                </Button>
              </Link>
              <Link to="/membership">
                <Button variant="outline" size="md" className="border-emerald-400/50 text-emerald-300 hover:bg-emerald-900/40">
                  Become a Basketly Pro Member
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="md" className="bg-slate-800 text-slate-200 hover:bg-slate-700">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default About;
