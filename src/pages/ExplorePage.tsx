import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Compass,
  X,
  Flame,
  Utensils,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  CUISINES_LIST,
  NOODLE_TYPES_LIST,
  SERVING_STYLES_LIST,
  DIET_TYPES_LIST,
  SPICE_LEVELS_LIST,
  SORT_OPTIONS,
  PRICE_RANGES_LIST,
  QUICK_CATEGORY_CHIPS,
} from '../data/initialProducts';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || 'All');
  const [selectedNoodleType, setSelectedNoodleType] = useState(searchParams.get('noodleType') || 'All');
  const [selectedServingStyle, setSelectedServingStyle] = useState(searchParams.get('style') || 'All');
  const [selectedDiet, setSelectedDiet] = useState(searchParams.get('diet') || 'All');
  const [selectedSpice, setSelectedSpice] = useState(searchParams.get('spice') || 'All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('priceRange') || 'ALL');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'FEATURED');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync URL params when arriving with query params
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setSearchQuery(qParam);

    const cuisineParam = searchParams.get('cuisine');
    if (cuisineParam) setSelectedCuisine(cuisineParam);

    const noodleParam = searchParams.get('noodleType');
    if (noodleParam) setSelectedNoodleType(noodleParam);

    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedQuickCategory(categoryParam);
  }, [searchParams]);

  // Compute price bounds from selected range
  const currentPriceRangeConfig = useMemo(() => {
    return PRICE_RANGES_LIST.find((p) => p.value === selectedPriceRange) || PRICE_RANGES_LIST[0];
  }, [selectedPriceRange]);

  // Fetch filtered dishes
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const result = await productService.getProducts({
          search: searchQuery,
          cuisine: selectedCuisine,
          noodleType: selectedNoodleType,
          dietType: selectedDiet,
          spiceLevel: selectedSpice,
          servingStyle: selectedServingStyle,
          minPrice: currentPriceRangeConfig.min,
          maxPrice: currentPriceRangeConfig.max,
          inStockOnly,
          quickCategory: selectedQuickCategory,
          sortBy,
        });
        setProducts(result);

        // Fetch all unfiltered to get total count
        const all = await productService.getProducts();
        setTotalCount(all.length);
      } catch (err) {
        console.error('Error fetching noodles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [
    searchQuery,
    selectedCuisine,
    selectedNoodleType,
    selectedServingStyle,
    selectedDiet,
    selectedSpice,
    selectedPriceRange,
    selectedQuickCategory,
    sortBy,
    inStockOnly,
    currentPriceRangeConfig,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedQuickCategory('all');
    setSelectedCuisine('All');
    setSelectedNoodleType('All');
    setSelectedServingStyle('All');
    setSelectedDiet('All');
    setSelectedSpice('All');
    setSelectedPriceRange('ALL');
    setSortBy('FEATURED');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedQuickCategory !== 'all' ||
    selectedCuisine !== 'All' ||
    selectedNoodleType !== 'All' ||
    selectedServingStyle !== 'All' ||
    selectedDiet !== 'All' ||
    selectedSpice !== 'All' ||
    selectedPriceRange !== 'ALL' ||
    sortBy !== 'FEATURED' ||
    inStockOnly;

  const activeFilterCount = [
    searchQuery.trim() !== '',
    selectedQuickCategory !== 'all',
    selectedCuisine !== 'All',
    selectedNoodleType !== 'All',
    selectedServingStyle !== 'All',
    selectedDiet !== 'All',
    selectedSpice !== 'All',
    selectedPriceRange !== 'ALL',
    sortBy !== 'FEATURED',
    inStockOnly,
  ].filter(Boolean).length;

  const isRamenCategory =
    selectedQuickCategory === 'ramen' ||
    selectedNoodleType.toLowerCase() === 'ramen' ||
    selectedNoodleType.toLowerCase() === 'tsukemen';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Artisanal Noodle Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Explore All Noodles & Ramen
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Discover authentic regional ramen, wok-tossed street noodles, and velvety broths from Japan, Korea, Thailand, China, Italy, and beyond.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="w-full md:w-88 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ramen, tsukemen, pho, miso..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none transition-all placeholder:text-stone-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-700"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Category Chips Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Quick Collections
          </span>
          {isRamenCategory && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3" />
              <span>Ramen Master Collection Active</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedQuickCategory === chip.id;
            return (
              <button
                key={chip.id}
                id={`chip-${chip.id}`}
                onClick={() => {
                  setSelectedQuickCategory(chip.id);
                  // If clicking ramen, automatically set noodle type if needed or keep versatile
                  if (chip.id === 'ramen') {
                    setSelectedNoodleType('All');
                  }
                }}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-[1.02]'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ramen Spotlight Feature Card (Shown when ramen category is active) */}
      {isRamenCategory && (
        <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-5 sm:p-6 border border-stone-800 shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-extrabold uppercase tracking-wide border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Ramen & Tsukemen Master Series</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Authentic Japanese & Regional Ramens
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Featuring Tokyo clear Shoyu, Hokkaido rich red Miso, Hakata slow-simmered Tonkotsu, Kumamoto Black Garlic Mayu, extra-thick Tsukemen dipping noodles, Tori Paitan chicken broth, and fiery Korean Ramyeon.
              </p>
            </div>

            {/* Quick Ramen Sub-filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedNoodleType('Ramen');
                  setSelectedServingStyle('SOUP');
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold border border-stone-700 text-stone-200 transition-colors"
              >
                🍜 Traditional Broth Ramen
              </button>
              <button
                onClick={() => {
                  setSelectedNoodleType('Tsukemen');
                  setSelectedServingStyle('DIPPING');
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold border border-stone-700 text-stone-200 transition-colors"
              >
                🥢 Tsukemen (Dipping)
              </button>
              <button
                onClick={() => {
                  setSelectedCuisine('Japanese');
                  setSelectedQuickCategory('ramen');
                }}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white transition-colors"
              >
                🇯🇵 Japan Regional
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Filter Controls Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Filter Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-extrabold text-stone-900">Filters & Options</span>
            </div>

            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                {activeFilterCount} active
              </span>
            )}

            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              (Found {products.length} of {totalCount} bowls)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>{showAdvancedFilters ? 'Fewer Filters' : 'More Filters'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showAdvancedFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Filter Dropdowns (Grid 1: Common) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Cuisine Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Cuisine / Region
            </label>
            <select
              id="filter-cuisine"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800 transition-colors"
            >
              {CUISINES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Cuisines (Global)' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Noodle Type Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Noodle Type
            </label>
            <select
              id="filter-noodle-type"
              value={selectedNoodleType}
              onChange={(e) => setSelectedNoodleType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800 transition-colors"
            >
              {NOODLE_TYPES_LIST.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Noodle Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Dietary Preference Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Dietary Preference
            </label>
            <select
              id="filter-diet"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800 transition-colors"
            >
              {DIET_TYPES_LIST.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              Sort By
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800 transition-colors"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary / Advanced Filters (Toggleable or Expanded) */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Broth & Serving Style */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Serving Style / Broth
              </label>
              <select
                id="filter-style"
                value={selectedServingStyle}
                onChange={(e) => setSelectedServingStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              >
                {SERVING_STYLES_LIST.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Spice Level */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Spice Level
              </label>
              <select
                id="filter-spice"
                value={selectedSpice}
                onChange={(e) => setSelectedSpice(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              >
                {SPICE_LEVELS_LIST.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Price Budget
              </label>
              <select
                id="filter-price"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-stone-800"
              >
                {PRICE_RANGES_LIST.map((pr) => (
                  <option key={pr.value} value={pr.value}>
                    {pr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Only Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 cursor-pointer select-none hover:bg-stone-100 transition-colors">
                <input
                  type="checkbox"
                  id="filter-in-stock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-stone-300"
                />
                <span className="text-xs sm:text-sm font-bold text-stone-800">
                  Ready & In Stock Only
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Active Filters Pill Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="font-bold text-stone-500">Active:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedQuickCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 font-semibold border border-orange-200">
                <span>Category: {QUICK_CATEGORY_CHIPS.find((c) => c.id === selectedQuickCategory)?.label}</span>
                <button onClick={() => setSelectedQuickCategory('all')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCuisine !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>Cuisine: {selectedCuisine}</span>
                <button onClick={() => setSelectedCuisine('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedNoodleType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>Type: {selectedNoodleType}</span>
                <button onClick={() => setSelectedNoodleType('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedServingStyle !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>Style: {SERVING_STYLES_LIST.find((s) => s.value === selectedServingStyle)?.label}</span>
                <button onClick={() => setSelectedServingStyle('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDiet !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>Diet: {DIET_TYPES_LIST.find((d) => d.value === selectedDiet)?.label}</span>
                <button onClick={() => setSelectedDiet('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSpice !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>Spice: {SPICE_LEVELS_LIST.find((s) => s.value === selectedSpice)?.label}</span>
                <button onClick={() => setSelectedSpice('All')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPriceRange !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                <span>{currentPriceRangeConfig.label}</span>
                <button onClick={() => setSelectedPriceRange('ALL')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-stone-700">
          Showing <span className="text-orange-600 font-black">{products.length}</span> delicious bowls
        </span>
        <span className="text-xs text-stone-500">
          Freshly prepared & ready for campus pickup
        </span>
      </div>

      {/* Product Grid or Empty State */}
      {loading ? (
        <LoadingSpinner message="Searching our artisanal noodle catalogue..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="No noodles match your criteria."
          description="Try clearing some of your filters, widening the price budget, or searching for another noodle type like 'ramen', 'udon', or 'pad thai'."
          actionText="Reset All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

