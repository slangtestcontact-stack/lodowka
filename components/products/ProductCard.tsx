'use client';

import { Product } from '@/lib/types';
import { getExpirationStatus, getExpirationBadgeLabel, formatExpirationDate } from '@/lib/date-utils';
import { getCategoryEmoji, getCategoryBg } from '@/lib/category-utils';
import { ExpirationBadge } from '@/components/shared/ExpirationBadge';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const status = getExpirationStatus(product.expirationDate);
  const badgeLabel = getExpirationBadgeLabel(product.expirationDate);
  const dateStr = formatExpirationDate(product.expirationDate);
  const emoji = getCategoryEmoji(product.category);
  const emojiBg = getCategoryBg(product.category);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-sm p-3.5 flex items-center gap-3.5 transition-all duration-150 active:scale-[0.98] hover:shadow-md border border-gray-50"
    >
      {/* Category emoji circle */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${emojiBg} flex items-center justify-center text-2xl`}>
        {emoji}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm font-poppins leading-snug truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {product.quantity} {product.unit}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {dateStr}
        </p>
      </div>

      {/* Expiration badge */}
      <div className="flex-shrink-0">
        <ExpirationBadge status={status} label={badgeLabel} size="sm" />
      </div>
    </button>
  );
}
