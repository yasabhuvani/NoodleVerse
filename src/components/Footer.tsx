import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-3xl">🍜</span>
              <span className="text-2xl font-black text-white tracking-tight">
                Noodle<span className="text-orange-500">Verse</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 mt-1 font-medium">
              Taste the World, One Noodle at a Time.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-stone-300">
            <Link to="/products" className="hover:text-orange-400 transition-colors">
              Explore
            </Link>
            <span className="text-stone-600">•</span>
            <Link to="/build-bowl" className="hover:text-orange-400 transition-colors">
              Build Your Bowl
            </Link>
            <span className="text-stone-600">•</span>
            <Link to="/orders" className="hover:text-orange-400 transition-colors">
              Orders
            </Link>
            <span className="text-stone-600">•</span>
            <Link to="/sell" className="hover:text-orange-400 transition-colors">
              Add a Noodle
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p>© 2026 NoodleVerse. Built for WEB2CART Full-Stack Challenge.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <span className="text-orange-500">❤️</span>
            <span>for noodle & ramen lovers worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
