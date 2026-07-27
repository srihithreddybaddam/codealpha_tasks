import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiChevronDown,
  FiShield,
  FiAward,
  FiHelpCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiTag,
  FiLock,
} from 'react-icons/fi';
import PageWrapper from '../components/common/PageWrapper';
import Container from '../components/common/Container';
import SectionWrapper from '../components/common/SectionWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const faqItems = [
  {
    question: 'Where is my order?',
    answer:
      'You can track your live order progress in real time by navigating to "My Orders" in your profile menu. Our 10-minute hyperlocal delivery tracker provides live dark store dispatch timestamps.',
  },
  {
    question: 'How can I cancel an order?',
    answer:
      'Orders can be cancelled directly from the "My Orders" section before the status advances to "Out For Delivery". Instant refunds are initiated automatically for paid orders.',
  },
  {
    question: 'How do I request a return?',
    answer:
      'Navigate to your Order History, select the relevant item, and click "Request Return". Fresh produce and groceries have a 7-day return window, while household goods are eligible for 14 days.',
  },
  {
    question: 'When will I receive my refund?',
    answer:
      'Refunds are processed back to your original payment method (UPI, Debit/Credit Card, or Net Banking) within 2 to 5 business days following quality verification.',
  },
  {
    question: 'How do I upgrade to Pro Membership?',
    answer:
      'Go to the Membership page in Settings (/membership) and select either Pro Monthly (₹59/mo) or Pro Yearly (₹999/yr) to activate 10-minute express queues and exclusive discounts.',
  },
  {
    question: 'How can I update my delivery address?',
    answer:
      'You can manage, edit, or add new delivery addresses in your Profile settings or directly on the Checkout screen using the "Select / Add Address" modal.',
  },
];

const subjectOptions = [
  'Order Support',
  'Delivery Issue',
  'Payment Query',
  'Product Information',
  'Returns & Refunds',
  'Technical Support',
  'Membership Enquiry',
  'Business Partnership',
  'Feedback',
  'Other',
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Support',
    customSubject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First FAQ expanded by default

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    if (formData.subject === 'Other' && !formData.customSubject.trim()) {
      setError('Please specify the subject of your enquiry.');
      return;
    }

    const generatedTicket = `TKT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setSubmitted(true);
    setError('');
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <PageWrapper title="Contact Support & Customer Care">
      <Container className="py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact Support' }]} />

        <SectionWrapper className="pt-4 pb-16 space-y-16">
          
          {/* HEADER HERO SECTION */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl text-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-extrabold tracking-wide uppercase">
                <FiHelpCircle className="w-4 h-4 text-amber-400" />
                <span>24/7 CUSTOMER SUPPORT & HELP DESK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                We're Here to Help — Get in Touch
              </h1>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Have questions about your 10-minute grocery delivery, order status, returns, or Pro Membership? Our dedicated customer care team is available 7 days a week.
              </p>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: SUPPORT INFO CARDS */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card 1: Email Support */}
              <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-indigo-500/50 hover:shadow-lg transition-all group">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <FiMail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Email Support
                  </span>
                  <h3 className="text-base font-black text-white">support@basketly.in</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instant help for order status, inquiries & feedback.
                  </p>
                </div>
              </Card>

              {/* Card 2: Toll-Free Phone Support */}
              <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Toll-Free Customer Care
                  </span>
                  <h3 className="text-base font-black text-white">1800-123-4567</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mon – Sun: 8:00 AM – 10:00 PM IST
                  </p>
                </div>
              </Card>

              {/* Card 3: Response Time */}
              <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-amber-500/50 hover:shadow-lg transition-all group">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <FiClock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Fast Response Time
                  </span>
                  <h3 className="text-base font-black text-white">Usually within 24 hours</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    98.4% of support tickets resolved on first contact.
                  </p>
                </div>
              </Card>

              {/* Card 4: Corporate Office */}
              <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-cyan-500/50 hover:shadow-lg transition-all group">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Corporate Headquarters
                  </span>
                  <h3 className="text-base font-black text-white">Jubilee Hills, Hyderabad, India</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Plot No. 402, Road No. 36, Telangana - 500033
                  </p>
                </div>
              </Card>

              {/* Card 5: Live Chat (Coming Soon) */}
              <Card className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-4 opacity-90">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FiMessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      24/7 AI Live Chat
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-extrabold text-[9px] uppercase tracking-wider border border-purple-500/30">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-300">Instant AI Support Assistant</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    24/7 instant chat agent arriving in our next release.
                  </p>
                </div>
              </Card>

            </div>

            {/* RIGHT COLUMN: GLASSMORPHIC CONTACT FORM */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/90 border border-slate-700/60 rounded-[24px] p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
                
                <div className="border-b border-slate-800 pb-4 space-y-1">
                  <h2 className="text-2xl font-black text-white">Send Us a Message</h2>
                  <p className="text-xs text-slate-400">
                    Fill out the form below and our support specialists will get back to you shortly.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold leading-relaxed flex items-center gap-3 animate-fade-in">
                    <FiAlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {submitted ? (
                  <div className="py-8 text-center space-y-5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <FiCheckCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                        TICKET REF #{ticketId}
                      </span>
                      <h3 className="text-2xl font-black text-white">Message Submitted Successfully!</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        Thank you! Your message has been submitted successfully. Our support team will review your enquiry and contact you shortly.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            subject: 'Order Support',
                            customSubject: '',
                            message: '',
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Full Name *</label>
                        <div className="relative flex items-center">
                          <FiUser className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                          <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Email Address *</label>
                        <div className="relative flex items-center">
                          <FiMail className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone Number & Subject Dropdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Phone Number (Optional)</label>
                        <div className="relative flex items-center">
                          <FiPhone className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your mobile number (optional)"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Enquiry Subject *</label>
                        <div className="relative flex items-center">
                          <FiTag className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl pl-10 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                          >
                            {subjectOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate-900 text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Custom Subject (Shown when 'Other' is selected) */}
                    {formData.subject === 'Other' && (
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="text-xs font-bold text-slate-300 block">Custom Subject *</label>
                        <input
                          type="text"
                          name="customSubject"
                          placeholder="Select or enter the subject of your enquiry"
                          value={formData.customSubject}
                          onChange={handleChange}
                          required
                          className="w-full h-[48px] bg-slate-800/90 border border-slate-700/80 text-white rounded-xl px-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    )}

                    {/* Message Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Your Message *</label>
                      <textarea
                        name="message"
                        rows="4"
                        placeholder="Tell us how we can assist you today..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-800/90 border border-slate-700/80 text-white rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full h-[48px] rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Submit Support Request</span>
                      <FiSend className="w-4 h-4" />
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* TRUST BADGES SECTION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FiLock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-extrabold">✓ Secure Communication</strong>
                <span className="text-[11px] text-slate-400">256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-extrabold">✓ Fast Customer Support</strong>
                <span className="text-[11px] text-slate-400">First Response &lt; 24h</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-extrabold">✓ Trusted by Thousands</strong>
                <span className="text-[11px] text-slate-400">Over 50,000+ Customers</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FiShield className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-extrabold">✓ Privacy Protected</strong>
                <span className="text-[11px] text-slate-400">Zero Spam Guarantee</span>
              </div>
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION SECTION */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                <FiHelpCircle className="text-indigo-400" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Have Questions? We Have Answers</h2>
              <p className="text-xs text-slate-400">
                Quick answers to common questions about orders, deliveries, returns, and membership.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <Card
                    key={idx}
                    className={`border transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-slate-900 border-indigo-500/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-sm font-extrabold text-white">{item.question}</span>
                      <div
                        className={`p-1.5 rounded-full bg-slate-800 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-400 bg-indigo-500/10' : ''
                        }`}
                      >
                        <FiChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 animate-fade-in">
                        {item.answer}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

        </SectionWrapper>
      </Container>
    </PageWrapper>
  );
};

export default Contact;
