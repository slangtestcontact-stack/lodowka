'use client';

import { Product } from '@/lib/types';
import {
  getExpirationStatus,
  getExpirationBadgeLabel,
  formatExpirationDate,
} from '@/lib/date-utils';
import { getCategoryEmoji, getCategoryBg, getCategoryPill } from '@/lib/category-utils';
import { ExpirationBadge } from '@/components/shared/ExpirationBadge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, CheckCircle, ShoppingCart, Hash, Calendar, Tag, Activity } from 'lucide-react';
import { ExpirationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: Product;
  isOnShoppingList: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMarkUsed: () => void;
  onAddToShoppingList: () => void;
}

const statusLabels: Record<ExpirationStatus, string> = {
  expired: 'Przeterminowane',
  today:   'Wygasa dzisiaj',
  soon:    'Kończy się wkrótce',
  valid:   'Świeży',
};

const statusTextColor: Record<ExpirationStatus, string> = {
  expired: 'text-red-500 font-bold',
  today:   'text-orange-500 font-bold',
  soon:    'text-amber-600 font-semibold',
  valid:   'text-green-500 font-semibold',
};

export function ProductDetail({
  product, isOnShoppingList, onEdit, onDelete, onMarkUsed, onAddToShoppingList,
}: ProductDetailProps) {
  const status = getExpirationStatus(product.expirationDate);
  const badgeLabel = getExpirationBadgeLabel(product.expirationDate);
  const dateStr = formatExpirationDate(product.expirationDate);
  const emoji = getCategoryEmoji(product.category);
  const emojiBg = getCategoryBg(product.category);
  const categoryPill = getCategoryPill(product.category);

  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <div className={cn('relative w-full h-44 rounded-2xl flex items-center justify-center mb-5', emojiBg)}>
        <span className="text-8xl select-none">{emoji}</span>
        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          <ExpirationBadge status={status} label={badgeLabel} bold />
        </div>
      </div>

      {/* Name + category pill */}
      <div className="mb-1">
        <h2 className="text-xl font-bold text-gray-900 font-poppins leading-tight">{product.name}</h2>
      </div>
      <div className="mb-5">
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', categoryPill)}>
          {product.category}
        </span>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl overflow-hidden mb-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <DetailRow icon={<Hash className="h-3.5 w-3.5" />} label="Ilość" value={`${product.quantity} ${product.unit}`} />
        <DetailRow icon={<Calendar className="h-3.5 w-3.5" />} label="Data ważności" value={dateStr} />
        <DetailRow
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Status"
          value={<span className={statusTextColor[status]}>{statusLabels[status]}</span>}
        />
        <DetailRow icon={<Tag className="h-3.5 w-3.5" />} label="Kategoria" value={product.category} />
      </div>

      {/* Actions — order matches reference: add→edit→used→delete */}
      <div className="space-y-2.5">
        {/* Primary: Add to shopping list */}
        <button
          onClick={onAddToShoppingList}
          disabled={isOnShoppingList}
          className={cn(
            'w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]',
            isOnShoppingList
              ? 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-green-50 border border-green-200 text-green-600 hover:bg-green-100'
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOnShoppingList ? 'Już na liście zakupów' : 'Dodaj do listy zakupów'}
        </button>

        {/* Secondary: Edit */}
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4" />
          Edytuj produkt
        </button>

        {/* Secondary: Mark used */}
        <button
          onClick={onMarkUsed}
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] hover:bg-gray-100"
        >
          <CheckCircle className="h-4 w-4" />
          Oznacz jako zużyty
        </button>

        {/* Danger: Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm transition-all duration-200 active:scale-[0.98] hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
              Usuń produkt
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-poppins">Usuń produkt</AlertDialogTitle>
              <AlertDialogDescription>
                Czy na pewno chcesz usunąć <strong>{product.name}</strong>? Tej operacji nie można cofnąć.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Anuluj</AlertDialogCancel>
              <AlertDialogAction className="rounded-xl bg-red-500 hover:bg-red-600" onClick={onDelete}>
                Usuń
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0 gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <span className="text-sm text-gray-500 flex-shrink-0 w-28">{label}</span>
      <div className="flex-1 text-sm font-semibold text-gray-800 text-right">
        {value}
      </div>
    </div>
  );
}
