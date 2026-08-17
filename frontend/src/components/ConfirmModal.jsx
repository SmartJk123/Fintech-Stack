import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/15' },
  error: { icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/15' },
  warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/15' },
  security: { icon: ShieldCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/15' },
};

export default function ConfirmModal({ open, onClose, onConfirm, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', type = 'security', loading = false }) {
  if (!open) return null;
  const { icon: Icon, color, bg } = config[type] || config.security;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className={cn('mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full', bg)}>
          <Icon className={cn('h-7 w-7', color)} />
        </div>
        <h2 className="text-center text-xl font-bold">{title}</h2>
        {children && <div className="mt-3 text-center text-sm text-muted-foreground">{children}</div>}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Verifying...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}