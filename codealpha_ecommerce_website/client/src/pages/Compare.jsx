import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiColumns, FiShoppingBag, FiTrash2, FiPlus, FiArrowLeft, FiX } from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import CompareModal from '../components/product/CompareModal';
import ProductCard from '../components/product/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { useCompare } from '../contexts/CompareContext';

const Compare = () => {
  const navigate = useNavigate();
  const { compareItems, clearCompare } = useCompare();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') navigate('/');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <PageWrapper title="Product Comparison Tool">
      {/* Explicit top padding ensuring content is never hidden under sticky header or category sub-bar */}
      <Container className="pt-28 sm:pt-32 pb-16 space-y-8">
        {/* Navigation Control Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare Products' }]} />
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>Back to Store</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors cursor-pointer"
              title="Close Comparison"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FiColumns className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Product Specs Comparison
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Compare up to 4 items side-by-side on price, rating, features, and delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiTrash2 className="w-4 h-4" /> Clear Comparison
              </button>
            )}
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md"
            >
              <FiPlus className="w-4 h-4" /> Add Products
            </Link>
          </div>
        </div>

        {compareItems.length === 0 ? (
          <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 inline-flex items-center justify-center border border-slate-700">
              <FiColumns className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">No Products Selected for Comparison</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select the "Compare" checkbox on product cards in the marketplace store to compare prices, ratings, and features side-by-side.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
            >
              <FiShoppingBag className="w-4 h-4" /> Explore Marketplace Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {compareItems.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </Container>

      {/* Global Compare Specs Table Modal */}
      <CompareModal />
    </PageWrapper>
  );
};

export default Compare;
