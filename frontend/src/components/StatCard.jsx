import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @param {{ label: string, value: any, sublabel?: string, icon?: any, trend?: number, accent?: 'primary' | 'gold' | 'emerald' | 'rose', className?: string }} props
 */
export default function StatCard({ label, value, sublabel, icon: Icon, trend, accent = 'primary', className }) {
  const accentMap = {
    primary: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400',
    gold: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400',
    emerald: 'from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400',
    rose: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400',
  };
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br', accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {(sublabel || trend !== undefined) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {trend !== undefined && (
            <span className={cn('font-semibold', trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
            </span>
          )}
          {sublabel && <span className="text-muted-foreground">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
