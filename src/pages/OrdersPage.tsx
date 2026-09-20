import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Clock, MapPin, Package, ArrowRight, ShieldAlert, Ticket } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FlavorPassportCard } from '../components/FlavorPassportCard';
import { OrderStatusStepper } from '../components/OrderStatusStepper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'PLACED':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
          PLACED
        </span>
      );
    case 'PREPARING':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          PREPARING
        </span>
      );
    case 'READY_FOR_PICKUP':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          READY FOR PICKUP
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          COMPLETED
        </span>
      );
    default:
      return null;
  }
};

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await orderService.getOrders();
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <EmptyState
          icon="🔒"
          title="Sign in to View Orders"
          description="Please sign in with your account or use the quick demo login to access your order history and flavor passport."
          actionText="Sign In Now"
          actionLink="/login?redirect=/orders"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            My Orders & Culinary Journey
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Track past noodle orders, campus pickup statuses, and your global passport.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs sm:text-sm font-bold transition-colors w-fit"
        >
          <span>Order More Noodles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Flavor Passport Innovation Section (Section 27) */}
      <FlavorPassportCard orders={orders} />

      {/* Orders List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-stone-900">
          Order History ({orders.length})
        </h2>

        {loading ? (
          <LoadingSpinner message="Fetching your orders..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet."
            description="Your next delicious adventure starts here! Discover ramen, pad thai, pho, and more."
            actionText="Explore Noodles"
            actionLink="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-100 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-50 text-orange-600 font-black">
                      #{order.orderNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-stone-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {order.restaurantName && (
                        <div className="flex items-center gap-1.5 text-xs text-orange-700 font-extrabold mt-0.5">
                          <span>Prepared by:</span>
                          <span>{order.restaurantName}</span>
                          {order.restaurantLocation && (
                            <span className="text-stone-500 font-normal">({order.restaurantLocation})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.pickupToken && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-100/80 text-orange-900 font-mono font-bold text-xs border border-orange-200">
                        <Ticket className="w-3 h-3 text-orange-600" />
                        <span>Token: {order.pickupToken}</span>
                      </span>
                    )}
                    <span className="text-xs text-stone-500 font-medium">Status:</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Live Tracking Progress Bar / Stepper (Feature 13) */}
                <OrderStatusStepper
                  status={order.status}
                  onAdvanceStatus={(newStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                  showSimulateControl={true}
                />

                {/* Items in Order */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs sm:text-sm text-stone-800"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="text-base">{item.countryFlag}</span>
                        <span className="font-bold truncate">{item.productName}</span>
                        <span className="text-xs font-semibold text-stone-500">
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="font-extrabold text-stone-900 shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Pickup Location */}
                <div className="pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>
                      Pickup Location: <strong className="text-stone-900">{order.pickupLocation}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {order.minimalPackaging && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                        🌱 Eco Packaging
                      </span>
                    )}
                    <div className="text-right">
                      <span className="text-stone-400 mr-2">Total:</span>
                      <span className="text-base font-black text-stone-950">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
