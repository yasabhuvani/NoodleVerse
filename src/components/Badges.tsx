import React from 'react';
import { DietType, SpiceLevel } from '../types';

export const SpiceBadge: React.FC<{ level: SpiceLevel; className?: string }> = ({ level, className = '' }) => {
  switch (level) {
    case 'MILD':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span>🌶️</span>
          <span>Mild</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <span>🌶️🌶️</span>
          <span>Medium</span>
        </span>
      );
    case 'HOT':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200 ${className}`}>
          <span>🌶️🌶️🌶️</span>
          <span>Hot</span>
        </span>
      );
    case 'EXTRA_HOT':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 ${className}`}>
          <span>🌶️🌶️🌶️🌶️</span>
          <span>Extra Hot</span>
        </span>
      );
    default:
      return null;
  }
};

export const DietBadge: React.FC<{ diet: DietType; className?: string }> = ({ diet, className = '' }) => {
  switch (diet) {
    case 'VEGETARIAN':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
          <span>🥬 Vegetarian</span>
        </span>
      );
    case 'VEGAN':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>🌱 Vegan</span>
        </span>
      );
    case 'NON_VEGETARIAN':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          <span>🍗 Non-Veg</span>
        </span>
      );
    case 'SEAFOOD':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
          <span>🦐 Seafood</span>
        </span>
      );
    case 'EGG':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
          <span>🥚 Egg</span>
        </span>
      );
    default:
      return null;
  }
};
