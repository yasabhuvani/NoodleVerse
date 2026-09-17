import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, Banknote, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { PickupLocation, PaymentMethod } from '../types';
import { orderService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { EcoChoiceBanner } from '../components/EcoChoiceBanner';

const PICKUP_LOCATIONS: PickupLocation[] = [
  'Campus Food Court',
  'Main Gate',
  'Hostel',
  'Library',
  'Student Activity Centre',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, minimalPackaging, setMinimalPackaging, hasEcoItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState<PickupLocation>('Campus Food Court');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DEMO_PAYMENT');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Require auth and non-empty cart
  if (!user) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const placedOrder = await orderService.placeOrder({
        pickupLocation,
        paymentMethod,
        minimalPackaging,
        user,
      });

      clearCart();
      navigate('/order-success', { state: { order: placedOrder } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check stock availability.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-stone-200">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
          Final Step
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Checkout & Pickup Details
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Review your bowl selection, select campus pickup spot, and complete demo payment.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm font-bold text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sustainability Banner */}
      {hasEcoItems && (
        <EcoChoiceBanner
          showPlantBasedMessage={true}
          minimalPackaging={minimalPackaging}
          onTogglePackaging={setMinimalPackaging}
          interactive={true}
        />
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pickup & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pickup Location Selector */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>1. Select Campus Pickup Location</span>
            </h2>

            <div className="space-y-2.5">
              {PICKUP_LOCATIONS.map((loc) => {
                const isSelected = pickupLocation === loc;
                return (
                  <label
                    key={loc}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-300 font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pickupLocation"
                        value={loc}
                        checked={isSelected}
                        onChange={() => setPickupLocation(loc)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs sm:text-sm text-stone-900">{loc}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Free Pickup
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <span>2. Select Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Demo Payment */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'DEMO_PAYMENT'
                    ? 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-300'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">⚡</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="DEMO_PAYMENT"
                    checked={paymentMethod === 'DEMO_PAYMENT'}
                    onChange={() => setPaymentMethod('DEMO_PAYMENT')}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-stone-900 block">
                    Demo Instant Payment
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Simulates instant 100% verified test transaction.
                  </span>
                </div>
              </label>

              {/* Cash on Pickup */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'CASH_ON_PICKUP'
                    ? 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-300'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💵</span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_PICKUP"
                    checked={paymentMethod === 'CASH_ON_PICKUP'}
                    onChange={() => setPaymentMethod('CASH_ON_PICKUP')}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-stone-900 block">
                    Cash on Pickup
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Pay at the food counter when picking up your bowl.
                  </span>
                </div>
              </label>
            </div>

            {paymentMethod === 'DEMO_PAYMENT' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Demo payment simulated successfully. No real money or card details required.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Review
            </h2>

            {/* List of items */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-stone-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-extrabold text-stone-900 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Fee</span>
                <span className="font-bold text-emerald-600">₹0 (Free)</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-stone-900">Grand Total</span>
                <span className="text-2xl font-black text-stone-950">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              id="place-order-btn"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-extrabold text-sm sm:text-base text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                submitting
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 active:scale-95 shadow-orange-600/25'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Verifying Stock & Placing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Place Order • ₹{cartTotal}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-stone-400 leading-tight">
              By placing your order, stock is automatically reserved and reduced in the database.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
