import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, AlertCircle, MapPin, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';
import { EcoChoiceBanner } from '../components/EcoChoiceBanner';
import { FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    minimalPackaging,
    setMinimalPackaging,
    hasEcoItems,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateQty = async (cartItemId: string, newQty: number) => {
    try {
      setErrorMsg(null);
      await updateQuantity(cartItemId, newQty);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not update quantity.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon="🍜"
          title="Your bowl is empty!"
          description="Discover something delicious from across the world and add it to your cart."
          actionText="Explore Noodles"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {cart.reduce((total, i) => total + i.quantity, 0)} items in your bowl order
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Ordering</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm font-bold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sustainability Feature Section 28 */}
      {hasEcoItems && (
        <EcoChoiceBanner
          showPlantBasedMessage={true}
          minimalPackaging={minimalPackaging}
          onTogglePackaging={setMinimalPackaging}
          interactive={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const itemSubtotal = item.price * item.quantity;
            return (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.product.imageUrl || FALLBACK_NOODLE_IMAGE}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_NOODLE_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 flex-wrap">
                      <span>{item.product.countryFlag}</span>
                      <span>{item.product.cuisine}</span>
                      {(item.restaurantName || item.customDetails?.restaurantName || item.product.restaurantName) && (
                        <>
                          <span>•</span>
                          <span className="text-orange-700 font-extrabold inline-flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md">
                            <MapPin className="w-3 h-3 text-orange-600" />
                            <span>
                              {item.restaurantName || item.customDetails?.restaurantName || item.product.restaurantName}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 truncate mt-0.5">
                      {item.product.name}
                    </h3>

                    {item.product.customDetails ? (
                      <p className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
                        {item.product.customDetails}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-500">
                        {item.product.noodleType} • ₹{item.price} each
                      </p>
                    )}

                    {/* Stock Alert */}
                    {item.product.stock <= 3 && !item.product.isCustomBowl && (
                      <span className="text-[10px] font-bold text-amber-600 block mt-0.5">
                        Only {item.product.stock} available in stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs sm:text-sm font-black text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock && !item.product.isCustomBowl}
                      className="p-2 text-stone-600 hover:bg-stone-200 disabled:opacity-30 transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-xs text-stone-400 block sm:hidden">Subtotal</span>
                    <span className="text-base font-extrabold text-stone-950">
                      ₹{itemSubtotal}
                    </span>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup / Campus Handover</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              {minimalPackaging && (
                <div className="flex justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  <span>Eco Packaging</span>
                  <span className="font-bold">✓ Included</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-base font-black text-stone-900">Total</span>
              <span className="text-2xl font-black text-stone-950">
                ₹{cartTotal}
              </span>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={() => {
                if (!user) {
                  navigate('/login?redirect=/checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <p className="text-[11px] text-center text-stone-500">
                You'll be prompted to sign in or use the quick demo account.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
