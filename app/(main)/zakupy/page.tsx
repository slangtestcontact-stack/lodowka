'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, ShoppingCart, Check, Trash2 } from 'lucide-react';
import { ShoppingItem } from '@/lib/types';
import {
  getShoppingItems, addShoppingItem, updateShoppingItem,
  deleteShoppingItem, generateId,
} from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function ZakupyPage() {
  const [items, setItems]           = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => setItems(getShoppingItems()), []);
  useEffect(() => { load(); }, [load]);

  const active = items.filter(i => !i.purchased)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const purchased = items.filter(i => i.purchased)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) { setInputError('Podaj nazwę'); return; }
    addShoppingItem({ id: generateId(), name, purchased: false, createdAt: new Date().toISOString() });
    setInputValue('');
    setInputError('');
    load();
    inputRef.current?.focus();
  }

  function toggle(item: ShoppingItem) {
    updateShoppingItem({ ...item, purchased: !item.purchased });
    load();
  }

  function remove(id: string) {
    deleteShoppingItem(id);
    load();
  }

  function clearPurchased() {
    purchased.forEach(i => deleteShoppingItem(i.id));
    load();
  }

  const isEmpty = items.length === 0;

  return (
    <div className="px-4 pt-6 pb-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900 font-poppins">Zakupy</h1>
        {active.length > 0 && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-600">
            {active.length} {active.length === 1 ? 'pozycja' : active.length < 5 ? 'pozycje' : 'pozycji'}
          </span>
        )}
      </div>

      {/* Add input */}
      <div className="mb-5">
        <div className={cn(
          'flex items-center gap-2 bg-white rounded-2xl border px-4 py-2 transition-all duration-200',
          inputError
            ? 'border-red-300'
            : 'border-gray-200 focus-within:border-green-400/60 focus-within:shadow-[0_0_0_3px_rgba(34,197,94,0.10)]'
        )} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <ShoppingCart size={15} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); setInputError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Dodaj produkt do listy..."
            className="flex-1 h-9 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleAdd}
            className="h-8 w-8 rounded-xl bg-green-500 flex items-center justify-center text-white flex-shrink-0 transition-all active:scale-90"
            aria-label="Dodaj"
          >
            <Plus size={16} />
          </button>
        </div>
        {inputError && <p className="text-xs text-red-500 mt-1.5 ml-1">{inputError}</p>}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-white rounded-2xl px-4 py-12 flex flex-col items-center text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
            <ShoppingCart size={24} />
          </div>
          <p className="text-sm font-bold text-gray-700 font-poppins">Lista zakupów jest pusta</p>
          <p className="text-xs text-gray-400 mt-1">Wpisz nazwę produktu powyżej, aby go dodać.</p>
        </div>
      )}

      {!isEmpty && (
        <div className="space-y-4">

          {/* DO KUPIENIA */}
          {active.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                Do kupienia ({active.length})
              </p>
              <div className="space-y-2">
                {active.map((item, i) => (
                  <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 25}ms` }}>
                    <ShoppingRow item={item} onToggle={() => toggle(item)} onDelete={() => remove(item.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KUPIONE */}
          {purchased.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Kupione ({purchased.length})
                </p>
                <button
                  onClick={clearPurchased}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-500 transition-colors"
                >
                  Wyczyść
                </button>
              </div>
              <div className="space-y-2">
                {purchased.map(item => (
                  <ShoppingRow key={item.id} item={item} onToggle={() => toggle(item)} onDelete={() => remove(item.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Row component ─── */
interface ShoppingRowProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
}

function ShoppingRow({ item, onToggle, onDelete }: ShoppingRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 transition-all duration-200',
      item.purchased ? 'border-gray-100 opacity-60' : 'border-gray-100',
    )} style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>

      {/* Toggle circle */}
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
        )}
        aria-label={item.purchased ? 'Odznacz' : 'Zaznacz jako kupione'}
      >
        {item.purchased && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-semibold leading-snug',
          item.purchased ? 'line-through text-gray-400' : 'text-gray-900'
        )}>
          {item.name}
        </p>
        {(item.quantity || item.unit) && (
          <p className="text-xs text-gray-400 mt-0.5">{item.quantity} {item.unit}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
        aria-label="Usuń"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
