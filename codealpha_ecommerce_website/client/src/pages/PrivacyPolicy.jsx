import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const PrivacyPolicy = () => {
  return (
    <PageWrapper title="Privacy Policy — Basketly">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Privacy Policy' }]} />

        <SectionWrapper className="pt-4 pb-16 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <Card className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-6">
            <p className="font-semibold text-slate-900 dark:text-white">Last updated: July 2026</p>
            <p>At Basketly, we prioritize your data protection and privacy. All user authentication credentials and saved addresses are encrypted using industry-standard bcrypt algorithms and JWT session authorization.</p>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Data Collection & Protection</h3>
            <p>We do not sell or share personal identifying information with third parties. Data collected is strictly used to fulfill doorstep grocery orders, process payments securely, provide order tracking notifications, and enhance your Basketly shopping experience.</p>
          </Card>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default PrivacyPolicy;
