'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Główna', icon: Home },
  { href: '/zapasy', label: 'Zapasy', icon: Package },
  { href: '/zakupy', label: 'Zakupy', icon: ShoppingCart },
  { href: '/powiadomienia', label: 'Powiadomienia', icon: Bell },
];

interface BottomNavProps {
  notificationCount?: number;
}

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto px-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const isBell = href === '/powiadomienia';
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-1 transition-opacity duration-100"
            >
              <div className={cn(
                'relative flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-150',
                isActive ? 'bg-emerald-50' : ''
              )}>
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] transition-all duration-150',
                    isActive ? 'text-[#10B881]' : 'text-gray-400'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isBell && notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 leading-none">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none',
                isActive ? 'text-[#10B881]' : 'text-gray-400'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
