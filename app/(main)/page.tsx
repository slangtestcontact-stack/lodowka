'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package2, Clock, ShoppingCart, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { EmptyState } from '@/components/shared/EmptyState';
import { Product } from '@/lib/types';
import { getProducts, addProduct, generateId, getShoppingItems, initializeSampleData } from '@/lib/storage';
import { getExpirationStatus } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [shoppingCount, setShoppingCount] = useState(0);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [greeting, setGreeting] = useState('Dzień dobry');

  const load = useCallback(() => {
    initializeSampleData();
    setProducts(getProducts());
    setShoppingCount(getShoppingItems().filter((i) => !i.purchased).length);
  }, []);

  useEffect(() => {
    load();
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting('Dzień dobry');
    else if (h >= 12 && h < 18) setGreeting('Dobry wieczór');
    else setGreeting('Dobranoc');
  }, [load]);

  const expiringSoon = products
    .filter((p) => {
      const s = getExpirationStatus(p.expirationDate);
      return s === 'today' || s === 'soon' || s === 'expired';
    })
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
    .slice(0, 3);

  const expiredCount = products.filter((p) => getExpirationStatus(p.expirationDate) === 'expired').length;
  const soonCount = products.filter((p) => {
    const s = getExpirationStatus(p.expirationDate);
    return s === 'today' || s === 'soon';
  }).length;

  function handleAddProduct(values: {
    name: string; quantity: number; unit: string; category: string; expirationDate: string;
  }) {
    addProduct({ id: generateId(), ...values, createdAt: new Date().toISOString() });
    load();
    setShowAddSheet(false);
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-1">{greeting}!</p>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight font-poppins">
          Twoja kuchnia,{' '}
          <span style={{ color: '#10B881' }}>pod kontrolą.</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        <StatCard
          icon={<Package2 className="h-5 w-5" />}
          label="Wszystkie produkty"
          value={products.length}
          color="blue"
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Na liście zakupów"
          value={shoppingCount}
          color="green"
          onClick={() => router.push('/zakupy')}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Kończy się wkrótce"
          value={soonCount}
          color="orange"
          onClick={() => router.push('/powiadomienia')}
        />
        <StatCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Przeterminowane"
          value={expiredCount}
          color="red"
          onClick={() => router.push('/powiadomienia')}
        />
      </div>

      {/* Expiring Soon */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 font-poppins">Kończą się wkrótce</h2>
          {expiringSoon.length > 0 && (
            <button
              onClick={() => router.push('/zapasy')}
              className="text-sm font-semibold"
              style={{ color: '#10B881' }}
            >
              Zobacz wszystkie
            </button>
          )}
        </div>

        {expiringSoon.length === 0 ? (
          <EmptyState
            icon={<Package2 className="h-6 w-6" />}
            title="Wszystkie produkty są świeże"
            description="Nie masz produktów, które wkrótce wygasną."
          />
        ) : (
          <div className="space-y-2.5">
            {expiringSoon.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => router.push(`/zapasy/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="w-full h-13 py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #10B881 0%, #0ea572 100%)', boxShadow: '0 4px 20px rgba(16,184,129,0.35)' }}
      >
        <Plus className="h-5 w-5" />
        Dodaj produkt
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'green' | 'blue' | 'orange' | 'red';
  onClick?: () => void;
}

const colorMap = {
  green: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-[#10B881]',
    value: 'text-[#10B881]',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    value: 'text-blue-700',
  },
  orange: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    value: 'text-amber-600',
  },
  red: {
    iconBg: 'bg-red-100',
    iconText: 'text-red-500',
    value: 'text-red-500',
  },
};

function StatCard({ icon, label, value, color, onClick }: StatCardProps) {
  const c = colorMap[color];
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-50 flex flex-col gap-2.5 transition-all duration-150',
        onClick ? 'active:scale-[0.97] cursor-pointer hover:shadow-md' : 'cursor-default'
      )}
    >
      <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0', c.iconBg, c.iconText)}>
        {icon}
      </div>
      <div>
        <p className={cn('text-2xl font-bold font-poppins leading-none', c.value)}>{value}</p>
        <p className="text-xs text-gray-400 mt-1 leading-snug font-jakarta">{label}</p>
      </div>
    </button>
  );
}
