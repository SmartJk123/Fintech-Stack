import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function SuccessModal({ open, onClose, title, children, actionLabel = 'Done', onAction }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-center text-xl font-bold">{title}</h2>
        {children && <div className="mt-3 space-y-2 text-center text-sm text-muted-foreground">{children}</div>}
        <button
          onClick={onAction || onClose}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}