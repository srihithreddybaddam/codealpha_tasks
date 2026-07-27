import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const RefundPolicy = () => {
  return (
    <PageWrapper title="Returns & Refund Policy — Basketly">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Refund Policy' }]} />

        <SectionWrapper className="pt-4 pb-16 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Returns & Refund Policy
          </h1>
          <Card className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-6">
            <p>At Basketly, we guarantee 100% fresh groceries and produce. If any item received is damaged or below quality expectations, we offer a 7-day no-questions-asked doorstep return & instant replacement policy.</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Return & Refund Process</h3>
            <p>Initiate a return request directly from your Basketly Orders history dashboard. Once verified by our delivery executive, your refund will be processed back to your original payment method or Basketly Wallet within 24 hours.</p>
          </Card>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default RefundPolicy;
