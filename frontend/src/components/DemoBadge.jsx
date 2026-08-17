import React from 'react';
import { cn } from '@/lib/utils';

// Demo mode badge — elegant but visible indicator
/**
 * @param {{ className?: string, compact?: boolean }} props
 */
export default function DemoBadge({ className, compact = false }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>
      {compact ? 'Demo' : 'Demo Mode'}
    </span>
  );
}
