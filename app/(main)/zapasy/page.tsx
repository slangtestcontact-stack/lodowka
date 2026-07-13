'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, SlidersHorizontal, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { EmptyState } from '@/components/shared/EmptyState';
import { Product, PRODUCT_CATEGORIES } from '@/lib/types';
import { getProducts, addProduct, generateId } from '@/lib/storage';
import { cn } from '@/lib/utils';

type SortOption = 'expiration_asc' | 'expiration_desc' | 'name_asc';

const sortLabels: Record<SortOption, string> = {
  expiration_asc: 'Data ważności ↑',
  expiration_desc: 'Data ważności ↓',
  name_asc: 'Nazwa A–Z',
};

const ALL_CAT = '';

export default function ZapasyPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(ALL_CAT);
  const [sort, setSort] = useState<SortOption>('expiration_asc');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const load = useCallback(() => setProducts(getProducts()), []);
  useEffect(() => { load(); }, [load]);

  const filtered = products
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCat && p.category !== selectedCat) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'expiration_asc')
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      if (sort === 'expiration_desc')
        return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
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
    setSort((s) => opts[(opts.indexOf(s) + 1) % opts.length]);
  };

  return (
    <div className="px-4 pt-6 pb-4 relative min-h-screen">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900 font-poppins mb-4">Zapasy</h1>

      {/* Search row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Szukaj produktów..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#10B881]/20 focus:border-[#10B881] transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={cycleSort}
          className="h-11 px-3.5 rounded-2xl border border-gray-200 bg-white flex items-center gap-1.5 text-xs font-semibold text-gray-600 flex-shrink-0 hover:border-[#10B881]/40 transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{sortLabels[sort]}</span>
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {[ALL_CAT, ...PRODUCT_CATEGORIES].map((cat) => (
          <button
            key={cat || 'all'}
            onClick={() => setSelectedCat(cat)}
            className={cn(
              'flex-shrink-0 px-4 h-8 rounded-full text-xs font-semibold transition-all duration-150',
              selectedCat === cat
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-[#10B881]/30'
            )}
            style={selectedCat === cat ? { backgroundColor: '#10B881' } : {}}
          >
            {cat || 'Wszystkie'}
          </button>
        ))}
      </div>

      {/* Sort label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {filtered.length === 0
            ? 'Brak wyników'
            : `${filtered.length} ${filtered.length === 1 ? 'produkt' : filtered.length < 5 ? 'produkty' : 'produktów'}`}
        </p>
        <button onClick={cycleSort} className="text-xs text-gray-400 font-medium">
          Sortuj: {sortLabels[sort]}
        </button>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title={search || selectedCat ? 'Brak wyników' : 'Brak produktów'}
          description={
            search || selectedCat
              ? 'Zmień kryteria wyszukiwania.'
              : 'Dodaj pierwszy produkt do spiżarni.'
          }
          action={
            !search && !selectedCat ? (
              <button
                onClick={() => setShowAddSheet(true)}
                className="h-11 px-5 rounded-2xl text-white text-sm font-semibold flex items-center gap-2"
                style={{ backgroundColor: '#10B881' }}
              >
                <Plus className="h-4 w-4" />
                Dodaj produkt
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2.5 pb-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => router.push(`/zapasy/${p.id}`)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed bottom-[76px] right-4 h-14 w-14 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-95"
        style={{ backgroundColor: '#10B881', boxShadow: '0 4px 20px rgba(16,184,129,0.4)' }}
        aria-label="Dodaj produkt"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[92vh] overflow-y-auto px-5 pt-5">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-bold font-poppins">Nowy produkt</SheetTitle>
          </SheetHeader>
          <ProductForm
            onSave={handleAddProduct}
            onCancel={() => setShowAddSheet(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
