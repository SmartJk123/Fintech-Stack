import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  Wallet, TrendingUp, ArrowLeftRight, CreditCard, ShieldCheck, Sparkles,
} from 'lucide-react';

const features = [
  { icon: Wallet, title: 'Multi-currency wallet', desc: 'KES, USD, BTC, ETH, USDT and more — all in one place.' },
  { icon: TrendingUp, title: 'Buy & sell crypto', desc: 'Instant quotes with a transparent 0.5% fee.' },
  { icon: ArrowLeftRight, title: 'Send & receive instantly', desc: 'Move money to EliteWallet users or external wallets.' },
  { icon: CreditCard, title: 'M-Pesa deposits', desc: 'Top up from your phone with a single STK push.' },
  { icon: ShieldCheck, title: 'Bank-grade security', desc: 'Transaction PINs, 2FA, and cold storage for digital assets.' },
  { icon: Sparkles, title: 'Smart analytics', desc: 'Track portfolio performance and spending trends.' },
];

export default function Home() {
  const { isDemoMode } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-elite text-lg font-bold text-white shadow-elite">
              E
            </div>
            <span className="text-lg font-bold tracking-tight">EliteWallet</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
              Log in
            </Link>
            <Link to={isDemoMode ? '/app' : '/register'} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {isDemoMode ? 'Open Demo' : 'Get Started'}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          Demo prototype
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Your money. Your assets.{' '}
          <span className="text-gradient-elite">One intelligent wallet.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          EliteWallet brings multi-currency accounts, crypto trading, M-Pesa deposits,
          and bank-grade security into a single, beautiful dashboard.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isDemoMode ? (
            <Link to="/app" className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Explore demo dashboard
            </Link>
          ) : (
            <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto">
              Create free account
            </Link>
          )}
          <Link to="/login" className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold hover:bg-muted sm:w-auto">
            Log in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-elite">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-base font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl gradient-elite p-10 text-center text-white shadow-elite">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to take control of your money?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Set up your EliteWallet in minutes — no paperwork, no waiting.
          </p>
          <Link to={isDemoMode ? '/app' : '/register'} className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-semibold text-indigo-900 hover:bg-white/90">
            {isDemoMode ? 'Open Demo Dashboard' : 'Get Started'}
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EliteWallet — demo prototype, not a licensed financial service.
      </footer>
    </div>
  );
}
