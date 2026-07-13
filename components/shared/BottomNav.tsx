'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Główna', icon: Home },
  { href: '/zapasy', label: 'Zapasy', icon: Package },
  { href: '/zakupy', label: 'Zakupy', icon: ShoppingCart },
  { href: '/powiadomienia', label: 'Powiad.', icon: Bell },
];

interface BottomNavProps {
  notificationCount?: number;
}

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 safe-area-bottom"
      style={{ boxShadow: '0 -1px 16px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center h-[60px] max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          const isBell = href === '/powiadomienia';
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full relative transition-opacity"
            >
              {/* Active indicator dot at top */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-b-full bg-green-500" />
              )}

              {/* Icon container */}
              <div className={cn(
                'relative h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200',
                isActive ? 'bg-green-50' : ''
              )}>
                <Icon
                  className={cn('transition-all duration-200', isActive ? 'text-green-500' : 'text-gray-400')}
                  size={isActive ? 20 : 19}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isBell && notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={cn(
                'text-[10px] font-semibold leading-none transition-colors duration-200',
                isActive ? 'text-green-500' : 'text-gray-400'
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
