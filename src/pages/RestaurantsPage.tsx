import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  Leaf,
  Flame,
  RotateCcw,
  Store,
  Info,
} from 'lucide-react';
import { Restaurant, HyderabadArea } from '../types';
import { restaurantService } from '../services/api';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantMatcher } from '../components/RestaurantMatcher';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { HYDERABAD_AREAS } from '../data/restaurantsData';

export const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedArea, setSelectedArea] = useState<string>(searchParams.get('area') || 'ALL');
  const [selectedCuisine, setSelectedCuisine] = useState<string>(searchParams.get('cuisine') || 'ALL');
  const [selectedNoodleType, setSelectedNoodleType] = useState<string>(searchParams.get('noodle') || 'ALL');
  const [vegOnly, setVegOnly] = useState<boolean>(searchParams.get('veg') === 'true');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'area'>('recommended');
  const [showMatcher, setShowMatcher] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const list = await restaurantService.getRestaurants({
          search: searchQuery,
          cuisine: selectedCuisine,
          area: selectedArea,
          noodleType: selectedNoodleType,
          vegetarianOnly: vegOnly,
          sortBy,
        });
        setRestaurants(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, selectedArea, selectedCuisine, selectedNoodleType, vegOnly, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedArea('ALL');
    setSelectedCuisine('ALL');
    setSelectedNoodleType('ALL');
    setVegOnly(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const handleSelectFromMatcher = (restaurant: Restaurant) => {
    navigate(`/build-bowl?restaurantId=${restaurant.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Serving Hyderabad Foodies & Tech Campuses</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
          Explore Restaurants
        </h1>

        <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed">
          Discover noodle & Asian restaurants near you in Hyderabad.
        </p>

        {/* Demo Disclaimer notice */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold mt-1">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            NoodleVerse Demo Vendor Marketplace — Curated prototypes modeled on Hyderabad’s authentic Asian food scene.
          </span>
        </div>
      </div>

      {/* 2. Interactive Matcher Section */}
      <RestaurantMatcher onSelectRestaurant={handleSelectFromMatcher} />

      {/* 3. Search & Area Quick-Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, areas, or noodle types (e.g., Tokyo Noodle, Hakka, Gachibowli)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-3 px-3.5 rounded-2xl border border-stone-200 bg-white text-xs font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="recommended">⭐ Recommended</option>
              <option value="rating">★ Top Rated</option>
              <option value="price_asc">₹ Price: Low to High</option>
              <option value="price_desc">₹ Price: High to Low</option>
              <option value="area">📍 Area Name</option>
            </select>
          </div>
        </div>

        {/* Hyderabad Area Quick Tabs */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 block mb-2">
            Filter by Hyderabad Area
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedArea('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedArea === 'ALL'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Hyderabad ({restaurants.length})
            </button>
            {HYDERABAD_AREAS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setSelectedArea(a)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedArea === a
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                📍 {a}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Badges (Cuisine, Noodle, Veg) */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Cuisine dropdown */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 focus:outline-none"
            >
              <option value="ALL">All Cuisines</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Chinese">Chinese</option>
              <option value="Thai">Thai</option>
              <option value="Indian">Indo-Chinese</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Pan-Asian">Pan-Asian</option>
            </select>

            {/* Noodle style dropdown */}
            <select
              value={selectedNoodleType}
              onChange={(e) => setSelectedNoodleType(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 focus:outline-none"
            >
              <option value="ALL">All Noodle Types</option>
              <option value="Ramen">Ramen</option>
              <option value="Udon">Udon</option>
              <option value="Ramyeon">Ramyeon</option>
              <option value="Hakka">Hakka</option>
              <option value="Rice Noodles">Rice Noodles</option>
              <option value="Soba">Soba</option>
            </select>

            {/* Veg toggle */}
            <button
              type="button"
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                vegOnly
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Veg / Plant Options</span>
            </button>
          </div>

          {(searchQuery || selectedArea !== 'ALL' || selectedCuisine !== 'ALL' || selectedNoodleType !== 'ALL' || vegOnly) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Restaurants Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-600" />
            <span>
              {selectedArea !== 'ALL' ? `${selectedArea} Kitchens` : 'All Hyderabad Vendors'} ({restaurants.length})
            </span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">Click "Build Bowl" to customize from vendor</span>
        </div>

        {loading ? (
          <LoadingSpinner message="Discovering Hyderabad noodle restaurants..." />
        ) : restaurants.length === 0 ? (
          <EmptyState
            icon="🍜"
            title="No Restaurants Found"
            description="Try changing your search keywords or resetting your area and cuisine filters."
            actionText="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, idx) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                featured={idx === 0 && selectedArea === 'ALL'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
