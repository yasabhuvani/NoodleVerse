import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Utensils,
  Check,
  Sparkles,
  ShoppingBag,
  Flame,
  Plus,
  AlertCircle,
  MapPin,
  Store,
  ChevronDown,
  ArrowRight,
  Leaf,
  Info,
} from 'lucide-react';
import { CustomBowlState, SpiceLevel, Restaurant } from '../types';
import { customBowlService, restaurantService } from '../services/api';
import { useCart } from '../context/CartContext';
import { SpiceBadge } from '../components/Badges';
import { HYDERABAD_RESTAURANTS } from '../data/restaurantsData';

export const BuildBowlPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [restaurants, setRestaurants] = useState<Restaurant[]>(HYDERABAD_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(HYDERABAD_RESTAURANTS[0]);
  const [isChangingRestaurant, setIsChangingRestaurant] = useState(false);

  // Initialize Bowl State with Restaurant Association
  const [bowl, setBowl] = useState<CustomBowlState>({
    restaurantId: HYDERABAD_RESTAURANTS[0].id,
    restaurantName: HYDERABAD_RESTAURANTS[0].name,
    restaurantLocation: `${HYDERABAD_RESTAURANTS[0].area}, Hyderabad`,
    noodle: HYDERABAD_RESTAURANTS[0].supportedNoodles[0].name,
    broth: HYDERABAD_RESTAURANTS[0].supportedBroths[0].name,
    protein: 'Chicken',
    vegetables: ['Sweet Corn', 'Spring Onion'],
    toppings: ['Toasted Sesame', 'Soft Boiled Egg'],
    spiceLevel: 'MEDIUM',
  });

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load restaurants & read query parameter
  useEffect(() => {
    const init = async () => {
      try {
        const list = await restaurantService.getRestaurants();
        setRestaurants(list);

        const rId = searchParams.get('restaurantId');
        if (rId) {
          const match = list.find((r) => r.id === rId);
          if (match) {
            applyRestaurant(match);
          }
        }
      } catch (err) {
        console.error('Error loading restaurants:', err);
      }
    };
    init();
  }, [searchParams]);

  // Handle Switching Restaurant
  const applyRestaurant = (rest: Restaurant) => {
    setSelectedRestaurant(rest);
    setIsChangingRestaurant(false);

    // Ensure choices align with restaurant's catalog
    const validNoodle =
      rest.supportedNoodles.some((n) => n.name === bowl.noodle)
        ? bowl.noodle
        : rest.supportedNoodles[0].name;

    const validBroth =
      rest.supportedBroths.some((b) => b.name === bowl.broth)
        ? bowl.broth
        : rest.supportedBroths[0].name;

    const validProtein =
      rest.supportedProteins.some((p) => p.name === bowl.protein)
        ? bowl.protein
        : rest.supportedProteins[0].name;

    const validVegs = bowl.vegetables.filter((v) => rest.supportedVegetables.includes(v));
    const finalVegs = validVegs.length > 0 ? validVegs : rest.supportedVegetables.slice(0, 2);

    const validTops = bowl.toppings.filter((t) => rest.supportedToppings.includes(t));
    const finalTops = validTops.length > 0 ? validTops : rest.supportedToppings.slice(0, 1);

    const validSpice =
      rest.spiceLevels.includes(bowl.spiceLevel)
        ? bowl.spiceLevel
        : rest.spiceLevels[0];

    setBowl({
      restaurantId: rest.id,
      restaurantName: rest.name,
      restaurantLocation: `${rest.area}, Hyderabad`,
      noodle: validNoodle,
      broth: validBroth,
      protein: validProtein,
      vegetables: finalVegs,
      toppings: finalTops,
      spiceLevel: validSpice,
    });

    setSearchParams({ restaurantId: rest.id });
  };

  const priceCalc = customBowlService.calculatePrice(bowl);

  const toggleVegetable = (veg: string) => {
    setBowl((prev) => {
      const exists = prev.vegetables.includes(veg);
      if (exists) {
        return { ...prev, vegetables: prev.vegetables.filter((v) => v !== veg) };
      } else {
        return { ...prev, vegetables: [...prev.vegetables, veg] };
      }
    });
  };

  const toggleTopping = (top: string) => {
    setBowl((prev) => {
      const exists = prev.toppings.includes(top);
      if (exists) {
        return { ...prev, toppings: prev.toppings.filter((t) => t !== top) };
      } else {
        return { ...prev, toppings: [...prev.toppings, top] };
      }
    });
  };

  const handleAddCustomBowl = async () => {
    try {
      setAdding(true);
      setErrorMsg(null);
      const customProduct = customBowlService.createCustomProduct(bowl);
      await addToCart(customProduct, 1, {
        restaurantId: bowl.restaurantId,
        restaurantName: bowl.restaurantName,
        restaurantLocation: bowl.restaurantLocation,
        noodle: bowl.noodle,
        broth: bowl.broth,
        protein: bowl.protein,
        vegetables: bowl.vegetables,
        toppings: bowl.toppings,
        spiceLevel: bowl.spiceLevel,
      });
      setAdded(true);
      setTimeout(() => {
        navigate('/cart');
      }, 900);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not add custom bowl to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Craft Studio • Hyderabad Vendors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
          🍜 Build Your Own Bowl
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2">
          Select the Hyderabad restaurant that will prepare your bowl, then customize noodles, broths, proteins, fresh greens, and toppings crafted to order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: CHOOSE RESTAURANT / VENDOR */}
          <div
            id="step-1-restaurant"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <span>Select Restaurant / Vendor</span>
              </h2>
              <span className="text-xs font-bold text-stone-500">
                {selectedRestaurant.area}, Hyderabad
              </span>
            </div>

            {/* Currently Selected Restaurant Card Banner */}
            <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-orange-200">
                  <img
                    src={selectedRestaurant.imageUrl}
                    alt={selectedRestaurant.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-orange-800 font-bold">
                    <MapPin className="w-3 h-3 text-orange-600" />
                    <span>{selectedRestaurant.area}, Hyderabad</span>
                    <span>•</span>
                    <span>{selectedRestaurant.cuisine}</span>
                  </div>
                  <h3 className="text-base font-black text-stone-900">
                    {selectedRestaurant.name}
                  </h3>
                  <p className="text-[11px] text-stone-600 line-clamp-1">
                    {selectedRestaurant.tagline}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChangingRestaurant(!isChangingRestaurant)}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-orange-500 text-xs font-bold text-stone-800 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95"
              >
                <Store className="w-3.5 h-3.5 text-orange-600" />
                <span>{isChangingRestaurant ? 'Keep Current' : 'Change Kitchen'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingRestaurant ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Kitchen Switcher Grid */}
            {isChangingRestaurant && (
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <span className="text-xs font-bold text-stone-600 block">
                  Select a Hyderabad restaurant to craft your bowl:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {restaurants.map((rest) => {
                    const isSelected = rest.id === selectedRestaurant.id;
                    return (
                      <button
                        key={rest.id}
                        type="button"
                        onClick={() => applyRestaurant(rest)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-400 font-bold shadow-xs'
                            : 'border-stone-200 hover:border-orange-300 bg-white'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <img
                            src={rest.imageUrl}
                            alt={rest.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-stone-900 truncate">
                              {rest.name}
                            </span>
                            <span className="text-[10px] text-amber-700 font-bold">★ {rest.rating}</span>
                          </div>
                          <span className="text-[11px] text-stone-500 block truncate">
                            📍 {rest.area} • {rest.cuisine}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: CHOOSE NOODLES (Filtered by Restaurant) */}
          <div
            id="step-2-noodles"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span>Select Your Noodle Base</span>
              </h2>
              <span className="text-xs font-bold text-orange-600">Base Included</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedRestaurant.supportedNoodles.map((opt) => {
                const isSelected = bowl.noodle === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, noodle: opt.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-400 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{opt.icon}</span>
                    <span className="text-sm font-bold text-stone-900 block leading-tight">
                      {opt.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CHOOSE BROTH / SAUCE (Filtered by Restaurant) */}
          <div
            id="step-3-broth"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <span>Choose Broth or Sauce</span>
              </h2>
              <span className="text-xs font-bold text-orange-600">
                {selectedRestaurant.name} Recipes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedRestaurant.supportedBroths.map((opt) => {
                const isSelected = bowl.broth === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, broth: opt.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-400 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold uppercase text-orange-700">
                        {opt.type}
                      </span>
                      {opt.price > 0 && (
                        <span className="text-xs font-bold text-stone-700">+₹{opt.price}</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-stone-900 block leading-tight">
                      {opt.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-1 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: CHOOSE PROTEIN */}
          <div
            id="step-4-protein"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <span>Pick Protein</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedRestaurant.supportedProteins.map((opt) => {
                const isSelected = bowl.protein === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, protein: opt.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-400 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-xs font-extrabold text-stone-900">
                        {opt.extraPrice > 0 ? `+₹${opt.extraPrice}` : 'Free'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 block">
                      {opt.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: VEGETABLES (Filtered by Restaurant) */}
          <div
            id="step-5-veggies"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  5
                </span>
                <span>Fresh Vegetables</span>
              </h2>
              <span className="text-xs font-semibold text-stone-500">Pick any combination</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {selectedRestaurant.supportedVegetables.map((veg) => {
                const isChecked = bowl.vegetables.includes(veg);
                return (
                  <button
                    key={veg}
                    type="button"
                    onClick={() => toggleVegetable(veg)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{veg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 6: TOPPINGS & SPICE */}
          <div
            id="step-6-toppings"
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                    6
                  </span>
                  <span>Artisan Toppings</span>
                </h2>
                <span className="text-xs font-bold text-stone-500">+₹20 each</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedRestaurant.supportedToppings.map((top) => {
                  const isChecked = bowl.toppings.includes(top);
                  return (
                    <button
                      key={top}
                      type="button"
                      onClick={() => toggleTopping(top)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'border-orange-600 bg-orange-50 text-orange-950'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{top}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 7: SPICE LEVEL SELECTION */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>7. Select Spice Heat Level</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {selectedRestaurant.spiceLevels.map((level) => {
                  const isSelected = bowl.spiceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setBowl({ ...bowl, spiceLevel: level })}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-400 font-bold'
                          : 'border-stone-200 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <SpiceBadge level={level} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary & Price Sticky Card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl border border-stone-800">
            <span className="text-[11px] uppercase tracking-widest text-orange-400 font-extrabold block mb-1">
              Live Custom Bowl Summary
            </span>
            <h3 className="text-xl font-black text-white">
              {bowl.restaurantName} — Custom Bowl
            </h3>

            {/* Vendor Details Banner */}
            <div className="mt-3 p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Prepared by:</span>
                <span className="font-extrabold text-orange-400">{bowl.restaurantName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Location:</span>
                <span>{bowl.restaurantLocation}</span>
              </div>
            </div>

            {/* Chosen Specs */}
            <div className="mt-4 space-y-2.5 text-xs text-stone-300 pb-5 border-b border-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-400">Noodle:</span>
                <span className="font-bold text-white">{bowl.noodle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Broth:</span>
                <span className="font-bold text-white">{bowl.broth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Protein:</span>
                <span className="font-bold text-white">{bowl.protein}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Vegetables:</span>
                <span className="font-bold text-white text-right max-w-[170px] truncate">
                  {bowl.vegetables.join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Toppings:</span>
                <span className="font-bold text-white text-right max-w-[170px] truncate">
                  {bowl.toppings.join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Spice:</span>
                <SpiceBadge level={bowl.spiceLevel} />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Base Bowl</span>
                <span>₹{priceCalc.basePrice}</span>
              </div>
              {priceCalc.proteinPrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Protein ({bowl.protein})</span>
                  <span>+₹{priceCalc.proteinPrice}</span>
                </div>
              )}
              {priceCalc.saucePrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Premium Sauce ({bowl.broth})</span>
                  <span>+₹{priceCalc.saucePrice}</span>
                </div>
              )}
              {priceCalc.toppingsPrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Extra Toppings ({bowl.toppings.length} × ₹20)</span>
                  <span>+₹{priceCalc.toppingsPrice}</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-200">Total</span>
                <span className="text-2xl font-black text-orange-400">
                  ₹{priceCalc.total}
                </span>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              id="add-custom-bowl-btn"
              onClick={handleAddCustomBowl}
              disabled={adding}
              className={`w-full mt-6 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Custom Bowl Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Bowl to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
