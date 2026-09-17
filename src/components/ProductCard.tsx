import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { SpiceBadge, DietBadge } from './Badges';
import { useCart } from '../context/CartContext';
import { FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    try {
      setAdding(true);
      setErrorMsg(null);
      await addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not add to cart.');
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl || FALLBACK_NOODLE_IMAGE}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_NOODLE_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Country & Cuisine Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-800 shadow-sm border border-stone-200/60">
          <span className="text-base leading-none">{product.countryFlag}</span>
          <span>{product.cuisine}</span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-red-600/95 text-white text-xs font-extrabold shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/95 text-white text-xs font-bold shadow-sm animate-bounce">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <DietBadge diet={product.dietType} />
            <SpiceBadge level={product.spiceLevel} />
            {product.servingStyle && (
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {product.servingStyle === 'SOUP' && '🍲 Broth'}
                {product.servingStyle === 'DRY' && '🔥 Wok-Tossed'}
                {product.servingStyle === 'DIPPING' && '🥢 Tsukemen Dip'}
                {product.servingStyle === 'CHILLED' && '❄️ Chilled'}
              </span>
            )}
          </div>

          {/* Title & Noodle Type */}
          <Link
            to={`/products/${product.id}`}
            className="block group-hover:text-orange-600 transition-colors"
          >
            <h3 className="text-lg font-bold text-stone-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs font-semibold text-stone-500 mt-0.5">
            Noodle: <span className="text-stone-700">{product.noodleType}</span>
            {product.restaurantName && (
              <span className="text-stone-400"> • {product.restaurantName}</span>
            )}
          </p>

          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Price and Actions */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex flex-col gap-2">
          {errorMsg && (
            <div className="text-[11px] font-semibold text-red-600 bg-red-50 p-1.5 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block leading-none">Price</span>
              <span className="text-xl font-extrabold text-stone-950">
                ₹{product.price}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to={`/products/${product.id}`}
                id={`btn-view-${product.id}`}
                className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Link>

              <button
                id={`btn-add-cart-${product.id}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 active:scale-95 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
