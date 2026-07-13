'use client';

import { ExpirationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExpirationBadgeProps {
  status: ExpirationStatus;
  label: string;
  size?: 'sm' | 'md';
  bold?: boolean;
}

const statusConfig: Record<ExpirationStatus, { bg: string; text: string }> = {
  valid: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  soon: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
  },
  today: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
  },
  expired: {
    bg: 'bg-red-500',
    text: 'text-white',
  },
};

const boldConfig: Record<ExpirationStatus, { bg: string; text: string }> = {
  valid: {
    bg: 'bg-emerald-500',
    text: 'text-white',
  },
  soon: {
    bg: 'bg-amber-500',
    text: 'text-white',
  },
  today: {
    bg: 'bg-orange-500',
    text: 'text-white',
  },
  expired: {
    bg: 'bg-red-500',
    text: 'text-white',
  },
};

export function ExpirationBadge({ status, label, size = 'md', bold = false }: ExpirationBadgeProps) {
  const config = bold ? boldConfig[status] : statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-xs'
      )}
    >
      {label}
    </span>
  );
}
