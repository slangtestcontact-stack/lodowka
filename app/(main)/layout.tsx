'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/shared/BottomNav';
import { getProducts, initializeSampleData } from '@/lib/storage';
import { getExpirationStatus } from '@/lib/date-utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    initializeSampleData();
    const products = getProducts();
    const count = products.filter((p) => {
      const s = getExpirationStatus(p.expirationDate);
      return s === 'expired' || s === 'today' || s === 'soon';
    }).length;
    setNotifCount(count);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col max-w-lg mx-auto">
      <main className="flex-1 overflow-y-auto pb-[60px]">
        {children}
      </main>
      <BottomNav notificationCount={notifCount} />
    </div>
  );
}
