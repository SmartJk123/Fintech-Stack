import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Clock, Loader2, AlertCircle,
} from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import DemoBadge from '@/components/DemoBadge';
import StepIndicator from '@/components/StepIndicator';
import SuccessModal from '@/components/SuccessModal';
import { tradingService } from '@/lib/mock/services';
import { formatCurrency, formatKES } from '@/lib/utils';
import { ASSETS } from '@/lib/mock/data';

const cryptoAssets = ['BTC', 'ETH', 'USDT', 'USDC'];
const steps = ['Select', 'Amount', 'Quote', 'Review', 'Done'];
const presetAmounts = [5000, 10000, 25000, 50000];

export default function Buy() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [asset, setAsset] = useState(params.get('asset') || 'BTC');
  const [amountKES, setAmountKES] = useState('');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (asset) setStep(0);
  }, []);

  // Quote expiration timer
  useEffect(() => {
    if (step === 2 && quote) {
      setTimeLeft(120);
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, quote]);

  const handleGetQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await tradingService.getQuote({ side: 'buy', asset, amountKES: parseFloat(amountKES) });
      setQuote(q);
      setStep(2);
    } catch (e) {
      setError('Failed to get quote. Please try again.');
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setStep(3);
    setProcessing(true);
    try {
      const result = await tradingService.executeOrder(quote);
      setProcessing(false);
      setSuccess(true);
      setStep(4);
    } catch (e) {
      setProcessing(false);
      setError('Transaction failed. Please try again.');
    }
  };

  const reset = () => {
    setStep(0);
    setAsset('BTC');
    setAmountKES('');
    setQuote(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buy Crypto</h1>
          <p className="text-sm text-muted-foreground">Purchase digital assets with KES</p>
        </div>
        <DemoBadge />
      </div>

      {step < 4 && <StepIndicator steps={steps} current={step} className="px-2" />}

      {/* Step 0: Select Asset */}
      {step === 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Select an asset to buy</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {cryptoAssets.map(code => {
              const info = ASSETS[code];
              return (
                <button
                  key={code}
                  onClick={() => { setAsset(code); setStep(1); }}
                  className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/40 hover:shadow-elite"
                >
                  <AssetIcon asset={code} size={40} />
                  <div>
                    <p className="font-semibold">{code}</p>
                    <p className="text-xs text-muted-foreground">{info.name}</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Enter Amount */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <AssetIcon asset={asset} size={40} />
            <div>
              <p className="font-semibold">Buy {ASSETS[asset].name}</p>
              <p className="text-xs text-muted-foreground">Pay with KES balance</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-muted-foreground">Amount in KES</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">KSh</span>
              <input
                type="number"
                value={amountKES}
                onChange={e => setAmountKES(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-muted/30 py-4 pl-16 pr-4 text-2xl font-bold outline-none focus:border-primary focus:bg-card"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {presetAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmountKES(String(amt))}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:bg-muted"
                >
                  {formatKES(amt, 0)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              Back
            </button>
            <button
              onClick={handleGetQuote}
              disabled={!amountKES || parseFloat(amountKES) < 100 || loading}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Getting quote...' : 'Get Quote'}
            </button>
          </div>
          {amountKES && parseFloat(amountKES) < 100 && (
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">Minimum amount is KSh 100</p>
          )}
        </div>
      )}

      {/* Step 2: Quote */}
      {step === 2 && quote && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Quote Summary</h3>
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', timeLeft > 30 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400')}>
              <Clock className="h-3.5 w-3.5" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm text-muted-foreground">You pay</span>
              <span className="text-lg font-bold">{formatKES(quote.amountKES)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-4">
              <span className="text-sm font-medium">You receive</span>
              <div className="text-right">
                <span className="text-lg font-bold">{formatCurrency(quote.assetAmount, asset)}</span>
                <p className="text-xs text-muted-foreground">{asset}</p>
              </div>
            </div>
            <div className="space-y-2 px-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange rate</span>
                <span className="font-medium">1 {asset} = {formatKES(quote.price, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee (0.5%)</span>
                <span className="font-medium">{formatKES(quote.fee)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatKES(quote.amountKES)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={timeLeft === 0}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Review Order
            </button>
          </div>
          {timeLeft === 0 && (
            <button onClick={handleGetQuote} className="mt-2 w-full text-sm text-primary hover:underline">Quote expired — get new quote</button>
          )}
        </div>
      )}

      {/* Step 3: Review / Processing */}
      {step === 3 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          {processing ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Processing your order...</h3>
              <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
            </div>
          ) : (
            <>
              <h3 className="text-base font-semibold">Review & Confirm</h3>
              <div className="mt-4 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Asset</span><span className="font-medium">{ASSETS[asset].name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{formatKES(quote.amountKES)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">You receive</span><span className="font-medium">{formatCurrency(quote.assetAmount, asset)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">{formatKES(quote.fee)}</span></div>
                <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold">Total</span><span className="font-bold">{formatKES(quote.amountKES)}</span></div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                By confirming, you agree to execute this buy order at the locked rate. This is a simulated transaction in demo mode.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
                  Back
                </button>
                <button onClick={handleConfirm} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Confirm Buy
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error state */}
      {error && step !== 4 && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Success modal */}
      <SuccessModal
        open={success}
        onClose={reset}
        title="Buy Order Complete!"
        actionLabel="View Transactions"
        onAction={() => { window.location.href = '/app/transactions'; }}
      >
        <p>You successfully purchased <strong>{formatCurrency(quote?.assetAmount || 0, asset)}</strong> {asset}</p>
        <p className="text-xs">Reference: {quote && `EW-BUY-${Date.now().toString().slice(-4)}`}</p>
      </SuccessModal>
    </div>
  );
}