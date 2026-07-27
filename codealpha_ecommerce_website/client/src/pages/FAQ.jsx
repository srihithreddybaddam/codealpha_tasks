import React from 'react';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';

const FAQ = () => {
  const faqs = [
    {
      q: 'How does Basketly 10-minute delivery work?',
      a: 'Basketly operates a network of micro-warehouse dark stores inside your neighborhood. Once your order is confirmed, local store pickers pack your fresh basket within 2 minutes for immediate rider dispatch.',
    },
    {
      q: 'What is Basketly Pro membership?',
      a: 'Basketly Pro is our premium membership tier providing unlimited 100% free doorstep deliveries on orders above ₹199, priority express dispatch, zero handling charges, and exclusive 10% bonus discounts.',
    },
    {
      q: 'How does the Basketly Freshness Promise & 7-Day Returns work?',
      a: 'We inspect every item before packing into your basket. If any produce or product is damaged or below expectation, request an instant return or refund directly from your Orders history within 7 days.',
    },
    {
      q: 'What payment options are supported on Basketly?',
      a: 'Basketly supports Google Pay, PhonePe, Paytm UPI, Credit/Debit Cards, NetBanking, and Cash on Delivery (COD).',
    },
  ];

  return (
    <PageWrapper title="Frequently Asked Questions — Basketly">
      <Container>
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'FAQ & Support' }]} />

        <SectionWrapper className="pt-4 pb-16 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-slate-500">Everything you need to know about Basketly services & orders</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6 space-y-2 bg-slate-900 border border-slate-800 text-left">
                <h3 className="text-base font-extrabold text-white">{faq.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default FAQ;
