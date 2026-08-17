import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Loader2, AlertCircle, User, Globe, Shield,
} from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import DemoBadge from '@/components/DemoBadge';
import StepIndicator from '@/components/StepIndicator';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';
import { paymentService, walletService } from '@/lib/mock/services';
import { formatCurrency, maskAddress } from '@/lib/utils';
import { ASSETS, BENEFICIARIES } from '@/lib/mock/data';

const steps = ['Asset', 'Recipient', 'Amount', 'Review', 'Done'];

export default function Send() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [asset, setAsset] = useState(params.get('asset') || 'KES');
  const [recipientType, setRecipientType] = useState('elitewallet'); // elitewallet | external
  const [recipient, setRecipient] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    walletService.getWallet().then(setAccounts);
  }, []);

  const currentAccount = accounts.find(a => a.asset === asset);
  const available = currentAccount?.balance || 0;
  const fee = ASSETS[asset]?.type === 'crypto' ? (asset === 'BTC' ? 0.0001 : 0.001) : 0;

  const handleConfirmSend = async () => {
    setSecurityOpen(false);
    setStep(3);
    setProcessing(true);
    setError(null);
    try {
      await paymentService.sendTransfer({
        asset, amount: parseFloat(amount), recipient: recipient || selectedBeneficiary?.identifier,
        network: ASSETS[asset]?.network,
      });
      setProcessing(false);
      setSuccess(true);
      setStep(4);
    } catch (e) {
      setProcessing(false);
      setError('Transfer failed. Please try again.');
    }
  };

  const reset = () => {
    setStep(0); setAsset('KES'); setRecipient(''); setAmount(''); setSelectedBeneficiary(null); setSuccess(false); setError(null); setPin('');
  };

  const eligibleBeneficiaries = BENEFICIARIES.filter(b => b.type === 'elitewallet' || (recipientType === 'external' && b.type !== 'elitewallet'));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Send</h1>
          <p className="text-sm text-muted-foreground">Transfer to EliteWallet users or external wallets</p>
        </div>
        <DemoBadge />
      </div>

      {step < 4 && <StepIndicator steps={steps} current={step} className="px-2" />}

      {/* Step 0: Select Asset */}
      {step === 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Select asset to send</h3>
          <div className="mt-4 space-y-2">
            {accounts.map(acct => (
              <button
                key={acct.id}
                onClick={() => { setAsset(acct.asset); setStep(1); }}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/40 hover:shadow-elite"
              >
                <AssetIcon asset={acct.asset} size={40} />
                <div className="flex-1">
                  <p className="font-semibold">{acct.asset}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(acct.balance, acct.asset)}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Recipient */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Select recipient</h3>
          <div className="mt-4 flex gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setRecipientType('elitewallet')}
              className={cn('flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors', recipientType === 'elitewallet' ? 'bg-card shadow-sm' : 'text-muted-foreground')}
            >
              <User className="h-4 w-4" /> EliteWallet User
            </button>
            <button
              onClick={() => setRecipientType('external')}
              className={cn('flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors', recipientType === 'external' ? 'bg-card shadow-sm' : 'text-muted-foreground')}
            >
              <Globe className="h-4 w-4" /> External Wallet
            </button>
          </div>

          {recipientType === 'elitewallet' ? (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Saved beneficiaries</p>
              {BENEFICIARIES.filter(b => b.type === 'elitewallet').map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBeneficiary(b); setRecipient(b.identifier); setStep(2); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
                    {b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.identifier}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
              <div className="mt-3">
                <label className="text-sm font-medium">Or enter username/email/phone</label>
                <input
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="username or email"
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card"
                />
                <button
                  onClick={() => recipient && setStep(2)}
                  disabled={!recipient}
                  className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Wallet address</label>
                <input
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder={asset === 'BTC' ? 'bc1q...' : '0x...'}
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card"
                />
                <p className="mt-1 text-xs text-muted-foreground">Network: {ASSETS[asset]?.network}</p>
              </div>
              <button
                onClick={() => recipient && setStep(2)}
                disabled={!recipient || recipient.length < 10}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}
          <button onClick={() => setStep(0)} className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground">← Back</button>
        </div>
      )}

      {/* Step 2: Amount */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <AssetIcon asset={asset} size={40} />
            <div>
              <p className="font-semibold">Send {asset}</p>
              <p className="text-xs text-muted-foreground">To: {selectedBeneficiary?.name || maskAddress(recipient, 6)}</p>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium text-muted-foreground">Amount</label>
            <div className="relative mt-2">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-muted/30 py-4 px-4 text-2xl font-bold outline-none focus:border-primary focus:bg-card"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available: {formatCurrency(available, asset)}</span>
              <button onClick={() => setAmount(String(available - fee))} className="font-medium text-primary hover:underline">Max</button>
            </div>
            {fee > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Network fee: {formatCurrency(fee, asset)}</p>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!amount || parseFloat(amount) > available}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review / Security / Processing */}
      {step === 3 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          {processing ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Sending {asset}...</h3>
              <p className="mt-1 text-sm text-muted-foreground">Processing your transfer</p>
            </div>
          ) : (
            <>
              <h3 className="text-base font-semibold">Review Transfer</h3>
              <div className="mt-4 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Asset</span><span className="font-medium">{asset}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Recipient</span><span className="font-medium">{selectedBeneficiary?.name || maskAddress(recipient, 6)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{maskAddress(recipient, 6)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span className="font-medium">{ASSETS[asset]?.network}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{formatCurrency(parseFloat(amount), asset)}</span></div>
                {fee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Network fee</span><span className="font-medium">{formatCurrency(fee, asset)}</span></div>}
                <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold">Total</span><span className="font-bold">{formatCurrency(parseFloat(amount) + fee, asset)}</span></div>
              </div>
              {ASSETS[asset]?.type === 'crypto' && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-amber-700 dark:text-amber-400">Only send {asset} using the {ASSETS[asset]?.network} network. Sending to a wrong network may result in permanent loss of funds.</p>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">Back</button>
                <button onClick={() => setSecurityOpen(true)} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <Shield className="mr-1 inline h-4 w-4" /> Confirm & Send
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Security confirmation modal */}
      <ConfirmModal
        open={securityOpen}
        onClose={() => setSecurityOpen(false)}
        onConfirm={handleConfirmSend}
        title="Confirm Transaction"
        type="security"
        confirmLabel="Verify & Send"
      >
        <p>Enter your 4-digit transaction PIN to authorize this transfer.</p>
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={pin[i] || ''}
              onChange={e => {
                const newPin = pin.split('');
                newPin[i] = e.target.value;
                setPin(newPin.join(''));
              }}
              className="h-12 w-12 rounded-xl border border-border bg-card text-center text-xl font-bold outline-none focus:border-primary"
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Demo PIN: 1234</p>
      </ConfirmModal>

      <SuccessModal
        open={success}
        onClose={reset}
        title="Transfer Sent!"
        actionLabel="View Transactions"
        onAction={() => { window.location.href = '/app/transactions'; }}
      >
        <p>You sent <strong>{formatCurrency(parseFloat(amount || '0'), asset)}</strong> {asset}</p>
        <p>To: {selectedBeneficiary?.name || maskAddress(recipient, 6)}</p>
      </SuccessModal>
    </div>
  );
}
