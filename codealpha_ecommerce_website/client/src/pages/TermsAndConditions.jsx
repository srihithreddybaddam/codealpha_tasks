import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const TermsAndConditions = () => {
  return (
    <PageWrapper title="Terms & Conditions — Basketly">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]} />

        <SectionWrapper className="pt-4 pb-16 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <Card className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-6">
            <p>Welcome to Basketly. By accessing or using our platform, website, or mobile application, you agree to comply with all terms governing grocery orders, 10-minute doorstep deliveries, account usage, and payments.</p>
            <p>Basketly reserves the right to update product prices, promotional discounts, delivery fees, and terms of service at any time to maintain service quality and fresh delivery standards.</p>
          </Card>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default TermsAndConditions;
