import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Utensils, Sparkles, Flame, Leaf, Clock, ArrowRight } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  matchScore?: number;
  matchReasons?: string[];
  featured?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  matchScore,
  matchReasons,
  featured,
}) => {
  const navigate = useNavigate();

  return (
    <div
      id={`restaurant-card-${restaurant.id}`}
      className={`group bg-white rounded-3xl border transition-all duration-200 flex flex-col overflow-hidden ${
        featured
          ? 'border-orange-300 ring-2 ring-orange-200/60 shadow-md hover:shadow-xl'
          : 'border-stone-200 hover:border-orange-300 hover:shadow-lg'
      }`}
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Demo Vendor Pill */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-stone-700/50">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>NoodleVerse Demo Vendor</span>
          </span>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-xs font-black shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-500 font-medium">({restaurant.reviewsCount})</span>
          </div>
        </div>

        {/* Bottom Banner on Image */}
        <div className="absolute bottom-3 inset-x-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-orange-200 font-bold mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">{restaurant.area}, Hyderabad</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white truncate tracking-tight drop-shadow-sm">
            {restaurant.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Restaurant Type & Price Range */}
          <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2.5">
            <span className="font-bold text-stone-700">{restaurant.restaurantType}</span>
            <span className="font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
              {restaurant.priceRange}
            </span>
          </div>

          {/* Match Score & Reasons if recommended */}
          {matchScore && (
            <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs">
              <div className="flex items-center justify-between font-bold text-orange-900 mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Recommended for Your Preferences</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black">
                  {matchScore}% Match
                </span>
              </div>
              {matchReasons && matchReasons.length > 0 && (
                <ul className="text-[11px] text-orange-800/90 list-disc list-inside space-y-0.5">
                  {matchReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Description snippet */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>

          {/* Specialties Pills */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-600 block mb-1.5">
              Signature Specialties
            </span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.specialties.slice(0, 3).map((spec, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                >
                  {spec}
                </span>
              ))}
              {restaurant.specialties.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px] font-semibold">
                  +{restaurant.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Customization Capabilities Tags */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px]">
            {restaurant.vegetarianAvailable && (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                <Leaf className="w-3 h-3" />
                <span>Veg & Plant Options</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
              <Utensils className="w-3 h-3 text-stone-500" />
              <span>{restaurant.supportedNoodles.map((n) => n.name).join(', ')}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50/60 px-2 py-0.5 rounded-md font-medium">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>{restaurant.spiceLevels.join(' • ')}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2.5">
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
          >
            <span>View Menu</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(`/build-bowl?restaurantId=${restaurant.id}`)}
            className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black text-center transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
          >
            <span>Build Bowl</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
