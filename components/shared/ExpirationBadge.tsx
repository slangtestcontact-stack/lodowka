'use client';

import { ExpirationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExpirationBadgeProps {
  status: ExpirationStatus;
  label: string;
  size?: 'sm' | 'md';
  bold?: boolean;
}

/* Light variant — used in product cards / lists */
const lightConfig: Record<ExpirationStatus, string> = {
  valid:   'bg-green-100 text-green-700',
  soon:    'bg-amber-100 text-amber-700',
  today:   'bg-orange-100 text-orange-700',
  expired: 'bg-red-100 text-red-600',
};

/* Bold / solid variant — used in notifications / hero badge */
const boldConfig: Record<ExpirationStatus, string> = {
  valid:   'bg-green-500 text-white',
  soon:    'bg-amber-500 text-white',
  today:   'bg-orange-500 text-white',
  expired: 'bg-red-500 text-white',
};

export function ExpirationBadge({ status, label, size = 'md', bold = false }: ExpirationBadgeProps) {
  const cls = bold ? boldConfig[status] : lightConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap select-none',
        cls,
        size === 'sm' ? 'px-2.5 py-[3px] text-[11px]' : 'px-3 py-1 text-xs'
      )}
    >
      {label}
    </span>
  );
}
