import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Sparkles, Globe2, Flame, Leaf, Compass, Store, MapPin } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/api';
import { HYDERABAD_RESTAURANTS } from '../data/restaurantsData';
import { RestaurantCard } from '../components/RestaurantCard';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

const COUNTRY_SHOWCASE = [
  { country: 'Japan', flag: '🇯🇵', dishes: 'Ramen • Udon • Soba', count: '4+ Styles' },
  { country: 'Korea', flag: '🇰🇷', dishes: 'Ramyeon • Japchae • Jajangmyeon', count: '3+ Styles' },
  { country: 'China', flag: '🇨🇳', dishes: 'Chow Mein • Dan Dan • Lo Mein', count: '3+ Styles' },
  { country: 'Thailand', flag: '🇹🇭', dishes: 'Pad Thai • Pad See Ew', count: '2+ Styles' },
  { country: 'India', flag: '🇮🇳', dishes: 'Hakka • Schezwan • Masala Noodles', count: '3+ Styles' },
];

const EXPLORE_COUNTRIES = [
  { name: 'Japan', flag: '🇯🇵', desc: 'Ramen, Udon & Soba traditions' },
  { name: 'Korea', flag: '🇰🇷', desc: 'Spicy ramyeon & savory black bean noodles' },
  { name: 'China', flag: '🇨🇳', desc: 'Hand-pulled lamian & Sichuan spicy noodles' },
  { name: 'Thailand', flag: '🇹🇭', desc: 'Tamarind Pad Thai & Khao Soi curry' },
  { name: 'Vietnam', flag: '🇻🇳', desc: 'Aromatic star-anise herbal Pho & Bun Bo Hue' },
  { name: 'Taiwan', flag: '🇹🇼', desc: 'Legendary braised beef noodle soup' },
  { name: 'Italy', flag: '🇮🇹', desc: 'Artisanal bronze-die pasta & truffle ribbons' },
  { name: 'India', flag: '🇮🇳', desc: 'Zesty Indo-Chinese Hakka & Schezwan' },
  { name: 'Indonesia', flag: '🇮🇩', desc: 'Sweet-savory Mie Goreng & sambal' },
  { name: 'Malaysia', flag: '🇲🇾', desc: 'Golden curry Laksa & Char Kway Teow' },
  { name: 'Singapore', flag: '🇸🇬', desc: 'Aromatic curried vermicelli Mei Fun' },
  { name: 'Philippines', flag: '🇵🇭', desc: 'Celebration Pancit Canton & citrus calamansi' },
];

const POPULAR_TYPES = [
  { type: 'Ramen', icon: '🍜', desc: 'Springy Japanese broth noodles' },
  { type: 'Tsukemen', icon: '🥢', desc: 'Dense dipping broth noodles' },
  { type: 'Udon', icon: '🥢', desc: 'Thick chewy wheat noodles' },
  { type: 'Soba', icon: '🥢', desc: 'Earthy buckwheat noodles' },
  { type: 'Hand-Pulled Noodles', icon: '🍜', desc: 'Fresh Lanzhou style noodles' },
  { type: 'Rice Noodles', icon: '🍚', desc: 'Silky gluten-free noodles' },
  { type: 'Egg Noodles', icon: '🍜', desc: 'Crispy wok-tossed noodles' },
  { type: 'Pasta / Artisanal', icon: '🍝', desc: 'Bronze-die extruded ribbons' },
];

export const HomePage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingFilter, setTrendingFilter] = useState<'ALL' | 'SPICY' | 'RAMEN' | 'VEG'>('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const all = await productService.getProducts();
        setAllProducts(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Curated trending products in popularity order
  const trendingIds = ['4', '3', '7', '6', '9', '2', '1', '10'];
  const trendingProductsBase = trendingIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const filteredTrending = trendingProductsBase.filter((product) => {
    if (trendingFilter === 'SPICY') {
      return product.spiceLevel === 'HOT' || product.spiceLevel === 'EXTRA_HOT' || product.spiceLevel === 'MEDIUM';
    }
    if (trendingFilter === 'VEG') {
      return product.dietType === 'VEGETARIAN' || product.dietType === 'VEGAN';
    }
    if (trendingFilter === 'RAMEN') {
      return (
        product.noodleType.toLowerCase().includes('ramen') ||
        product.noodleType.toLowerCase().includes('ramyeon')
      );
    }
    return true;
  }).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/90 via-amber-50/40 to-transparent pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs sm:text-sm font-bold shadow-xs">
                <span>🔥</span>
                <span>The Global Noodle & Ramen Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.15]">
                Taste the World, <br />
                <span className="text-orange-600">One Noodle</span> at a Time.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                From Japanese ramen to Thai Pad Thai and Indian Hakka noodles, discover authentic, handcrafted noodle dishes from across the globe — customized and delivered to your favorite campus pickup spot.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/products"
                  id="hero-explore-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base shadow-lg shadow-orange-600/25 transition-all hover:-translate-y-0.5"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore Noodles</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/build-bowl"
                  id="hero-build-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-300 hover:border-orange-500 font-extrabold text-base shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Utensils className="w-5 h-5 text-orange-600" />
                  <span>Build Your Bowl</span>
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="pt-4 grid grid-cols-3 gap-2 border-t border-stone-200/80 max-w-md mx-auto lg:mx-0 text-stone-600 text-xs font-semibold">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <span className="text-orange-600">✓</span> 10+ Cuisines
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <span className="text-orange-600">✓</span> Live Bowl Builder
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <span className="text-orange-600">✓</span> Eco Packaging
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious Bowl of Global Ramen"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Tag 1 */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-stone-200 flex items-center gap-3">
                  <span className="text-2xl">🇯🇵</span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block leading-tight">
                      Artisanal Miso & Shoyu
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Fresh daily broths from ₹229
                    </span>
                  </div>
                </div>

                {/* Floating Tag 2 */}
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-3.5 py-1.5 rounded-xl shadow-md text-xs font-extrabold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Favorite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 51: IMPORTANT COMPETITION FEATURE - ONE WORLD. MANY NOODLES. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800 text-white">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-500/30">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Global Diversity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              🌎 One World. Many Noodles.
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2">
              Every country has poured its culture, geography, and heart into the craft of the noodle bowl. Discover their signature traditions below:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {COUNTRY_SHOWCASE.map((item) => (
              <div
                key={item.country}
                onClick={() => navigate(`/products?cuisine=${item.country}`)}
                className="group p-5 rounded-2xl bg-stone-800/70 border border-stone-700/70 hover:border-orange-500/80 hover:bg-stone-800 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{item.flag}</span>
                    <span className="text-[11px] font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/40">
                      {item.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">
                    {item.country}
                  </h3>
                  <p className="text-xs text-stone-300 font-medium mt-1 leading-relaxed">
                    {item.dishes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-700/50 flex items-center text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore {item.country}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOODLE RESTAURANTS IN HYDERABAD MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-2 border border-orange-200">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Hyderabad Restaurant Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              Explore Restaurants in Hyderabad
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              Discover noodle & Asian restaurants near you in Hyderabad. Pick a kitchen to prepare your custom artisan bowl or order their signature noodle bowls.
            </p>
          </div>

          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0"
          >
            <Store className="w-4 h-4 text-orange-400" />
            <span>View All Hyderabad Kitchens</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HYDERABAD_RESTAURANTS.slice(0, 3).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {/* Quick Area Jump Pills */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-bold text-stone-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Popular Hyderabad Noodle Hubs:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {['Madhapur', 'Jubilee Hills', 'Banjara Hills', 'HITEC City', 'Gachibowli'].map((area) => (
              <Link
                key={area}
                to={`/restaurants?area=${encodeURIComponent(area)}`}
                className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-orange-700 text-stone-700 font-semibold transition-colors"
              >
                📍 {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRENDING NOODLES */}
      <section id="trending-noodles-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-2 border border-orange-200">
              <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Campus & Global Heat Index</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
              <span>🔥 Trending Noodles</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-xl">
              The hottest, most craved noodle bowls trending right now across campuses and foodies worldwide.
            </p>
          </div>

          {/* Trending Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'ALL', label: '🔥 All Trending' },
              { key: 'SPICY', label: '🌶️ Spicy Hits' },
              { key: 'RAMEN', label: '🍜 Ramen & Ramyeon' },
              { key: 'VEG', label: '🌱 Plant-Based' },
            ].map((tab) => (
              <button
                key={tab.key}
                id={`filter-${tab.key.toLowerCase()}-btn`}
                onClick={() => setTrendingFilter(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  trendingFilter === tab.key
                    ? 'bg-orange-600 text-white shadow-sm scale-105'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching trending global bowls..." />
        ) : filteredTrending.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-sm text-stone-500 font-medium">No trending bowls found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrending.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                trendingRank={idx + 1}
              />
            ))}
          </div>
        )}

        {/* Explore More link banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200/80">
          <p className="text-xs text-stone-500 font-medium text-center sm:text-left">
            🔥 Rankings updated hourly based on campus order frequency, live reviews, and student favorites.
          </p>
          <Link
            to="/products"
            id="view-all-trending-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs sm:text-sm font-bold border border-orange-200 transition-all hover:scale-102 shrink-0"
          >
            <span>Explore All 18+ Global Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. EXPLORE BY COUNTRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
            Global Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Explore by Country
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Tap a country to discover its authentic noodle heritage and regional ingredients.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {EXPLORE_COUNTRIES.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/products?cuisine=${c.name}`)}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all text-left group"
            >
              <span className="text-3xl block mb-2">{c.flag}</span>
              <h4 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                {c.name}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-tight">
                {c.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 5. POPULAR NOODLE TYPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
            Noodle Styles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Explore by Noodle Type
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            From springy wheat ramen to silky gluten-free rice vermicelli and chewy glass noodles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {POPULAR_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => navigate(`/products?noodleType=${encodeURIComponent(t.type)}`)}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
            >
              <span className="text-3xl block mb-2">{t.icon}</span>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                {t.type}
              </h4>
              <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                {t.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 6. WHY NOODLEVERSE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-50/60 border border-orange-200/80 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
              The Marketplace Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Why NoodleVerse?
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Building the ultimate community platform for noodle enthusiasts everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs">
              <div className="p-3 rounded-xl bg-orange-100 text-orange-700 w-fit mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                🌎 Global Flavors
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Discover noodles and ramen from 10+ distinct cultures, bridging continents through culinary craftsmanship.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700 w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                🍜 Fresh Choices
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Explore handcrafted broths, wok-charred noodles, and authentic condiments prepared with pristine local freshness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs">
              <div className="p-3 rounded-xl bg-red-100 text-red-700 w-fit mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                🔥 Customize Your Bowl
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pick your preferred noodle, signature broth, protein, crunchy greens, and heat level with live price calculation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 w-fit mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                ♻️ Sustainable Choices
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Discover plant-based dishes with eco-scoring and opt for minimal reusable packaging at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
