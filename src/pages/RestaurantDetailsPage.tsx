import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Utensils,
  Flame,
  Leaf,
  Clock,
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { Restaurant, Product } from '../types';
import { restaurantService, productService } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RestaurantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const rest = await restaurantService.getRestaurantById(id);
        setRestaurant(rest);

        // Fetch products associated with this restaurant
        const allProducts = await productService.getProducts();
        const matched = allProducts.filter(
          (p) =>
            p.restaurantName.toLowerCase().includes(rest.name.toLowerCase()) ||
            rest.name.toLowerCase().includes(p.restaurantName.toLowerCase()) ||
            (rest.menuItemIds && rest.menuItemIds.includes(String(p.id)))
        );
        setMenuItems(matched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading restaurant kitchen details..." />;
  }

  if (!restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-900">Restaurant Not Found</h2>
        <p className="text-sm text-stone-600">The requested Hyderabad kitchen could not be located.</p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Link */}
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hyderabad Restaurants</span>
      </Link>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white border border-stone-800 shadow-xl">
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
          <div className="space-y-3 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NoodleVerse Demo Vendor</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                {restaurant.restaurantType}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-stone-900 text-xs font-black shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="text-stone-500">({restaurant.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed max-w-2xl">
              {restaurant.tagline}
            </p>

            {/* Location & Hours */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-orange-400">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{restaurant.location}</span>
              </span>
              {restaurant.openingHours && (
                <span className="flex items-center gap-1.5 text-stone-400">
                  <Clock className="w-4 h-4" />
                  <span>Open: {restaurant.openingHours}</span>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-amber-300 font-bold">
                Avg {restaurant.priceRange} • ₹{restaurant.approxCostForTwo} for two
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner: Build Custom Bowl with this Restaurant */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-orange-200">
            Craft Studio Integration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Build Your Bowl From {restaurant.name}
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            Customize your noodle base, broth, protein, veggies, and spice heat specifically prepared by this restaurant’s wok masters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/build-bowl?restaurantId=${restaurant.id}`)}
          className="px-6 py-3.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center gap-2"
        >
          <ChefHat className="w-4 h-4" />
          <span>Build Custom Bowl Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Kitchen Capabilities & Customization Options (Left) + Menu Items (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: About & Customization Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* About Kitchen Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              <span>About the Kitchen</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {restaurant.description}
            </p>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-2 text-xs">
              {restaurant.vegetarianAvailable && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vegetarian & Plant Broths</span>
                </span>
              )}
              {restaurant.veganAvailable && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vegan Friendly</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-900 rounded-xl font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Heat: {restaurant.spiceLevels.join(', ')}</span>
              </span>
            </div>
          </div>

          {/* Supported Customization Options Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <span>Custom Bowl Options at This Vendor</span>
            </h3>

            {/* Supported Noodles */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-600 block mb-2">
                Supported Noodles
              </span>
              <div className="grid grid-cols-1 gap-2">
                {restaurant.supportedNoodles.map((n) => (
                  <div
                    key={n.name}
                    className="p-3 rounded-xl border border-stone-100 bg-stone-50 flex items-center gap-3 text-xs"
                  >
                    <span className="text-2xl">{n.icon}</span>
                    <div>
                      <span className="font-extrabold text-stone-900 block">{n.name}</span>
                      <span className="text-stone-500 text-[11px]">{n.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Broths & Sauces */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-600 block mb-2">
                Signature Broths & Sauces
              </span>
              <div className="grid grid-cols-1 gap-2">
                {restaurant.supportedBroths.map((b) => (
                  <div
                    key={b.name}
                    className="p-3 rounded-xl border border-stone-100 bg-stone-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900">{b.name}</span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                          {b.type}
                        </span>
                      </div>
                      <span className="text-stone-500 text-[11px] block mt-0.5">{b.desc}</span>
                    </div>
                    {b.price > 0 && (
                      <span className="text-xs font-bold text-stone-700 shrink-0">+₹{b.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Proteins & Toppings */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-600 block mb-2">
                Proteins & Toppings
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {restaurant.supportedProteins.map((p) => (
                  <span
                    key={p.name}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-bold"
                  >
                    {p.icon} {p.name} {p.extraPrice > 0 ? `(+₹${p.extraPrice})` : ''}
                  </span>
                ))}
                {restaurant.supportedToppings.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-900 font-medium"
                  >
                    + {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Signature Menu Dishes Prepared by This Restaurant (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Signature Menu Dishes ({menuItems.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic catalog bowls prepared fresh at {restaurant.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/build-bowl?restaurantId=${restaurant.id}`)}
              className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>Build Custom Bowl</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {menuItems.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <p className="text-sm text-stone-500 font-medium mb-3">
                No pre-set menu dishes currently listed for this kitchen.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/build-bowl?restaurantId=${restaurant.id}`)}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                Create a Custom Bowl Instead
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {menuItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
