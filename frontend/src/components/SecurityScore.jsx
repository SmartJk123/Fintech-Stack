import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

/**
 * @param {{ score: number, className?: string }} props
 */
export default function SecurityScore({ score, className }) {
  const level = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
  const config = {
    high: { icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', ring: 'stroke-emerald-500', label: 'Strong' },
    medium: { icon: Shield, color: 'text-amber-600 dark:text-amber-400', ring: 'stroke-amber-500', label: 'Fair' },
    low: { icon: ShieldAlert, color: 'text-rose-600 dark:text-rose-400', ring: 'stroke-rose-500', label: 'Weak' },
  };
  const { icon: Icon, color, ring, label } = config[level];
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" className="fill-none stroke-muted" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36"
            className={cn('fill-none transition-all duration-700', ring)}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Icon className={cn('h-5 w-5', color)} />
          <span className="text-lg font-bold">{label} Security</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {level === 'high' ? 'Your account is well protected.' : level === 'medium' ? 'Some improvements recommended.' : 'Action needed to secure account.'}
        </p>
      </div>
    </div>
  );
}
