import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading authentic noodles...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin"></div>
        <span className="text-2xl animate-bounce">🍜</span>
      </div>
      <p className="text-sm font-bold text-stone-700">{message}</p>
      <p className="text-xs text-stone-400 mt-1">Preparing fresh broth & noodles</p>
    </div>
  );
};
