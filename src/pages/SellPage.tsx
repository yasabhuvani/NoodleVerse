import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Store, Check, AlertCircle, Sparkles } from 'lucide-react';
import { DietType, SpiceLevel } from '../types';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CUISINES_LIST,
  NOODLE_TYPES_LIST,
  FALLBACK_NOODLE_IMAGE,
} from '../data/initialProducts';

const COUNTRIES_LIST = [
  'Japan',
  'Korea',
  'China',
  'Thailand',
  'Vietnam',
  'India',
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Philippines',
  'Other',
];

export const SellPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cuisine: 'Japanese',
    country: 'Japan',
    noodleType: 'Ramen',
    dietType: 'VEGETARIAN' as DietType,
    spiceLevel: 'MEDIUM' as SpiceLevel,
    imageUrl: '',
    restaurantName: user ? `${user.name}'s Kitchen` : 'Artisanal Noodle House',
    stock: '15',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter a noodle dish name.');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid price in Indian Rupees.');
      return;
    }
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Please enter a valid available stock count.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      await productService.createProduct({
        name: formData.name,
        description: formData.description,
        price: priceNum,
        cuisine: formData.cuisine,
        country: formData.country,
        noodleType: formData.noodleType,
        dietType: formData.dietType,
        spiceLevel: formData.spiceLevel,
        imageUrl: formData.imageUrl.trim() || FALLBACK_NOODLE_IMAGE,
        restaurantName: formData.restaurantName,
        stock: stockNum,
      });

      setSuccessMsg(`"${formData.name}" was successfully added to the NoodleVerse catalogue!`);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add noodle.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
          <Store className="w-3.5 h-3.5" />
          <span>Vendor & Partner Portal</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          Add a Noodle to the Marketplace
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Share your authentic regional noodle dish with thousands of food lovers. Fill in the recipe profile below.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm font-bold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg} Redirecting to catalogue...</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Noodle Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Noodle Dish Name *
          </label>
          <input
            type="text"
            id="input-noodle-name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Spicy Black Garlic Tonkotsu, Pad Kee Mao"
            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            id="input-noodle-desc"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the broth, texture, artisanal toppings, and culinary heritage..."
            className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Price (Indian Rupees ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-stone-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                id="input-noodle-price"
                required
                min="1"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="249"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Initial Available Stock *
            </label>
            <input
              type="number"
              id="input-noodle-stock"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="15"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-bold outline-none"
            />
          </div>
        </div>

        {/* Cuisine & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Cuisine
            </label>
            <select
              id="select-noodle-cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-sm font-semibold outline-none"
            >
              {CUISINES_LIST.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <select
              id="select-noodle-country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-sm font-semibold outline-none"
            >
              {COUNTRIES_LIST.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Noodle Type, Diet & Spice */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Noodle Type
            </label>
            <select
              id="select-noodle-type"
              value={formData.noodleType}
              onChange={(e) => setFormData({ ...formData, noodleType: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-xs sm:text-sm font-semibold outline-none"
            >
              {NOODLE_TYPES_LIST.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Dietary Type
            </label>
            <select
              id="select-noodle-diet"
              value={formData.dietType}
              onChange={(e) => setFormData({ ...formData, dietType: e.target.value as DietType })}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-xs sm:text-sm font-semibold outline-none"
            >
              <option value="VEGETARIAN">🥬 Vegetarian</option>
              <option value="VEGAN">🌱 Vegan</option>
              <option value="NON_VEGETARIAN">🍗 Non-Vegetarian</option>
              <option value="SEAFOOD">🦐 Seafood</option>
              <option value="EGG">🥚 Egg</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Spice Level
            </label>
            <select
              id="select-noodle-spice"
              value={formData.spiceLevel}
              onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as SpiceLevel })}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-xs sm:text-sm font-semibold outline-none"
            >
              <option value="MILD">🌶️ Mild</option>
              <option value="MEDIUM">🌶️🌶️ Medium</option>
              <option value="HOT">🌶️🌶️🌶️ Hot</option>
              <option value="EXTRA_HOT">🌶️🌶️🌶️🌶️ Extra Hot</option>
            </select>
          </div>
        </div>

        {/* Image URL & Restaurant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="input-noodle-image"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://... (defaults to high-res ramen image)"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-xs sm:text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Restaurant / Vendor Name
            </label>
            <input
              type="text"
              id="input-vendor-name"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              placeholder="Your Kitchen or Brand"
              className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 text-xs sm:text-sm font-semibold outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-100">
          <button
            type="submit"
            id="submit-noodle-btn"
            disabled={submitting}
            className={`w-full py-4 rounded-xl font-extrabold text-sm sm:text-base text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              submitting
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-95 shadow-orange-600/25'
            }`}
          >
            {submitting ? (
              <span>Publishing to NoodleVerse...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Publish Noodle to Catalogue</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
