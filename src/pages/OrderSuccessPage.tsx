import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, Award, Clock, Ticket, Utensils } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OrderStatusStepper } from '../components/OrderStatusStepper';
import { orderService } from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const initialOrder = location.state?.order as Order | undefined;
  const [order, setOrder] = useState<Order | undefined>(initialOrder);

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(order.id, newStatus);
      setOrder({ ...updated });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const calculatedSubtotal = order.subtotal || order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const calculatedTaxes = order.taxes !== undefined ? order.taxes : Math.round(calculatedSubtotal * 0.05);
  const pickupToken = order.pickupToken || `NV-T${order.orderNumber.slice(-3) || '402'}`;
  const prepTime = order.estimatedPrepTime || '20–25 minutes';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 space-y-8">
        {/* Celebration Header - Feature 12 */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-base text-stone-600 font-semibold">
            Your noodles are being prepared.
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-800 text-xs sm:text-sm font-bold border border-orange-200 mt-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>Estimated preparation time: {prepTime}</span>
          </div>
        </div>

        {/* Order Status Stepper - Feature 13 */}
        <OrderStatusStepper
          status={order.status}
          onAdvanceStatus={handleStatusChange}
          showSimulateControl={true}
        />

        {/* Pickup Token Card */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-100 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5" />
              <span>Campus Pickup Token</span>
            </span>
            <p className="text-xs text-orange-100/90">
              Show this digital token at the counter when your bowl is ready:
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-center sm:text-right shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-widest block font-mono">
              {pickupToken}
            </span>
            <span className="text-[10px] uppercase font-bold text-orange-100">
              Order #{order.orderNumber}
            </span>
          </div>
        </div>

        {/* Comprehensive Order Summary - Feature 12 */}
        <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <span className="text-xs text-stone-500 font-bold block">Order ID</span>
              <span className="text-base font-black text-stone-900">
                #{order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 font-bold block">Mode Selected</span>
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span>Pickup ({order.pickupLocation})</span>
              </span>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Items Ordered
            </span>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b border-stone-100 last:border-0"
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.countryFlag || '🍜'}</span>
                    <span className="font-bold text-stone-900">{item.productName}</span>
                  </div>
                  {item.customDetails && (
                    <p className="text-[11px] text-stone-500 pl-6 leading-tight">
                      {item.customDetails}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-500 pl-6">
                    Qty: <strong className="text-stone-700">{item.quantity}</strong> × ₹{item.price}
                  </p>
                </div>
                <span className="font-bold text-stone-900 shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown: Subtotal, Taxes, Total */}
          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{calculatedSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST)</span>
              <span className="font-bold text-stone-900">₹{calculatedTaxes}</span>
            </div>
            <div className="flex justify-between">
              <span>Campus Delivery / Pickup Fee</span>
              <span className="font-bold text-emerald-600">₹0 (Free)</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-stone-900">Total</span>
              <span className="text-xl font-black text-stone-950">
                ₹{order.total || (calculatedSubtotal + calculatedTaxes)}
              </span>
            </div>
          </div>

          {order.minimalPackaging && (
            <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <span>🌱</span>
              <span>Eco Choice: Minimal reusable packaging applied.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/orders"
            id="view-orders-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <Award className="w-4 h-4" />
            <span>Track in My Orders</span>
          </Link>

          <Link
            to="/products"
            id="continue-shopping-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order More Noodles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
