'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Package2, Clock, ShoppingCart, AlertCircle,
  Target, AlertTriangle, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { Product, ShoppingItem } from '@/lib/types';
import {
  getProducts, addProduct, generateId,
  getShoppingItems, initializeSampleData,
} from '@/lib/storage';
import { getExpirationStatus, getDaysUntilExpiration } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

/* ─── Daily task types ─── */
type TaskType = 'expired' | 'today' | 'soon' | 'buy';

interface DailyTask {
  id: string;
  text: string;
  type: TaskType;
}

const taskIcon: Record<TaskType, React.ReactNode> = {
  expired: <AlertTriangle size={14} />,
  today:   <AlertTriangle size={14} />,
  soon:    <Clock size={14} />,
  buy:     <ShoppingCart size={14} />,
};

const taskStyle: Record<TaskType, { ring: string; icon: string; text: string }> = {
  expired: { ring: 'bg-red-100',   icon: 'text-red-500',   text: 'text-gray-800' },
  today:   { ring: 'bg-orange-100',icon: 'text-orange-500',text: 'text-gray-800' },
  soon:    { ring: 'bg-amber-100', icon: 'text-amber-600', text: 'text-gray-800' },
  buy:     { ring: 'bg-green-100', icon: 'text-green-600', text: 'text-gray-700' },
};

function buildDailyTasks(products: Product[], shopping: ShoppingItem[]): DailyTask[] {
  const tasks: DailyTask[] = [];

  products
    .filter(p => getExpirationStatus(p.expirationDate) === 'expired')
    .slice(0, 2)
    .forEach(p => tasks.push({ id: `exp-${p.id}`, text: `Zużyj ${p.name}`, type: 'expired' }));

  products
    .filter(p => getExpirationStatus(p.expirationDate) === 'today')
    .slice(0, 1)
    .forEach(p => tasks.push({ id: `tod-${p.id}`, text: `${p.name} wygasa dzisiaj`, type: 'today' }));

  products
    .filter(p => getExpirationStatus(p.expirationDate) === 'soon' && getDaysUntilExpiration(p.expirationDate) === 1)
    .slice(0, 1)
    .forEach(p => tasks.push({ id: `soo-${p.id}`, text: `${p.name} kończy się jutro`, type: 'soon' }));

  shopping
    .filter(i => !i.purchased)
    .slice(0, Math.max(0, 4 - tasks.length))
    .forEach(i => tasks.push({ id: `buy-${i.id}`, text: `Kup ${i.name}`, type: 'buy' }));

  return tasks.slice(0, 4);
}

/* ─── Main page ─── */
export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [greeting, setGreeting] = useState('Dzień dobry');

  const load = useCallback(() => {
    initializeSampleData();
    setProducts(getProducts());
    setShopping(getShoppingItems());
  }, []);

  useEffect(() => {
    load();
    const h = new Date().getHours();
    if (h >= 5 && h < 12)       setGreeting('Dzień dobry');
    else if (h >= 12 && h < 19) setGreeting('Dobry wieczór');
    else                         setGreeting('Dobranoc');
  }, [load]);

  const expiringSoon = products
    .filter(p => ['today', 'soon', 'expired'].includes(getExpirationStatus(p.expirationDate)))
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
    .slice(0, 3);

  const expiredCount = products.filter(p => getExpirationStatus(p.expirationDate) === 'expired').length;
  const soonCount    = products.filter(p => ['today', 'soon'].includes(getExpirationStatus(p.expirationDate))).length;
  const shoppingPending = shopping.filter(i => !i.purchased).length;
  const tasks = buildDailyTasks(products, shopping);
  const urgentTotal = expiredCount + soonCount;

  function handleAddProduct(values: {
    name: string; quantity: number; unit: string; category: string; expirationDate: string;
  }) {
    addProduct({ id: generateId(), ...values, createdAt: new Date().toISOString() });
    load();
    setShowAddSheet(false);
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">

      {/* ── Greeting hero ── */}
      <div className="animate-slide-up">
        <div className="flex items-start justify-between mb-1">
          <p className="text-[15px] font-medium text-gray-400">{greeting}!</p>
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight font-poppins mb-2">
          Twoja kuchnia,{' '}
          <span className="text-green-500">pod kontrolą.</span>
        </h1>
        {urgentTotal > 0 ? (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500 leading-snug">
              Masz dziś{' '}
              <span className="font-semibold text-gray-700">{urgentTotal}</span>{' '}
              {urgentTotal === 1 ? 'produkt' : urgentTotal < 5 ? 'produkty' : 'produktów'} do sprawdzenia.
            </p>
            <button
              onClick={() => router.push('/powiadomienia')}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold transition-all active:scale-95"
            >
              Przejdź <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Wszystkie produkty są świeże 🎉</p>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '40ms' }}>
        <StatCard icon={<Package2 size={18} />}     label="Produkty"           value={products.length}  color="blue"   />
        <StatCard icon={<ShoppingCart size={18} />} label="Na liście zakupów"  value={shoppingPending}  color="green"  onClick={() => router.push('/zakupy')} />
        <StatCard icon={<Clock size={18} />}         label="Kończy się wkrótce" value={soonCount}         color="amber"  onClick={() => router.push('/powiadomienia')} />
        <StatCard icon={<AlertCircle size={18} />}  label="Przeterminowane"    value={expiredCount}     color="red"    onClick={() => router.push('/powiadomienia')} />
      </div>

      {/* ── Dzisiejsze zadania ── */}
      <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-green-50 flex items-center justify-center">
            <Target size={14} className="text-green-500" />
          </div>
          <h2 className="text-[15px] font-bold text-gray-900 font-poppins">Dzisiejsze zadania</h2>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.055)' }}>
          {tasks.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={15} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-500">Nie masz żadnych zadań na dziś!</p>
            </div>
          ) : (
            tasks.map((task, i) => {
              const s = taskStyle[task.type];
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3',
                    i < tasks.length - 1 && 'border-b border-gray-50'
                  )}
                >
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0', s.ring, s.icon)}>
                    {taskIcon[task.type]}
                  </div>
                  <span className={cn('text-sm font-medium', s.text)}>{task.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Kończą się wkrótce ── */}
      <div className="animate-slide-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900 font-poppins">Kończą się wkrótce</h2>
          {expiringSoon.length > 0 && (
            <button
              onClick={() => router.push('/zapasy')}
              className="text-sm font-semibold text-green-500 flex items-center gap-1"
            >
              Zobacz wszystkie <ArrowRight size={13} />
            </button>
          )}
        </div>

        {expiringSoon.length === 0 ? (
          <div className="bg-white rounded-2xl px-4 py-6 flex flex-col items-center text-center" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
              <CheckCircle2 size={22} className="text-green-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700 font-poppins">Wszystkie produkty są świeże</p>
            <p className="text-xs text-gray-400 mt-1">Nie masz produktów wygasających wkrótce.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {expiringSoon.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => router.push(`/zapasy/${p.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Add product button ── */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] animate-slide-up"
        style={{
          animationDelay: '160ms',
          background: 'linear-gradient(135deg, #22C55E 0%, #16a34a 100%)',
          boxShadow: '0 4px 20px rgba(34,197,94,0.38)',
        }}
      >
        <Plus size={18} />
        Dodaj produkt
      </button>

      {/* ── Sheet ── */}
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

/* ─── StatCard ─── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'green' | 'blue' | 'amber' | 'red';
  onClick?: () => void;
}

const statColor = {
  green: { ring: 'bg-green-100',  icon: 'text-green-500',  val: 'text-green-600'  },
  blue:  { ring: 'bg-blue-100',   icon: 'text-blue-500',   val: 'text-blue-700'   },
  amber: { ring: 'bg-amber-100',  icon: 'text-amber-500',  val: 'text-amber-600'  },
  red:   { ring: 'bg-red-100',    icon: 'text-red-500',    val: 'text-red-500'    },
};

function StatCard({ icon, label, value, color, onClick }: StatCardProps) {
  const c = statColor[color];
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-4 text-left flex flex-col gap-2.5 transition-all duration-200',
        onClick ? 'active:scale-[0.96] cursor-pointer' : 'cursor-default'
      )}
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.055)' }}
    >
      <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', c.ring, c.icon)}>
        {icon}
      </div>
      <div>
        <p className={cn('text-[26px] font-bold font-poppins leading-none', c.val)}>{value}</p>
        <p className="text-[11px] text-gray-400 mt-1 leading-snug">{label}</p>
      </div>
    </button>
  );
}
