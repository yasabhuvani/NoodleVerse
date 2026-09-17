import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag, MapPin, Award } from 'lucide-react';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
        {/* Celebration Header */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-3xl sm:text-4xl block mb-1">🎉</span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-2 font-medium">
            Your noodles are on their way to your taste buds! 🍜
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 text-left space-y-3.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-200">
            <span className="font-bold text-stone-500">Order ID</span>
            <span className="font-black text-stone-900 text-base">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Pickup Location</span>
            </span>
            <span className="font-bold text-stone-900 text-right">
              {order.pickupLocation}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-500">Total Amount</span>
            <span className="font-black text-stone-950 text-base">
              ₹{order.total}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-500">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-200">
              {order.status}
            </span>
          </div>

          {order.minimalPackaging && (
            <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <span>🌱</span>
              <span>Minimal/reusable eco packaging applied.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/orders"
            id="view-orders-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <Award className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/products"
            id="continue-shopping-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
