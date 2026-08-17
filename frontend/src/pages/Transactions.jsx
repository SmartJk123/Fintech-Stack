import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Receipt } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';
import TransactionRow from '@/components/TransactionRow';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { transactionService } from '@/lib/mock/services';

const typeFilters = [
  { id: 'all', label: 'All' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdraw', label: 'Withdrawals' },
  { id: 'buy', label: 'Buys' },
  { id: 'sell', label: 'Sells' },
  { id: 'send', label: 'Sent' },
  { id: 'receive', label: 'Received' },
];

const statusFilters = [
  { id: 'all', label: 'All statuses' },
  { id: 'completed', label: 'Completed' },
  { id: 'processing', label: 'Processing' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
];

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    transactionService.getTransactions().then((txns) => {
      setTransactions(txns);
      setLoading(false);
    });
  }, []);

  const filtered = transactions.filter(
    (t) =>
      (type === 'all' || t.type === type) &&
      (status === 'all' || t.status === status),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} transaction{filtered.length === 1 ? '' : 's'}
          </p>
        </div>
        <DemoBadge compact />
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setType(f.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-semibold',
              type === f.id ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setStatus(f.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold',
              status === f.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="rounded-2xl border border-border bg-card px-4 shadow-sm">
        {loading ? (
          <LoadingSkeleton className="p-4" lines={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions found"
            description="Try a different filter, or make your first deposit to get started."
          />
        ) : (
          filtered.map((txn) => (
            <TransactionRow key={txn.id} txn={txn} linkTo={`/app/transactions/${txn.id}`} />
          ))
        )}
      </div>
    </div>
  );
}
