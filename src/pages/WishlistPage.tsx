import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { SpiceBadge, DietBadge } from '../components/Badges';
import { EmptyState } from '../components/EmptyState';
import { FALLBACK_NOODLE_IMAGE } from '../data/initialProducts';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, 1);
      setAddedIds((prev) => ({ ...prev, [String(product.id)]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [String(product.id)]: false }));
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon="❤️"
          title="Your Wishlist is empty"
          description="Save dishes you'd love to try later! Click the heart icon on any noodle dish to add it here."
          actionText="Explore Noodles"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
            Saved Favorites
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>My Wishlist</span>
            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              {wishlist.length} {wishlist.length === 1 ? 'dish' : 'dishes'}
            </span>
          </h1>
        </div>

        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore More</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => {
          const isAdded = !!addedIds[String(product.id)];
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                <img
                  src={product.imageUrl || FALLBACK_NOODLE_IMAGE}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_NOODLE_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-xs font-bold text-stone-800 shadow-sm">
                  <span>{product.countryFlag}</span>
                  <span>{product.cuisine}</span>
                </div>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <DietBadge diet={product.dietType} />
                    <SpiceBadge level={product.spiceLevel} />
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="block font-bold text-stone-900 hover:text-orange-600 transition-colors text-base"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-stone-500 mt-1">
                    Noodle: <span className="font-semibold text-stone-700">{product.noodleType}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block">Price</span>
                    <span className="text-lg font-black text-stone-950">₹{product.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isOutOfStock ? 'Sold Out' : isAdded ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
