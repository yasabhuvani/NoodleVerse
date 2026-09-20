import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, Plus, Minus, Store, MapPin, Sparkles, Heart, Globe } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/api';
import { SpiceBadge, DietBadge } from '../components/Badges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EcoChoiceBanner } from '../components/EcoChoiceBanner';
import { FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Fetching bowl details..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <span className="text-5xl block mb-3">🍜</span>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Noodle Dish Unavailable</h2>
        <p className="text-sm text-stone-600 mb-6">{error || 'This noodle does not exist.'}</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isEcoMeal = product.dietType === 'VEGETARIAN' || product.dietType === 'VEGAN';

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    try {
      setAdding(true);
      setCartError(null);
      await addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setCartError(err.message || 'Failed to add item to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </Link>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Large Image */}
        <div className="lg:col-span-6 relative aspect-4/3 lg:aspect-auto lg:h-full bg-stone-100 min-h-[340px]">
          <img
            src={product.imageUrl || FALLBACK_NOODLE_IMAGE}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_NOODLE_IMAGE;
            }}
            className="w-full h-full object-cover"
          />
          {/* Country Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-bold text-stone-900 border border-stone-200/80">
            <span className="text-xl leading-none">{product.countryFlag}</span>
            <span>{product.country}</span>
            <span className="text-stone-400">•</span>
            <span>{product.cuisine}</span>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span>🌎 {product.cuisine} Cuisine</span>
              </span>
              <DietBadge diet={product.dietType} />
              <SpiceBadge level={product.spiceLevel} />
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                Noodle: {product.noodleType}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Vendor & Location */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500">
              <Link
                to={product.restaurantId ? `/restaurants/${product.restaurantId}` : '/restaurants'}
                className="flex items-center gap-1.5 text-orange-700 hover:text-orange-800 font-bold bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-orange-600" />
                <span>{product.restaurantName} (Hyderabad Kitchen)</span>
              </Link>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{product.country}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Eco Banner if Vegetarian/Vegan */}
            {isEcoMeal && (
              <EcoChoiceBanner showPlantBasedMessage={true} />
            )}

            {/* Stock status indicator */}
            <div className="pt-2">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Currently Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Only {product.stock} portions left! Order soon</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>In Stock ({product.stock} available)</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Cart Action Block */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            {cartError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                {cartError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 font-semibold block">Price per Bowl</span>
                <span className="text-3xl font-black text-stone-950">
                  ₹{product.price}
                </span>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600 mr-1">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-extrabold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      disabled={quantity >= product.stock}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Cart + Wishlist Heart */}
            <div className="flex items-center gap-3">
              <button
                id="add-to-cart-detail-btn"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`flex-1 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white shadow-orange-600/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>
                      {isOutOfStock
                        ? 'Out of Stock'
                        : `Add ${quantity} to Cart • ₹${product.price * quantity}`}
                    </span>
                  </>
                )}
              </button>

              <button
                id="detail-wishlist-btn"
                onClick={() => toggleWishlist(product)}
                title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                    : 'bg-stone-50 text-stone-600 hover:text-red-500 hover:bg-red-50/50 border-stone-300'
                }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Quick Link to Cart if added */}
            {added && (
              <div className="text-center pt-1">
                <Link
                  to="/cart"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                >
                  View Cart & Checkout →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
