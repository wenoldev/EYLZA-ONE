import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { storeSlug } = useParams();
  const order = location.state?.order;
  const customer = location.state?.customer;
  const items = location.state?.items || order?.items || [];

  const storePrefix = storeSlug ? `/${storeSlug}` : '';

  return (
    <div className="min-h-[85vh] bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-100 text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight text-stone-900">
            Thank you for your order!
          </h1>
          <p className="text-stone-500 max-w-md mx-auto text-sm">
            We've received your order and are preparing it for shipment. A confirmation email has been sent to{' '}
            <span className="font-semibold text-stone-800">{customer?.email || 'your email'}</span>.
          </p>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-center gap-6 text-xs text-stone-500">
            <div>
              <span className="font-bold text-stone-400 uppercase tracking-wider block text-[10px]">Order ID</span>
              <span className="font-mono font-bold text-stone-800 text-sm">{order?.id || 'CONFIRMED'}</span>
            </div>
            <div>
              <span className="font-bold text-stone-400 uppercase tracking-wider block text-[10px]">Total Paid</span>
              <span className="font-bold text-stone-800 text-sm">₹{(order?.total_amount || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-bold text-stone-400 uppercase tracking-wider block text-[10px]">Status</span>
              <span className="font-bold text-emerald-600 uppercase text-xs">{order?.status || 'Paid'}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-lg font-serif font-bold italic text-stone-900 border-b border-stone-100 pb-4">
            Items Ordered
          </h2>

          <div className="divide-y divide-stone-100">
            {items.length > 0 ? (
              items.map((item: any, idx: number) => (
                <div key={item.id || idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                      <img
                        src={item.image || item.image_url || '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">{item.name || item.product_name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Quantity: {item.quantity}</p>
                      {item.attributes && (
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                          {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-900 font-mono">
                    ₹{((item.price || item.product_price || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-400 italic py-4">Order items confirmed and logged.</p>
            )}
          </div>

          {/* Delivery Details */}
          {customer && (
            <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  Delivery Address
                </span>
                <p className="font-bold text-stone-800 text-sm">{customer.name}</p>
                <p className="text-stone-600 leading-relaxed">{customer.address}</p>
                {customer.phone && <p className="text-stone-500">Phone: {customer.phone}</p>}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protection & Support
                </span>
                <p className="text-stone-600 leading-relaxed">
                  Your purchase is protected with SSL encryption and store verified fulfillment. For inquiries, reach out through our contact page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to={`${storePrefix}/products`}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            to={`${storePrefix}/account/orders`}
            className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-bold py-4 px-8 rounded-full text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
