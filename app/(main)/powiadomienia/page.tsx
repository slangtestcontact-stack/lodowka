'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { ExpirationBadge } from '@/components/shared/ExpirationBadge';
import { Product } from '@/lib/types';
import { getProducts, initializeSampleData } from '@/lib/storage';
import { getExpirationStatus, formatExpirationDate, getExpirationBadgeLabel } from '@/lib/date-utils';
import { getCategoryEmoji, getCategoryBg } from '@/lib/category-utils';
import { cn } from '@/lib/utils';

export default function PowiadomieniaPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const load = useCallback(() => {
    initializeSampleData();
    setProducts(getProducts());
  }, []);

  useEffect(() => { load(); }, [load]);

  const expired = products.filter(p => getExpirationStatus(p.expirationDate) === 'expired');
  const today   = products.filter(p => getExpirationStatus(p.expirationDate) === 'today');
  const soon    = products.filter(p => getExpirationStatus(p.expirationDate) === 'soon');
  const total   = expired.length + today.length + soon.length;

  return (
    <div className="px-4 pt-6 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900 font-poppins">Powiadomienia</h1>
        <div className="relative">
          <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <Bell size={17} />
          </div>
          {total > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
              {total > 9 ? '9+' : total}
            </span>
          )}
        </div>
      </div>

      {total > 0 && (
        <p className="text-sm text-gray-400 mb-5">
          {total} {total === 1 ? 'produkt wymaga' : total < 5 ? 'produkty wymagają' : 'produktów wymaga'} uwagi
        </p>
      )}

      {/* Empty state */}
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 animate-scale-in">
          <div className="h-20 w-20 rounded-3xl bg-green-50 flex items-center justify-center mb-5">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h3 className="text-base font-bold text-gray-800 font-poppins mb-1.5">Wszystko w porządku!</h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Brak przeterminowanych ani kończących się produktów. Twoja spiżarnia jest świeża!
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-slide-up">
          {expired.length > 0 && (
            <NotifGroup
              title="Przeterminowane"
              accent="red"
              products={expired}
              onProductClick={id => router.push(`/zapasy/${id}`)}
            />
          )}
          {today.length > 0 && (
            <NotifGroup
              title="Kończy się dzisiaj"
              accent="orange"
              products={today}
              onProductClick={id => router.push(`/zapasy/${id}`)}
            />
          )}
          {soon.length > 0 && (
            <NotifGroup
              title="Kończy się w ciągu 3 dni"
              accent="amber"
              products={soon}
              onProductClick={id => router.push(`/zapasy/${id}`)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Notification group ─── */
type Accent = 'red' | 'orange' | 'amber';

const accentStyles: Record<Accent, {
  header: string; badge: string; dot: string;
}> = {
  red:    { header: 'bg-red-50 border-red-100',    badge: 'bg-red-100 text-red-600',    dot: 'bg-red-500' },
  orange: { header: 'bg-orange-50 border-orange-100', badge: 'bg-orange-100 text-orange-600', dot: 'bg-orange-500' },
  amber:  { header: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-600', dot: 'bg-amber-400' },
};

interface NotifGroupProps {
  title: string;
  accent: Accent;
  products: Product[];
  onProductClick: (id: string) => void;
}

function NotifGroup({ title, accent, products, onProductClick }: NotifGroupProps) {
  const s = accentStyles[accent];
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.055)' }}>
      {/* Group header */}
      <div className={cn('flex items-center gap-3 px-4 py-3 border-b', s.header)}>
        <span className={cn('h-2 w-2 rounded-full flex-shrink-0', s.dot)} />
        <span className="text-sm font-bold text-gray-800 font-poppins flex-1">{title}</span>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', s.badge)}>
          {products.length}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {products.map(product => {
          const status     = getExpirationStatus(product.expirationDate);
          const badgeLabel = getExpirationBadgeLabel(product.expirationDate);
          const dateStr    = formatExpirationDate(product.expirationDate);
          const emoji      = getCategoryEmoji(product.category);
          const emojiBg    = getCategoryBg(product.category);

          return (
            <button
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className={cn('flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center text-xl', emojiBg)}>
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {product.quantity} {product.unit} · {dateStr}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <ExpirationBadge status={status} label={badgeLabel} size="sm" bold />
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
