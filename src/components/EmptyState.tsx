import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🍜',
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 max-w-lg mx-auto my-8">
      <span className="text-5xl sm:text-6xl mb-4 transform hover:scale-110 transition-transform">
        {icon}
      </span>
      <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
