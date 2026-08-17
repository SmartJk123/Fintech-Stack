import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import DemoBadge from '@/components/DemoBadge';
import { transactionService } from '@/lib/mock/services';
import { formatCurrency, formatKES, formatDate, txnTypeInfo, toKES } from '@/lib/utils';

export default function TransactionDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    transactionService.getTransaction(id).then(t => {
      setTxn(t);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!txn) return (
    <div className="mx-auto max-w-2xl">
      <Link to="/app/transactions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <p className="mt-8 text-center text-muted-foreground">Transaction not found.</p>
    </div>
  );

  const info = txnTypeInfo(txn.type);
  const kesValue = txn.kesValue || toKES(txn.amount, txn.asset);

  const details = [
    { label: 'Transaction ID', value: txn.id },
    { label: 'Reference', value: txn.reference },
    { label: 'Type', value: info.label, capitalize: true },
    { label: 'Asset', value: txn.asset },
    { label: 'Amount', value: formatCurrency(txn.amount, txn.asset) },
    { label: 'KES Value', value: formatKES(kesValue) },
    { label: 'Fee', value: txn.fee ? formatCurrency(txn.fee, txn.asset) : 'Free' },
    { label: 'Status', value: <StatusBadge status={txn.status} /> },
    { label: 'Date', value: formatDate(txn.date, { time: true }) },
    { label: 'Method', value: txn.method },
    { label: 'Counterparty', value: txn.counterparty },
    { label: 'Network', value: txn.network },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/app/transactions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to transactions
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transaction Details</h1>
        <DemoBadge compact />
      </div>

      {/* Receipt-style card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center border-b border-dashed border-border pb-6 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${info.bg}`}>
            <span className={`text-2xl font-bold ${info.color}`}>{info.sign}</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold">{info.sign}{formatCurrency(txn.amount, txn.asset)}</h2>
          <p className="text-sm text-muted-foreground">{formatKES(kesValue)}</p>
          <div className="mt-3"><StatusBadge status={txn.status} /></div>
        </div>

        {/* Details */}
        <div className="space-y-3 py-4">
          {details.map((d, i) => (
            <div key={i} className="flex items-start justify-between gap-4 text-sm">
              <span className="shrink-0 text-muted-foreground">{d.label}</span>
              <span className={`text-right font-medium ${d.capitalize ? 'capitalize' : ''} ${d.label === 'Status' ? '' : 'break-all'}`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>

        {/* Blockchain ref for crypto */}
        {txn.network && txn.network !== 'M-Pesa' && txn.network !== 'Bank' && txn.network !== 'Internal' && (
          <div className="border-t border-dashed border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blockchain Reference</p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              0x{Math.random().toString(16).slice(2)}a3b4c5d6e7f8{Math.random().toString(16).slice(2, 10)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-2 border-t border-border pt-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
            <Download className="h-4 w-4" /> Download
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}