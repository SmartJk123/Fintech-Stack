import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Smartphone, Building2, Bitcoin, Loader2, Shield } from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import DemoBadge from '@/components/DemoBadge';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';
import { depositService, walletService } from '@/lib/mock/services';
import { formatKES, formatCurrency } from '@/lib/utils';
import { ASSETS } from '@/lib/mock/data';

const methods = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, asset: 'KES' },
  { id: 'bank', label: 'Bank', icon: Building2, asset: 'KES' },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, asset: 'BTC' },
];

export default function Withdraw() {
  const [method, setMethod] = useState('mpesa');
  const [cryptoAsset, setCryptoAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    walletService.getWallet().then(setAccounts);
  }, []);

  const currentAsset = method === 'crypto' ? cryptoAsset : 'KES';
  const currentAccount = accounts.find(a => a.asset === currentAsset);
  const available = currentAccount?.balance || 0;
  const fee = method === 'mpesa' ? 35 : method === 'bank' ? 50 : (cryptoAsset === 'BTC' ? 0.0001 : 0.001);

  const handleWithdraw = async () => {
    setSecurityOpen(false);
    setProcessing(true);
    const res = await depositService.createWithdrawal({
      method, amount: parseFloat(amount), asset: currentAsset,
      destination, network: ASSETS[currentAsset]?.network,
    });
    setResult(res);
    setProcessing(false);
    setSuccess(true);
  };

  const reset = () => { setAmount(''); setDestination(''); setSuccess(false); setResult(null); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Withdraw</h1>
          <p className="text-sm text-muted-foreground">Cash out to M-Pesa, bank, or crypto wallet</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {methods.map(m => {
          const Icon = m.icon;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all', method === m.id ? 'border-primary bg-primary/5 shadow-elite' : 'border-border hover:border-primary/40')}>
              <Icon className={cn('h-7 w-7', method === m.id ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-sm font-semibold">{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {method === 'crypto' && (
          <div className="mb-4">
            <label className="text-sm font-medium">Select asset</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {['BTC', 'ETH', 'USDT', 'USDC'].map(code => (
                <button key={code} onClick={() => setCryptoAsset(code)} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold', cryptoAsset === code ? 'border-primary bg-primary/5' : 'border-border')}>
                  <AssetIcon asset={code} size={24} /> {code}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-muted/50 p-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Available balance</span><span className="font-bold">{formatCurrency(available, currentAsset)}</span></div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Amount {method !== 'crypto' && '(KES)'}</label>
          <div className="relative mt-1">
            {method !== 'crypto' && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">KSh</span>}
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={cn('w-full rounded-xl border border-border bg-muted/30 py-4 text-2xl font-bold outline-none focus:border-primary focus:bg-card', method !== 'crypto' ? 'pl-16' : 'pl-4')} />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fee: {method === 'crypto' ? formatCurrency(fee, cryptoAsset) : formatKES(fee)}</span>
            <button onClick={() => setAmount(String(available))} className="font-medium text-primary hover:underline">Max</button>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">{method === 'mpesa' ? 'M-Pesa Phone Number' : method === 'bank' ? 'Bank Account Number' : 'Wallet Address'}</label>
          <input value={destination} onChange={e => setDestination(e.target.value)} placeholder={method === 'mpesa' ? '+254 7XX XXX XXX' : method === 'bank' ? '0112345678901' : 'bc1q...'} className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
        </div>

        {method === 'bank' && (
          <div className="mt-4">
            <label className="text-sm font-medium">Bank</label>
            <select className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary">
              <option>Equity Bank</option>
              <option>KCB</option>
              <option>Cooperative Bank</option>
              <option>Stanbic Bank</option>
            </select>
          </div>
        )}

        {/* Summary */}
        {amount && (
          <div className="mt-4 rounded-xl bg-muted/50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{method === 'crypto' ? formatCurrency(parseFloat(amount), currentAsset) : formatKES(parseFloat(amount))}</span></div>
            <div className="flex justify-between mt-1"><span className="text-muted-foreground">Fee</span><span className="font-medium">{method === 'crypto' ? formatCurrency(fee, cryptoAsset) : formatKES(fee)}</span></div>
            <div className="flex justify-between mt-2 border-t border-border pt-2"><span className="font-semibold">You receive</span><span className="font-bold">{method === 'crypto' ? formatCurrency(parseFloat(amount) - fee, currentAsset) : formatKES(parseFloat(amount) - fee)}</span></div>
            <div className="flex justify-between mt-1"><span className="text-muted-foreground">Estimated arrival</span><span className="font-medium">{method === 'mpesa' ? 'Instant' : method === 'bank' ? '1-2 hours' : '10-30 min'}</span></div>
          </div>
        )}

        <button
          onClick={() => setSecurityOpen(true)}
          disabled={!amount || !destination || parseFloat(amount) > available || processing}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <><Shield className="h-4 w-4" /> Confirm Withdrawal</>}
        </button>
      </div>

      <ConfirmModal
        open={securityOpen}
        onClose={() => setSecurityOpen(false)}
        onConfirm={handleWithdraw}
        title="Confirm Withdrawal"
        type="security"
        confirmLabel="Authorize"
      >
        <p>You are about to withdraw {method === 'crypto' ? formatCurrency(parseFloat(amount || '0'), currentAsset) : formatKES(parseFloat(amount || '0'))} to {destination?.slice(0, 6)}••••</p>
        <p className="text-xs">Enter your transaction PIN to authorize (Demo: 1234)</p>
      </ConfirmModal>

      <SuccessModal
        open={success}
        onClose={reset}
        title="Withdrawal Initiated!"
        actionLabel="View Transactions"
        onAction={() => { window.location.href = '/app/transactions'; }}
      >
        <p>{method === 'crypto' ? formatCurrency(result?.amount || 0, currentAsset) : formatKES(result?.amount || 0)} via {methods.find(m => m.id === method)?.label}</p>
        <p className="text-xs">Reference: {result?.reference}</p>
      </SuccessModal>
    </div>
  );
}
