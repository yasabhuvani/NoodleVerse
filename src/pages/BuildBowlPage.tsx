import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Check, Sparkles, ShoppingBag, Flame, Plus } from 'lucide-react';
import { CustomBowlState, SpiceLevel } from '../types';
import { customBowlService } from '../services/api';
import { useCart } from '../context/CartContext';
import { SpiceBadge } from '../components/Badges';

const NOODLE_OPTIONS = [
  { name: 'Ramen', icon: '🍜', desc: 'Springy artisanal alkaline noodles' },
  { name: 'Udon', icon: '🥢', desc: 'Thick, chewy Japanese wheat noodles' },
  { name: 'Soba', icon: '🥢', desc: 'Nutty buckwheat noodles' },
  { name: 'Rice Noodles', icon: '🍚', desc: 'Silky gluten-free flat noodles' },
  { name: 'Glass Noodles', icon: '🍜', desc: 'Chewy sweet-potato vermicelli' },
  { name: 'Egg Noodles', icon: '🍜', desc: 'Savory classic Cantonese noodles' },
];

const BROTH_OPTIONS = [
  { name: 'Shoyu', type: 'Broth', desc: 'Classic slow-simmered dashi & soy' },
  { name: 'Miso', type: 'Broth', desc: 'Hearty fermented red & white bean paste' },
  { name: 'Tonkotsu', type: 'Broth', desc: 'Rich, creamy 16-hour simmered style' },
  { name: 'Spicy Gochujang', type: 'Broth', desc: 'Aromatic fiery Korean chili broth' },
  { name: 'Golden Curry', type: 'Broth', desc: 'Aromatic coconut curry fusion' },
  { name: 'Soy Garlic', type: 'Sauce', desc: 'Savory wok glaze without soup' },
  { name: 'Roasted Peanut', type: 'Sauce', desc: 'Creamy peanut satay glaze' },
  { name: 'Sweet & Spicy', type: 'Sauce', desc: 'Tangy sweet chili garlic toss' },
];

const PROTEIN_OPTIONS = [
  { name: 'None', extraPrice: 0, icon: '🥬', desc: 'Pure noodle & veggies' },
  { name: 'Chicken', extraPrice: 60, icon: '🍗', desc: 'Marinated tender chashu cuts' },
  { name: 'Tofu', extraPrice: 35, icon: '🌱', desc: 'Crispy golden spiced bean curd' },
  { name: 'Egg', extraPrice: 25, icon: '🥚', desc: 'Soft-boiled soy marinated egg' },
  { name: 'Prawn', extraPrice: 90, icon: '🦐', desc: 'Juicy butter-seared tiger prawns' },
  { name: 'Beef', extraPrice: 80, icon: '🥩', desc: 'Thinly sliced tender teriyaki beef' },
];

const VEGETABLE_OPTIONS = [
  'Sweet Corn',
  'Shiitake Mushroom',
  'Spring Onion',
  'Shredded Cabbage',
  'Crispy Carrot',
  'Bok Choy',
];

const TOPPING_OPTIONS = [
  'Ajitsuke Tamago (Egg)',
  'Toasted Sesame',
  'Roasted Nori Seaweed',
  'Artisanal Chili Oil',
  'Crispy Fried Garlic',
  'Pickled Bamboo Shoots',
];

export const BuildBowlPage: React.FC = () => {
  const [bowl, setBowl] = useState<CustomBowlState>({
    noodle: 'Ramen',
    broth: 'Shoyu',
    protein: 'Chicken',
    vegetables: ['Sweet Corn', 'Spring Onion', 'Bok Choy'],
    toppings: ['Toasted Sesame', 'Crispy Fried Garlic'],
    spiceLevel: 'MEDIUM',
  });

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

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
      const customProduct = customBowlService.createCustomProduct(bowl);
      await addToCart(customProduct, 1, {
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
      }, 1200);
    } catch (err) {
      console.error(err);
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
          <span>Interactive Craft Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
          🍜 Build Your Own Bowl
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2">
          Select your noodle base, craft broth, protein, fresh vegetables, and artisan toppings for a one-of-a-kind slurping masterpiece.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Choose Noodles */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <span>Select Your Noodle Base</span>
              </h2>
              <span className="text-xs font-bold text-orange-600">Base Included</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NOODLE_OPTIONS.map((opt) => {
                const isSelected = bowl.noodle === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, noodle: opt.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
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

          {/* Step 2: Choose Broth / Sauce */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span>Choose Broth or Sauce</span>
              </h2>
              <span className="text-xs font-bold text-orange-600">Included</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BROTH_OPTIONS.map((opt) => {
                const isSelected = bowl.broth === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, broth: opt.name })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-400 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <span className="text-xs font-extrabold uppercase text-orange-700 block">
                      {opt.type}
                    </span>
                    <span className="text-sm font-bold text-stone-900 block leading-tight mt-0.5">
                      {opt.name}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-1 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Choose Protein */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <span>Pick Protein</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROTEIN_OPTIONS.map((opt) => {
                const isSelected = bowl.protein === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setBowl({ ...bowl, protein: opt.name })}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
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

          {/* Step 4: Vegetables (Multi-select) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <span>Fresh Vegetables</span>
              </h2>
              <span className="text-xs font-semibold text-stone-500">Pick any combination</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {VEGETABLE_OPTIONS.map((veg) => {
                const isChecked = bowl.vegetables.includes(veg);
                return (
                  <button
                    key={veg}
                    type="button"
                    onClick={() => toggleVegetable(veg)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
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

          {/* Step 5: Toppings & Spice */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                    5
                  </span>
                  <span>Artisan Toppings</span>
                </h2>
                <span className="text-xs font-bold text-stone-500">+₹15 each</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOPPING_OPTIONS.map((top) => {
                  const isChecked = bowl.toppings.includes(top);
                  return (
                    <button
                      key={top}
                      type="button"
                      onClick={() => toggleTopping(top)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
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

            {/* Spice Level Selection */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Select Spice Heat Level</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT'] as SpiceLevel[]).map((level) => {
                  const isSelected = bowl.spiceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setBowl({ ...bowl, spiceLevel: level })}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
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
              Live Bowl Recipe
            </span>
            <h3 className="text-xl font-black text-white">
              Custom {bowl.noodle} Bowl
            </h3>

            {/* Chosen Specs */}
            <div className="mt-4 space-y-2.5 text-xs text-stone-300 pb-5 border-b border-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-400">Noodle:</span>
                <span className="font-bold text-white">{bowl.noodle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Broth/Sauce:</span>
                <span className="font-bold text-white">{bowl.broth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Protein:</span>
                <span className="font-bold text-white">{bowl.protein}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Veggies ({bowl.vegetables.length}):</span>
                <span className="font-bold text-white text-right max-w-[170px] truncate">
                  {bowl.vegetables.join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Toppings ({bowl.toppings.length}):</span>
                <span className="font-bold text-white text-right max-w-[170px] truncate">
                  {bowl.toppings.join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Spice:</span>
                <SpiceBadge level={bowl.spiceLevel} />
              </div>
            </div>

            {/* Price Breakdown Matching Section 19 */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>Base Bowl</span>
                <span>₹{priceCalc.basePrice}</span>
              </div>
              {priceCalc.proteinPrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>{bowl.protein}</span>
                  <span>+₹{priceCalc.proteinPrice}</span>
                </div>
              )}
              {priceCalc.toppingsPrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Extra Toppings ({bowl.toppings.length})</span>
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

            {/* Add to Cart Button */}
            <button
              id="add-custom-bowl-btn"
              onClick={handleAddCustomBowl}
              disabled={adding}
              className={`w-full mt-6 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
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
