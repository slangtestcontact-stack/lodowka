'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
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

  const expired = products.filter((p) => getExpirationStatus(p.expirationDate) === 'expired');
  const today = products.filter((p) => getExpirationStatus(p.expirationDate) === 'today');
  const soon = products.filter((p) => getExpirationStatus(p.expirationDate) === 'soon');
  const total = expired.length + today.length + soon.length;

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-poppins">Powiadomienia</h1>
          {total > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              {total} {total === 1 ? 'produkt wymaga' : total < 5 ? 'produkty wymagają' : 'produktów wymaga'} uwagi
            </p>
          )}
        </div>
        {total > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-500">
            {total}
          </span>
        )}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-[#10B881]" />
          </div>
          <h3 className="text-base font-bold text-gray-800 font-poppins mb-1">Wszystko w porządku!</h3>
          <p className="text-sm text-gray-400">Brak przeterminowanych ani kończących się produktów.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expired.length > 0 && (
            <NotifGroup
              title="Przeterminowane"
              headerColor="bg-red-50 border-red-100"
              badgeColor="bg-red-100 text-red-600"
              products={expired}
              onProductClick={(id) => router.push(`/zapasy/${id}`)}
            />
          )}
          {today.length > 0 && (
            <NotifGroup
              title="Kończy się dzisiaj"
              headerColor="bg-orange-50 border-orange-100"
              badgeColor="bg-orange-100 text-orange-600"
              products={today}
              onProductClick={(id) => router.push(`/zapasy/${id}`)}
            />
          )}
          {soon.length > 0 && (
            <NotifGroup
              title="Kończy się w ciągu 3 dni"
              headerColor="bg-amber-50 border-amber-100"
              badgeColor="bg-amber-100 text-amber-600"
              products={soon}
              onProductClick={(id) => router.push(`/zapasy/${id}`)}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface NotifGroupProps {
  title: string;
  headerColor: string;
  badgeColor: string;
  products: Product[];
  onProductClick: (id: string) => void;
}

function NotifGroup({ title, headerColor, badgeColor, products, onProductClick }: NotifGroupProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className={cn('flex items-center justify-between px-4 py-2.5 border-b', headerColor)}>
        <span className="text-sm font-bold text-gray-800 font-poppins">{title}</span>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', badgeColor)}>
          {products.length}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {products.map((product) => {
          const status = getExpirationStatus(product.expirationDate);
          const badgeLabel = getExpirationBadgeLabel(product.expirationDate);
          const dateStr = formatExpirationDate(product.expirationDate);
          const emoji = getCategoryEmoji(product.category);
          const emojiBg = getCategoryBg(product.category);

          return (
            <button
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              {/* Emoji */}
              <div className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl', emojiBg)}>
                {emoji}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate font-jakarta">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.quantity} {product.unit} · {dateStr}</p>
              </div>
              {/* Badge */}
              <ExpirationBadge status={status} label={badgeLabel} size="sm" bold />
            </button>
          );
        })}
      </div>
    </div>
  );
}
