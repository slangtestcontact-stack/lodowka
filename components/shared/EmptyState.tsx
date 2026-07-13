'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-14 px-6', className)}>
      <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-700 font-poppins mb-1.5">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
