import React from 'react';
import { Globe, Award, Compass } from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/api';

interface FlavorPassportCardProps {
  orders: Order[];
}

export const FlavorPassportCard: React.FC<FlavorPassportCardProps> = ({ orders }) => {
  const passport = orderService.getFlavorPassport(orders);

  if (passport.countries.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/70 border border-orange-200/80 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900">
              🌎 Your Flavor Passport
            </h3>
            <p className="text-xs text-stone-500">
              Collect stamps from global noodle cultures with every order!
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-orange-100">
          Your passport is waiting for its first stamp! Place your first order to start unlocking global cuisines from Tokyo to Bangkok.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Decorative Passport Background Pattern */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-orange-400 font-extrabold block">
              Official Culinary Record
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              🌎 Your Flavor Passport
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-center">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
              Cuisines
            </span>
            <span className="text-lg font-black text-orange-400">
              {passport.totalCuisines}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-center">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
              Bowls Slurped
            </span>
            <span className="text-lg font-black text-amber-400">
              {passport.totalBowls}
            </span>
          </div>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="mt-5">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
          Countries Explored ({passport.countries.length})
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {passport.countries.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60 hover:border-orange-500/40 transition-colors"
            >
              <span className="text-2xl">{c.flag}</span>
              <div>
                <span className="text-sm font-bold text-stone-200 block leading-tight">
                  {c.name}
                </span>
                <span className="text-[11px] text-stone-400">
                  {c.count} {c.count === 1 ? 'bowl' : 'bowls'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-800/70 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-orange-400" />
          <span className="font-semibold text-stone-300">
            {passport.totalCuisines >= 5
              ? '🏆 Master Noodle Diplomat'
              : passport.totalCuisines >= 3
              ? '🌟 Globetrotter Foodie'
              : '🥢 Curious Slurper'}
          </span>
        </span>
        <span className="text-stone-500">
          "Taste the World, One Noodle at a Time."
        </span>
      </div>
    </div>
  );
};
