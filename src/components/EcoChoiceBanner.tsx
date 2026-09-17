import React from 'react';
import { Leaf, CheckCircle2 } from 'lucide-react';

interface EcoChoiceBannerProps {
  showPlantBasedMessage?: boolean;
  minimalPackaging?: boolean;
  onTogglePackaging?: (val: boolean) => void;
  interactive?: boolean;
}

export const EcoChoiceBanner: React.FC<EcoChoiceBannerProps> = ({
  showPlantBasedMessage = true,
  minimalPackaging = false,
  onTogglePackaging,
  interactive = false,
}) => {
  return (
    <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 my-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
          <Leaf className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-emerald-950">
              NoodleVerse Eco Choice
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-800">
              SUSTAINABLE
            </span>
          </div>

          {showPlantBasedMessage && (
            <p className="text-xs sm:text-sm text-emerald-900 mt-1 leading-relaxed">
              🌱 <span className="font-semibold">Great choice!</span> This meal supports a more sustainable food option by featuring delicious plant-based or vegetarian ingredients.
            </p>
          )}

          {interactive && onTogglePackaging && (
            <div className="mt-3 pt-3 border-t border-emerald-200/70">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="minimal-packaging-checkbox"
                  checked={minimalPackaging}
                  onChange={(e) => onTogglePackaging(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-emerald-400 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-semibold text-emerald-900">
                  Use minimal / reusable eco packaging
                </span>
              </label>

              {minimalPackaging && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>🌱 Thanks for choosing a lower-waste option!</span>
                </div>
              )}
            </div>
          )}

          {!interactive && minimalPackaging && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-lg inline-flex">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>🌱 Minimal/reusable eco packaging selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
