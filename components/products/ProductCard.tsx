'use client';

import { Product } from '@/lib/types';
import { getExpirationStatus, getExpirationBadgeLabel, formatExpirationDate } from '@/lib/date-utils';
import { getCategoryEmoji, getCategoryBg, getCategoryPill } from '@/lib/category-utils';
import { ExpirationBadge } from '@/components/shared/ExpirationBadge';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const categoryPill = getCategoryPill(product.category);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-3.5 flex items-center gap-3.5 transition-all duration-200 active:scale-[0.98] group border border-transparent hover:border-gray-100"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.055)' }}
    >
      {/* Category emoji */}
      <div className={cn(
        'flex-shrink-0 w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-105',
        emojiBg
      )}>
        {emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm font-poppins leading-snug truncate">
          {product.name}
        </p>

        {/* Category pill */}
        <span className={cn('inline-block mt-[3px] mb-[3px] text-[10px] font-semibold px-2 py-[2px] rounded-full', categoryPill)}>
          {product.category}
        </span>

        {/* Quantity + date row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-gray-400">{product.quantity} {product.unit}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            {dateStr}
          </span>
        </div>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0 self-center">
        <ExpirationBadge status={status} label={badgeLabel} size="sm" />
      </div>
    </button>
  );
}
