import React from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <PageWrapper title={`Order #${id || 'Receipt'}`}>
      <Container>
        <Breadcrumb items={[{ label: 'Orders', path: '/orders' }, { label: `Order #${id}` }]} />

        <SectionWrapper className="pt-4 pb-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Order Receipt #{id}
              </h1>
              <p className="text-xs text-slate-500 mt-1">Payment Processed • July 20, 2026</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full self-start">
              <FiCheckCircle /> Status: Confirmed & Shipped
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                <FiMapPin /> Shipping Address
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                123 Silicon Valley Blvd, Suite 400<br />
                San Francisco, CA 94107
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs">
                <FiTruck /> Logistics Partner
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Basketly Express Priority<br />
                Tracking: #ATH-8849-US
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                <FiCreditCard /> Payment Method
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Visa Ending in •••• 4242<br />
                Total Paid: $793.99
              </p>
            </Card>
          </div>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default OrderDetails;
