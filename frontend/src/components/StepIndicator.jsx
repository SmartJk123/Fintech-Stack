import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @param {{ steps: any[], current: number, className?: string }} props
 */
export default function StepIndicator({ steps, current, className }) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all',
              i < current && 'bg-primary text-primary-foreground',
              i === current && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
              i > current && 'bg-muted text-muted-foreground'
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn(
              'hidden text-xs font-medium sm:block',
              i <= current ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('mx-1 h-0.5 flex-1 sm:mx-2', i < current ? 'bg-primary' : 'bg-muted')} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
