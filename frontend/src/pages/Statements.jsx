import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';
import { formatKES, formatDate } from '@/lib/utils';

export default function Statements() {
  const [type, setType] = useState('account');

  const statements = [
    { id: 1, period: 'August 2026', type: 'Account', date: '2026-08-01', opening: 1150000, credits: 195000, debits: 96000, fees: 1850, closing: 1248650 },
    { id: 2, period: 'July 2026', type: 'Account', date: '2026-07-01', opening: 1080000, credits: 210000, debits: 140000, fees: 2200, closing: 1150000 },
    { id: 3, period: 'June 2026', type: 'Account', date: '2026-06-01', opening: 950000, credits: 185000, debits: 55000, fees: 1500, closing: 1080000 },
    { id: 4, period: 'August 2026', type: 'Transaction', date: '2026-08-12', opening: 1150000, credits: 195000, debits: 96000, fees: 1850, closing: 1248650 },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statements</h1>
          <p className="text-sm text-muted-foreground">Download your account and transaction statements</p>
        </div>
        <DemoBadge />
      </div>

      {/* Statement type filter */}
      <div className="flex flex-wrap gap-2">
        {['account', 'transaction', 'wallet'].map(t => (
          <button key={t} onClick={() => setType(t)} className={cn('rounded-lg px-4 py-1.5 text-sm font-semibold capitalize', type === t ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted')}>{t} statements</button>
        ))}
      </div>

      {/* Current statement preview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold">Account Statement</h3>
            <p className="text-sm text-muted-foreground">August 2026</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Download className="h-4 w-4" /> Download PDF</button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Opening Balance</p><p className="mt-1 text-lg font-bold">{formatKES(1150000)}</p></div>
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10"><p className="text-xs text-muted-foreground">Total Credits</p><p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatKES(195000)}</p></div>
          <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-500/10"><p className="text-xs text-muted-foreground">Total Debits</p><p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">{formatKES(96000)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Total Fees</p><p className="mt-1 text-lg font-bold">{formatKES(1850)}</p></div>
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-4"><p className="text-xs text-muted-foreground">Closing Balance</p><p className="mt-1 text-lg font-bold">{formatKES(1248650)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Net Change</p><p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">+{formatKES(98650)}</p></div>
        </div>
      </div>

      {/* Previous statements */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Previous Statements</h3>
        <div className="mt-4 space-y-2">
          {statements.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><FileText className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.period} · {s.type} Statement</p>
                <p className="text-xs text-muted-foreground">Generated {formatDate(s.date, { dateOnly: true })}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">Closing</p>
                <p className="text-sm font-bold">{formatKES(s.closing)}</p>
              </div>
              <button className="rounded-lg border border-border p-2 hover:bg-muted"><Download className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}