import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, ArrowRight, RotateCcw, Check, Flame, MapPin } from 'lucide-react';
import { Restaurant, SpiceLevel, HyderabadArea } from '../types';
import { restaurantService } from '../services/api';
import { HYDERABAD_AREAS } from '../data/restaurantsData';

interface RestaurantMatcherProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RestaurantMatcher: React.FC<RestaurantMatcherProps> = ({ onSelectRestaurant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cuisine, setCuisine] = useState<string>('ALL');
  const [noodleType, setNoodleType] = useState<string>('ALL');
  const [area, setArea] = useState<string>('ALL');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel | undefined>(undefined);
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);
  const [maxBudget, setMaxBudget] = useState<number>(500);

  const matchedResults = restaurantService.findRecommendedRestaurants({
    cuisine: cuisine !== 'ALL' ? cuisine : undefined,
    noodleType: noodleType !== 'ALL' ? noodleType : undefined,
    area: area !== 'ALL' ? area : undefined,
    spiceLevel,
    vegetarianOnly,
    maxBudget,
  });

  const resetFilters = () => {
    setCuisine('ALL');
    setNoodleType('ALL');
    setArea('ALL');
    setSpiceLevel(undefined);
    setVegetarianOnly(false);
    setMaxBudget(500);
  };

  const hasActiveFilters =
    cuisine !== 'ALL' ||
    noodleType !== 'ALL' ||
    area !== 'ALL' ||
    spiceLevel !== undefined ||
    vegetarianOnly ||
    maxBudget < 500;

  return (
    <div className="bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-white p-6 sm:p-8 rounded-3xl border border-orange-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider mb-1.5 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>AI & Rule-Based Matcher</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            🎯 Find the Right Restaurant for Your Bowl
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Tell us your taste preferences, preferred Hyderabad neighborhood, and spice tolerance. We’ll match you with the best artisan noodle kitchen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Close Matcher' : 'Customize Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Filter controls expandable or visible */}
      {isOpen && (
        <div className="pt-6 border-t border-orange-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
          {/* Cuisine Preference */}
          <div>
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block mb-2">
              Preferred Cuisine
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="ALL">Any Asian Cuisine</option>
              <option value="Japanese">🇯🇵 Japanese (Ramen, Udon, Soba)</option>
              <option value="Korean">🇰🇷 Korean (Ramyeon, Jajangmyeon)</option>
              <option value="Chinese">🇨🇳 Chinese (Hakka, Wok Noodles)</option>
              <option value="Thai">🇹🇭 Thai (Pad Thai, Khao Soi)</option>
              <option value="Indian">🇮🇳 Indo-Chinese / Desi Noodles</option>
              <option value="Vietnamese">🇻🇳 Vietnamese (Pho, Rice Noodles)</option>
              <option value="Pan-Asian">🥢 Pan-Asian Fusion</option>
            </select>
          </div>

          {/* Area in Hyderabad */}
          <div>
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block mb-2">
              Hyderabad Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="ALL">All Hyderabad Neighborhoods</option>
              {HYDERABAD_AREAS.map((a) => (
                <option key={a} value={a}>
                  📍 {a}
                </option>
              ))}
            </select>
          </div>

          {/* Noodle Style */}
          <div>
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block mb-2">
              Noodle Style
            </label>
            <select
              value={noodleType}
              onChange={(e) => setNoodleType(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="ALL">Any Noodle Style</option>
              <option value="Ramen">🍜 Springy Japanese Ramen</option>
              <option value="Udon">🥢 Thick Chewy Udon</option>
              <option value="Ramyeon">🍜 Korean Spicy Ramyeon</option>
              <option value="Hakka">🥢 Kolkata / Desi Hakka</option>
              <option value="Rice Noodles">🍚 Silky Flat Rice Noodles</option>
              <option value="Soba">🥢 Earthy Buckwheat Soba</option>
            </select>
          </div>

          {/* Spice Heat Tolerance */}
          <div>
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block mb-2">
              Spice Heat Tolerance
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'] as SpiceLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(spiceLevel === level ? undefined : level)}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    spiceLevel === level
                      ? 'border-orange-600 bg-orange-600 text-white shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {level === 'MILD' ? 'Mild' : level === 'MEDIUM' ? 'Medium' : level === 'HOT' ? 'Spicy' : 'Fiery'}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Choice */}
          <div>
            <label className="text-xs font-black text-stone-800 uppercase tracking-wider block mb-2">
              Dietary Preference
            </label>
            <button
              type="button"
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                vegetarianOnly
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>🌱 Vegetarian / Vegan Only</span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  vegetarianOnly
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {vegetarianOnly && <Check className="w-3 h-3" />}
              </div>
            </button>
          </div>

          {/* Maximum Budget per bowl */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-stone-800 uppercase tracking-wider">
                Max Budget / Person
              </label>
              <span className="text-xs font-extrabold text-orange-700">₹{maxBudget}</span>
            </div>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Top Recommendations Preview */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <span>Matched Hyderabad Kitchens ({matchedResults.length})</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-medium">Sorted by Match Score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {matchedResults.slice(0, 3).map(({ restaurant, score, matchReasons }) => (
            <div
              key={restaurant.id}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black">
                    {score}% Match
                  </span>
                  <span className="text-xs text-stone-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-600" />
                    <span>{restaurant.area}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm">{restaurant.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{restaurant.restaurantType}</p>
                </div>

                <div className="p-2 rounded-lg bg-orange-50/50 border border-orange-100 text-[10px] text-stone-600 space-y-1">
                  {matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-orange-950 font-medium truncate">
                      <span className="text-orange-600">•</span>
                      <span className="truncate">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectRestaurant(restaurant)}
                className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span>Select & Craft Bowl</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
