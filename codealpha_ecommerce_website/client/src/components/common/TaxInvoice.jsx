import React from 'react';
import { FiPrinter, FiDownload, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import BasketlyLogo from './BasketlyLogo';

const TaxInvoice = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = `INV-2026-${(order._id || 'BSKT1001').substring(0, 6).toUpperCase()}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 my-auto print:p-0 print:shadow-none print:w-full">
        {/* Action Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5" /> Tax Invoice Generated
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <FiPrinter className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div className="pt-6 space-y-6">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="mb-2">
                <BasketlyLogo size="lg" clickable={false} />
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">Basketly Supermarket Retail India Pvt Ltd</p>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                Plot No. 402, Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033
              </p>
              <p className="text-[11px] text-slate-500 font-mono">GSTIN: 36AAACB0000B1Z5 | FSSAI: 13621011000452</p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">TAX INVOICE</h2>
              <p className="font-mono text-slate-600"><strong>Invoice No:</strong> {invoiceNo}</p>
              <p className="font-mono text-slate-600"><strong>Order ID:</strong> #{order._id}</p>
              <p className="text-slate-600"><strong>Invoice Date:</strong> {orderDate}</p>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] block">
                Billed To & Shipping Address:
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{order.shippingAddress?.fullName || 'Valued Customer'}</p>
              <p className="text-slate-600">{order.shippingAddress?.houseNo}, {order.shippingAddress?.street}</p>
              <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong></p>
              <p className="text-slate-600">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] block">
                Payment Details:
              </span>
              <p className="text-slate-700"><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'UPI / ONLINE'}</p>
              <p className="text-slate-700"><strong>Payment Status:</strong> <span className="text-emerald-600 font-bold">PAID (CONFIRMED)</span></p>
              <p className="text-slate-700"><strong>Delivery Mode:</strong> 10-Minute Express Hyperlocal</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-300">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {(order.items || []).map((item, idx) => {
                  const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                  return (
                    <tr key={item._id || idx}>
                      <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold block">{item.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{item.category}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{itemPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold font-mono">
                        ₹{(itemPrice * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-slate-200 gap-4">
            <div className="text-[11px] text-slate-500 max-w-xs space-y-1">
              <p className="font-bold text-slate-700">Terms & Declaration:</p>
              <p>Goods once sold are covered under Basketly's 7-Day Doorstep Replacement Guarantee. This is a computer generated invoice and requires no signature.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-900">₹{(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {(order.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span className="font-mono">-₹{(order.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-mono font-bold text-slate-900">
                  {order.shipping === 0 ? 'FREE' : `₹${(order.shipping || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Handling Charge</span>
                <span className="font-mono font-bold text-slate-900">₹{(order.handlingFee || 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Grand Total</span>
                <span className="text-emerald-600 font-mono">₹{(order.grandTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInvoice;
