import React from 'react';
import { cn } from '@/lib/utils';
import { statusColor } from '@/lib/utils';

/**
 * @param {{ status: string, className?: string }} props
 */
export default function StatusBadge({ status, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusColor(status), className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {status}
    </span>
  );
}
