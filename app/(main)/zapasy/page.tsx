'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ArrowUpDown, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { Product, PRODUCT_CATEGORIES } from '@/lib/types';
import { getProducts, addProduct, generateId } from '@/lib/storage';
import { cn } from '@/lib/utils';

type SortOption = 'expiration_asc' | 'expiration_desc' | 'name_asc';

const sortLabels: Record<SortOption, string> = {
  expiration_asc:  'Data ważności ↑',
  expiration_desc: 'Data ważności ↓',
  name_asc:        'Nazwa A–Z',
};

const ALL_CAT = '';

export default function ZapasyPage() {
  const router = useRouter();
  const [products, setProducts]     = useState<Product[]>([]);
  const [search, setSearch]         = useState('');
  const [selectedCat, setSelectedCat] = useState(ALL_CAT);
  const [sort, setSort]             = useState<SortOption>('expiration_asc');
  const [showAddSheet, setShowAddSheet] = useState(false);

  const load = useCallback(() => setProducts(getProducts()), []);
  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCat && p.category !== selectedCat) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'expiration_asc')  return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      if (sort === 'expiration_desc') return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
      return a.name.localeCompare(b.name, 'pl');
    });

  function handleAddProduct(values: {
    name: string; quantity: number; unit: string; category: string; expirationDate: string;
  }) {
    addProduct({ id: generateId(), ...values, createdAt: new Date().toISOString() });
    load();
    setShowAddSheet(false);
  }

  const cycleSort = () => {
    const opts: SortOption[] = ['expiration_asc', 'expiration_desc', 'name_asc'];
    setSort(s => opts[(opts.indexOf(s) + 1) % opts.length]);
  };

  const countLabel = filtered.length === 0 ? 'Brak wyników'
    : `${filtered.length} ${filtered.length === 1 ? 'produkt' : filtered.length < 5 ? 'produkty' : 'produktów'}`;

  return (
    <div className="px-4 pt-6 pb-4 relative min-h-screen">

      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900 font-poppins mb-4">Zapasy</h1>

      {/* Search + sort */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Szukaj produktów..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/60 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={cycleSort}
          className="h-11 w-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-green-500/30 transition-colors flex-shrink-0"
          title={sortLabels[sort]}
        >
          <ArrowUpDown size={15} />
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
        {[ALL_CAT, ...PRODUCT_CATEGORIES].map(cat => (
          <button
            key={cat || 'all'}
            onClick={() => setSelectedCat(cat)}
            className={cn(
              'flex-shrink-0 px-3.5 h-8 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap',
              selectedCat === cat
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-green-300'
            )}
          >
            {cat || 'Wszystkie'}
          </button>
        ))}
      </div>

      {/* Count + sort label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-gray-400 font-medium">{countLabel}</p>
        <button onClick={cycleSort} className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
          Sortuj: {sortLabels[sort]}
        </button>
      </div>

      {/* Product list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl px-4 py-12 flex flex-col items-center text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
            <Package size={24} />
          </div>
          <p className="text-sm font-bold text-gray-700 font-poppins">
            {search || selectedCat ? 'Brak wyników' : 'Brak produktów'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {search || selectedCat ? 'Zmień kryteria wyszukiwania.' : 'Dodaj pierwszy produkt do spiżarni.'}
          </p>
          {!search && !selectedCat && (
            <button
              onClick={() => setShowAddSheet(true)}
              className="mt-4 h-10 px-5 rounded-xl bg-green-500 text-white text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={15} /> Dodaj produkt
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 pb-24">
          {filtered.map((p, i) => (
            <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              <ProductCard product={p} onClick={() => router.push(`/zapasy/${p.id}`)} />
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed bottom-[76px] right-4 h-14 w-14 bg-green-500 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
        style={{ boxShadow: '0 6px 24px rgba(34,197,94,0.40)' }}
        aria-label="Dodaj produkt"
      >
        <Plus size={22} />
      </button>

      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] overflow-y-auto px-5 pt-5">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-bold font-poppins">Nowy produkt</SheetTitle>
          </SheetHeader>
          <ProductForm onSave={handleAddProduct} onCancel={() => setShowAddSheet(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
