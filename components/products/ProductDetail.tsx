'use client';

import { Product } from '@/lib/types';
import { getExpirationStatus, getExpirationBadgeLabel, formatExpirationDate, formatExpirationLabel } from '@/lib/date-utils';
import { getCategoryEmoji, getCategoryBg } from '@/lib/category-utils';
import { ExpirationBadge } from '@/components/shared/ExpirationBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, CheckCircle, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  isOnShoppingList: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMarkUsed: () => void;
  onAddToShoppingList: () => void;
}

export function ProductDetail({
  product,
  isOnShoppingList,
  onEdit,
  onDelete,
  onMarkUsed,
  onAddToShoppingList,
}: ProductDetailProps) {
  const status = getExpirationStatus(product.expirationDate);
  const badgeLabel = getExpirationBadgeLabel(product.expirationDate);
  const longLabel = formatExpirationLabel(product.expirationDate);
  const dateStr = formatExpirationDate(product.expirationDate);
  const emoji = getCategoryEmoji(product.category);
  const emojiBg = getCategoryBg(product.category);

  return (
    <div>
      {/* Hero image */}
      <div className={`w-full h-44 ${emojiBg} rounded-2xl flex items-center justify-center mb-5`}>
        <span className="text-8xl select-none">{emoji}</span>
      </div>

      {/* Name + Badge */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-poppins leading-tight flex-1">{product.name}</h2>
        <ExpirationBadge status={status} label={badgeLabel} bold />
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <DetailRow label="Ilość" value={`${product.quantity} ${product.unit}`} />
        <DetailRow label="Kategoria" value={product.category} />
        <DetailRow label="Data ważności" value={`${dateStr}`} />
        <DetailRow
          label="Status"
          value={<ExpirationBadge status={status} label={longLabel} size="sm" />}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <ActionButton
          icon={<Pencil className="h-4 w-4" />}
          label="Edytuj"
          onClick={onEdit}
          variant="default"
        />
        <ActionButton
          icon={<ShoppingCart className="h-4 w-4" />}
          label={isOnShoppingList ? 'Już na liście zakupów' : 'Dodaj do listy zakupów'}
          onClick={onAddToShoppingList}
          disabled={isOnShoppingList}
          variant="default"
        />
        <ActionButton
          icon={<CheckCircle className="h-4 w-4" />}
          label="Oznacz jako zużyty"
          onClick={onMarkUsed}
          variant="default"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm transition-colors hover:bg-red-50 active:scale-[0.98]">
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
              <AlertDialogAction
                className="rounded-xl bg-red-500 hover:bg-red-600"
                onClick={onDelete}
              >
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
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-sm font-semibold text-gray-800 max-w-[60%] text-right">
        {typeof value === 'string' ? value : value}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

function ActionButton({ icon, label, onClick, disabled, variant = 'default' }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border font-semibold text-sm transition-all active:scale-[0.98] ${
        disabled
          ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
          : variant === 'danger'
          ? 'border-red-200 text-red-500 hover:bg-red-50'
          : 'border-[#10B881]/30 text-[#10B881] hover:bg-emerald-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
