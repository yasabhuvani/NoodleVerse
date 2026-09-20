import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, PlusCircle, Compass, Utensils, Award, Heart, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingInDemo, setIsLoggingInDemo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoQuickLogin = async () => {
    try {
      setIsLoggingInDemo(true);
      await login('demo@noodleverse.com', 'demo123');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingInDemo(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            className="flex items-center gap-2.5 text-stone-900 group"
          >
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-200">
              🍜
            </span>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 block leading-none">
                Noodle<span className="text-orange-600">Verse</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-orange-700/80 block mt-0.5">
                Global Noodle Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              id="nav-home"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              id="nav-restaurants"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/restaurants')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              <Store className="w-4 h-4 text-orange-600" />
              <span>Restaurants</span>
            </Link>
            <Link
              to="/products"
              id="nav-explore"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/products')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            <Link
              to="/build-bowl"
              id="nav-build-bowl"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/build-bowl')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>Build Your Bowl</span>
            </Link>
            <Link
              to="/orders"
              id="nav-orders"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/orders')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              <Award className="w-4 h-4 text-stone-500" />
              <span>My Orders</span>
            </Link>
            <Link
              to="/sell"
              id="nav-sell"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/sell')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-stone-500" />
              <span>Add Noodle</span>
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              id="nav-wishlist-btn"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 transition-all font-semibold text-sm border border-stone-200/80"
              title="View Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-stone-500'}`} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[11px] font-bold text-white bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              id="nav-cart-btn"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-orange-50 text-stone-800 hover:text-orange-600 transition-all font-semibold text-sm border border-stone-200/80"
            >
              <ShoppingBag className="w-4 h-4 text-orange-600" />
              <span>Cart</span>
              {cartCount > 0 ? (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-orange-600 rounded-full animate-pulse">
                  {cartCount}
                </span>
              ) : (
                <span className="text-xs text-stone-400">0</span>
              )}
            </Link>

            {/* User State */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="text-right">
                  <span className="block text-xs font-bold text-stone-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[11px] text-stone-500 font-medium">
                    {user.email === 'demo@noodleverse.com' ? 'Demo Account' : user.email}
                  </span>
                </div>
                <button
                  id="nav-logout-btn"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Logout"
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <button
                  id="quick-demo-login-btn"
                  onClick={handleDemoQuickLogin}
                  disabled={isLoggingInDemo}
                  className="px-2.5 py-1.5 text-xs font-bold text-orange-700 bg-orange-100/70 hover:bg-orange-200/80 rounded-lg border border-orange-300 transition-colors"
                  title="Click to instantly sign in as Demo User"
                >
                  {isLoggingInDemo ? 'Signing In...' : '⚡ Quick Demo User'}
                </button>
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all hover:shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            <Link
              to="/wishlist"
              id="mobile-wishlist-btn"
              className="relative p-2 text-stone-700 hover:text-red-600"
              title="Wishlist"
            >
              <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              id="mobile-cart-btn"
              className="relative p-2 text-stone-700 hover:text-orange-600"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-orange-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2"
          >
            <Store className="w-4 h-4 text-orange-600" />
            <span>Explore Restaurants (Hyderabad)</span>
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50"
          >
            Explore All Noodles
          </Link>
          <Link
            to="/build-bowl"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-orange-600 bg-orange-50"
          >
            🍜 Build Your Bowl
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>My Wishlist</span>
            </span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50"
          >
            My Orders & Flavor Passport
          </Link>
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-stone-50"
          >
            + Add a Noodle (Vendor)
          </Link>

          <div className="pt-3 border-t border-stone-200">
            {user ? (
              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-sm font-bold text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleDemoQuickLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-orange-800 bg-orange-100 rounded-lg"
                >
                  ⚡ Quick Demo Login (demo@noodleverse.com)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-bold text-white bg-orange-600 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-bold text-stone-700 bg-stone-100 rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
