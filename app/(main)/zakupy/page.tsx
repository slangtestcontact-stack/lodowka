'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, ShoppingCart, Check, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShoppingItem } from '@/lib/types';
import {
  getShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  generateId,
} from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function ZakupyPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => setItems(getShoppingItems()), []);
  useEffect(() => { load(); }, [load]);

  const active = items
    .filter((i) => !i.purchased)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const purchased = items
    .filter((i) => i.purchased)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) { setInputError('Podaj nazwę'); return; }
    addShoppingItem({
      id: generateId(),
      name,
      purchased: false,
      createdAt: new Date().toISOString(),
    });
    setInputValue('');
    setInputError('');
    load();
    inputRef.current?.focus();
  }

  function togglePurchased(item: ShoppingItem) {
    updateShoppingItem({ ...item, purchased: !item.purchased });
    load();
  }

  function handleDelete(id: string) {
    deleteShoppingItem(id);
    load();
  }

  function clearPurchased() {
    purchased.forEach((i) => deleteShoppingItem(i.id));
    load();
  }

  const isEmpty = items.length === 0;

  return (
    <div className="px-4 pt-6 pb-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900 font-poppins">Zakupy</h1>
        {active.length > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#10B881]">
            {active.length} {active.length === 1 ? 'pozycja' : active.length < 5 ? 'pozycje' : 'pozycji'}
          </span>
        )}
      </div>

      {/* Inline Add Input */}
      <div className="mb-5">
        <div className={cn(
          'flex items-center gap-2 bg-white rounded-2xl border shadow-sm px-4 py-2 transition-all',
          inputError ? 'border-red-300' : 'border-gray-200 focus-within:border-[#10B881]/50 focus-within:shadow-md'
        )}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Dodaj produkt do listy..."
            className="flex-1 h-9 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleAdd}
            className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white transition-all active:scale-95"
            style={{ backgroundColor: '#10B881' }}
            aria-label="Dodaj"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {inputError && <p className="text-xs text-red-500 mt-1 ml-1">{inputError}</p>}
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="Lista zakupów jest pusta"
          description="Wpisz nazwę produktu powyżej, aby dodać go do listy."
        />
      ) : (
        <div className="space-y-5">
          {/* Active items */}
          {active.length > 0 && (
            <div className="space-y-2">
              {active.map((item) => (
                <ShoppingRow
                  key={item.id}
                  item={item}
                  onToggle={() => togglePurchased(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          )}

          {/* Purchased section */}
          {purchased.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Kupione ({purchased.length})
                </p>
                <button
                  onClick={clearPurchased}
                  className="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors"
                >
                  Wyczyść
                </button>
              </div>
              <div className="space-y-2">
                {purchased.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => togglePurchased(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ShoppingRowProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
}

function ShoppingRow({ item, onToggle, onDelete }: ShoppingRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 bg-white rounded-2xl border px-4 py-3 transition-all duration-200 shadow-sm',
      item.purchased ? 'border-gray-100 opacity-70' : 'border-gray-100'
    )}>
      {/* Toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          item.purchased
            ? 'border-[#10B881]'
            : 'border-gray-300 hover:border-[#10B881]/60'
        )}
        style={item.purchased ? { backgroundColor: '#10B881' } : {}}
        aria-label={item.purchased ? 'Odznacz' : 'Zaznacz jako kupione'}
      >
        {item.purchased && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-semibold text-gray-900 leading-snug font-jakarta',
          item.purchased && 'line-through text-gray-400'
        )}>
          {item.name}
        </p>
        {(item.quantity || item.unit) && (
          <p className="text-xs text-gray-400 mt-0.5">
            {item.quantity} {item.unit}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-gray-200 hover:text-red-400 hover:bg-red-50 transition-colors"
        aria-label="Usuń"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
