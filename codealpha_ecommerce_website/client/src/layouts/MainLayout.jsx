import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import CompareBar from '../components/product/CompareBar';
import CompareModal from '../components/product/CompareModal';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <CompareModal />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
