import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Users, Link as LinkIcon } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import StatusBadge from '@/components/StatusBadge';
import { paymentService } from '@/lib/mock/services';
import { formatKES, formatDate } from '@/lib/utils';

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    paymentService.getBeneficiaries().then(b => { setBeneficiaries(b); setLoading(false); });
  }, []);

  const typeIcons = {
    'elitewallet': Users,
    'mpesa': CreditCard,
    'bank': CreditCard,
    'crypto': LinkIcon,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Manage your payment methods and beneficiaries</p>
        </div>
        <DemoBadge />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="mt-1 text-2xl font-bold">{formatKES(145000)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">↑ 12% vs last month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-1 text-2xl font-bold">{formatKES(25000)}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">2 payments</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Beneficiaries</p>
          <p className="mt-1 text-2xl font-bold">{beneficiaries.length}</p>
          <p className="text-xs text-muted-foreground">Saved contacts</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-elite">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-elite"><Plus className="h-5 w-5 text-white" /></div>
          <div><p className="text-sm font-semibold">Send Money</p><p className="text-xs text-muted-foreground">Quick transfer</p></div>
        </button>
        <button className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-elite">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-elite"><LinkIcon className="h-5 w-5 text-white" /></div>
          <div><p className="text-sm font-semibold">Payment Link</p><p className="text-xs text-muted-foreground">Request payment</p></div>
        </button>
        <button className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-elite">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-elite"><Users className="h-5 w-5 text-white" /></div>
          <div><p className="text-sm font-semibold">Add Beneficiary</p><p className="text-xs text-muted-foreground">Save recipient</p></div>
        </button>
      </div>

      {/* Beneficiaries */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Saved Beneficiaries</h3>
        {loading ? <LoadingSkeleton className="mt-4" lines={4} /> : beneficiaries.length === 0 ? (
          <EmptyState icon={Users} title="No beneficiaries" description="Add a beneficiary to send money quickly." />
        ) : (
          <div className="mt-4 space-y-2">
            {beneficiaries.map(b => {
              const Icon = typeIcons[b.type] || CreditCard;
              return (
                <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.identifier} · {b.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{b.asset}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment history */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Recent Payments</h3>
        <div className="mt-4 space-y-2">
          {[
            { id: 1, recipient: 'Grace Kariuki', amount: 5000, status: 'completed', date: '2026-08-05', method: 'EliteWallet Transfer' },
            { id: 2, recipient: 'M-Pesa 254742', amount: 20000, status: 'completed', date: '2026-08-08', method: 'M-Pesa' },
            { id: 3, recipient: 'Acme Ltd', amount: 45000, status: 'pending', date: '2026-08-11', method: 'Payment Link' },
          ].map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.recipient}</p>
                <p className="text-xs text-muted-foreground">{p.method} · {formatDate(p.date, { dateOnly: true })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatKES(p.amount)}</p>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}