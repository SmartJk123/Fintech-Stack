import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @param {{ className?: string, lines?: number, card?: boolean }} props
 */
export default function LoadingSkeleton({ className, lines = 3, card }) {
  if (card) {
    return (
      <div className={cn('rounded-2xl border border-border bg-card p-5', className)}>
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-7 w-32 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-11 w-11 rounded-xl bg-muted animate-pulse" />
        </div>
        <div className="mt-4 h-4 w-20 rounded bg-muted animate-pulse" />
      </div>
    );
  }
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
