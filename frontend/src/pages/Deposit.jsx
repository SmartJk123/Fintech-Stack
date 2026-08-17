import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowDownToLine, Smartphone, Building2, Bitcoin, Loader2, AlertCircle } from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import DemoBadge from '@/components/DemoBadge';
import SuccessModal from '@/components/SuccessModal';
import { depositService } from '@/lib/mock/services';
import { formatKES, qrCodeUrl } from '@/lib/utils';
import { ASSETS, DEMO_ADDRESSES } from '@/lib/mock/data';

const methods = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'Instant deposit via M-Pesa', asset: 'KES' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, desc: '1-2 business hours', asset: 'KES' },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, desc: 'Blockchain deposit', asset: 'BTC' },
];

export default function Deposit() {
  const [params] = useSearchParams();
  const [method, setMethod] = useState(params.get('method') || 'mpesa');
  const [cryptoAsset, setCryptoAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  const handleDeposit = async () => {
    setProcessing(true);
    const res = await depositService.createDeposit({
      method, amount: parseFloat(amount), asset: method === 'crypto' ? cryptoAsset : 'KES',
      phone, reference,
    });
    setResult(res);
    setProcessing(false);
    setSuccess(true);
  };

  const reset = () => { setAmount(''); setSuccess(false); setResult(null); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deposit</h1>
          <p className="text-sm text-muted-foreground">Add funds to your EliteWallet account</p>
        </div>
        <DemoBadge />
      </div>

      {/* Method selection */}
      <div className="grid gap-3 sm:grid-cols-3">
        {methods.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all', method === m.id ? 'border-primary bg-primary/5 shadow-elite' : 'border-border hover:border-primary/40')}
            >
              <Icon className={cn('h-7 w-7', method === m.id ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-sm font-semibold">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {method === 'mpesa' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount (KES)</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">KSh</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-border bg-muted/30 py-4 pl-16 pr-4 text-2xl font-bold outline-none focus:border-primary focus:bg-card" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">M-Pesa Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium">Reference (optional)</label>
              <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. Monthly savings" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
              You'll receive an M-Pesa STK push prompt on your phone. Enter your M-Pesa PIN to confirm. No fees apply.
            </div>
          </div>
        )}

        {method === 'bank' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">Equity Bank Kenya</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span className="font-medium">EliteWallet — Amara Mwangi</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account No.</span><span className="font-bold">0112345678901</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SWIFT</span><span className="font-medium">EQBLKENA</span></div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Amount (KES)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium">Reference</label>
              <input value={reference} onChange={e => setReference(e.target.value)} placeholder="EW-AMARA-001" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-700 dark:text-amber-400">Bank transfers typically take 1-2 business hours to reflect. Use your account number as reference.</p>
            </div>
          </div>
        )}

        {method === 'crypto' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select asset</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['BTC', 'ETH', 'USDT', 'USDC'].map(code => (
                  <button key={code} onClick={() => setCryptoAsset(code)} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold', cryptoAsset === code ? 'border-primary bg-primary/5' : 'border-border')}>
                    <AssetIcon asset={code} size={24} /> {code}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl border-2 border-border bg-white p-4">
                <img src={qrCodeUrl(DEMO_ADDRESSES[cryptoAsset])} alt="Deposit QR" width="180" height="180" className="rounded-lg" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Send {cryptoAsset} to this address</p>
            </div>
            <div>
              <label className="text-sm font-medium">Deposit Address ({ASSETS[cryptoAsset].network})</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
                <code className="flex-1 truncate text-sm font-mono">{DEMO_ADDRESSES[cryptoAsset]}</code>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-amber-700 dark:text-amber-400">Only send {cryptoAsset} via the {ASSETS[cryptoAsset].network} network. Minimum confirmations required: {cryptoAsset === 'BTC' ? '3' : '12'}.</p>
            </div>
          </div>
        )}

        {method !== 'crypto' && (
          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) < 100 || processing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <><ArrowDownToLine className="h-4 w-4" /> Deposit {formatKES(parseFloat(amount) || 0)}</>}
          </button>
        )}
      </div>

      <SuccessModal
        open={success}
        onClose={reset}
        title="Deposit Initiated!"
        actionLabel="View Transactions"
        onAction={() => { window.location.href = '/app/transactions'; }}
      >
        <p>{formatKES(result?.amount || 0)} via {methods.find(m => m.id === method)?.label}</p>
        <p className="text-xs">Reference: {result?.reference}</p>
        {method === 'mpesa' && <p className="text-xs text-emerald-600 dark:text-emerald-400">✓ Completed instantly</p>}
        {method === 'bank' && <p className="text-xs text-amber-600 dark:text-amber-400">⏳ Processing in 1-2 hours</p>}
      </SuccessModal>
    </div>
  );
}