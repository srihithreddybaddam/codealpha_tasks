import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const ShippingPolicy = () => {
  return (
    <PageWrapper title="Shipping & 10-Min Delivery — Basketly">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Shipping Policy' }]} />

        <SectionWrapper className="pt-4 pb-16 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            10-Minute Doorstep Delivery Policy
          </h1>
          <Card className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-6">
            <p>Basketly operates a network of hyperlocal dark store micro-warehouses situated directly inside metropolitan neighborhoods. Every order placed is dispatched within 2 minutes for an average doorstep arrival of 10 minutes.</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Free Delivery Terms</h3>
            <p>Orders over ₹199 or placed by Basketly Pro Members automatically qualify for 100% Free Doorstep Delivery with zero surge charges.</p>
          </Card>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default ShippingPolicy;
