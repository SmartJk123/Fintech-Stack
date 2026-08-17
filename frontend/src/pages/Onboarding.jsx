import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ArrowRight, ArrowLeft, Check, Sparkles, User, Globe, Target, Shield,
  FileCheck, Wallet, PartyPopper,
} from 'lucide-react';
import StepIndicator from '@/components/StepIndicator';
import DemoBadge from '@/components/DemoBadge';
import CountryPicker from '@/components/CountryPicker';

const steps = ['Welcome', 'Personal', 'Country', 'Purpose', 'Security', 'KYC', 'Wallet', 'Done'];

const stepIcons = [Sparkles, User, Globe, Target, Shield, FileCheck, Wallet, PartyPopper];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    fullName: 'Amara Mwangi',
    phone: '+254 712 345 678',
    country: 'Kenya',
    purpose: 'investment',
    pin: '',
    pinConfirm: '',
    biometric: false,
  });

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const StepContent = () => {
    const Icon = stepIcons[step];

    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl gradient-elite shadow-elite">
              <Icon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Welcome to EliteWallet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Your money. Your assets. One intelligent wallet. Let's get your account set up in a few quick steps.
            </p>
            <div className="mt-8 grid gap-3 text-left">
              {['Multi-currency wallet', 'Buy & sell crypto', 'Send & receive instantly', 'Bank-grade security'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Tell us a bit about yourself</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input value={data.fullName} onChange={e => update('fullName', e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input value={data.phone} onChange={e => update('phone', e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Select Your Country</h2>
                <p className="text-sm text-muted-foreground">We'll customize your experience</p>
              </div>
            </div>
            <div className="mt-6">
              <CountryPicker value={data.country} onChange={c => update('country', c)} />
              <p className="mt-3 text-xs text-muted-foreground">
                Search and select from all countries worldwide. We'll customize your wallets and currency accordingly.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Account Purpose</h2>
                <p className="text-sm text-muted-foreground">How will you use EliteWallet?</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {[
                { value: 'investment', label: 'Investment & Trading', desc: 'Buy, sell, and hold digital assets' },
                { value: 'payments', label: 'Everyday Payments', desc: 'Send and receive money locally' },
                { value: 'savings', label: 'Savings & Store of Value', desc: 'Hold stablecoins and fiat securely' },
                { value: 'business', label: 'Business Operations', desc: 'Manage business finances and payments' },
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => update('purpose', p.value)}
                  className={cn('w-full rounded-xl border p-4 text-left transition-all', data.purpose === p.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}
                >
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Security Setup</h2>
                <p className="text-sm text-muted-foreground">Set your transaction PIN</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">4-Digit Transaction PIN</label>
                <div className="mt-2 flex gap-2">
                  {[0,1,2,3].map(i => (
                    <input
                      key={i}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={data.pin[i] || ''}
                      onChange={e => {
                        const p = data.pin.split('');
                        p[i] = e.target.value;
                        update('pin', p.join(''));
                      }}
                      className="h-14 w-14 rounded-xl border border-border bg-card text-center text-2xl font-bold outline-none focus:border-primary"
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Confirm PIN</label>
                <div className="mt-2 flex gap-2">
                  {[0,1,2,3].map(i => (
                    <input
                      key={i}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={data.pinConfirm[i] || ''}
                      onChange={e => {
                        const p = data.pinConfirm.split('');
                        p[i] = e.target.value;
                        update('pinConfirm', p.join(''));
                      }}
                      className="h-14 w-14 rounded-xl border border-border bg-card text-center text-2xl font-bold outline-none focus:border-primary"
                    />
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-border p-3">
                <input type="checkbox" checked={data.biometric} onChange={e => update('biometric', e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm">Enable biometric login (Face ID / Fingerprint)</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Identity Verification (KYC)</h2>
                <p className="text-sm text-muted-foreground">Verify your identity to unlock all features</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <DemoBadge />
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                KYC verification is in demo mode. No real documents will be processed. You can complete this later.
              </p>
            </div>
            <div className="mt-4 space-y-2">
              {['National ID / Passport', 'Selfie Verification', 'Proof of Address'].map((d, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm font-medium">{d}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Skip for now</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-elite">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Wallet Setup</h2>
                <p className="text-sm text-muted-foreground">Your wallets are ready to use</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { code: 'KES', name: 'Kenyan Shilling', desc: 'For local payments & M-Pesa' },
                { code: 'USD', name: 'US Dollar', desc: 'For international transfers' },
                { code: 'BTC', name: 'Bitcoin', desc: 'Store of value & investment' },
                { code: 'ETH', name: 'Ethereum', desc: 'Smart contracts & DeFi' },
                { code: 'USDT', name: 'Tether', desc: 'Stablecoin pegged to USD' },
                { code: 'USDC', name: 'USD Coin', desc: 'Regulated stablecoin' },
              ].map(w => (
                <div key={w.code} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
                    {w.code.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{w.code}</p>
                    <p className="text-xs text-muted-foreground">{w.desc}</p>
                  </div>
                  <Check className="ml-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
              <Icon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">You're all set! 🎉</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Your EliteWallet account is ready. Let's start exploring your new financial platform.
            </p>
            <div className="mt-8 rounded-2xl gradient-elite-soft p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-2xl font-bold">6</p><p className="text-xs text-muted-foreground">Wallets</p></div>
                <div><p className="text-2xl font-bold">2FA</p><p className="text-xs text-muted-foreground">Secured</p></div>
                <div><p className="text-2xl font-bold">100%</p><p className="text-xs text-muted-foreground">Ready</p></div>
              </div>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    if (step === 4) return data.pin.length === 4 && data.pin === data.pinConfirm;
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-elite text-white font-bold">E</div>
            <span className="font-bold">EliteWallet</span>
          </div>
          <DemoBadge compact />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <StepIndicator steps={steps} current={step} className="mb-8" />

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <StepContent />

          <div className="mt-8 flex gap-3">
            {step > 0 && step < 7 && (
              <button onClick={back} className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            {step < 7 ? (
              <button
                onClick={next}
                disabled={!canProceed()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {step === 0 ? 'Get Started' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => navigate('/app')} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          {step === 4 && data.pin && data.pinConfirm && data.pin !== data.pinConfirm && (
            <p className="mt-2 text-center text-xs text-rose-600 dark:text-rose-400">PINs do not match</p>
          )}
        </div>

        {step < 7 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Step {step + 1} of {steps.length} ·{' '}
            <button onClick={() => navigate('/app')} className="font-medium text-primary hover:underline">Skip for now</button>
          </p>
        )}
      </div>
    </div>
  );
}
