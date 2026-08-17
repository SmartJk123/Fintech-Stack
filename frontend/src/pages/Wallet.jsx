import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, ShoppingCart, Tag } from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import DemoBadge from '@/components/DemoBadge';
import { walletService } from '@/lib/mock/services';
import { formatCurrency, formatKES, toKES } from '@/lib/utils';
import { ASSETS, MARKET_PRICES } from '@/lib/mock/data';

const filters = ['All', 'Fiat', 'Crypto'];

export default function Wallet() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    walletService.getWallet().then(accts => {
      setAccounts(accts);
      setLoading(false);
    });
  }, []);

  const filtered = accounts.filter(a => {
    const asset = ASSETS[a.asset];
    const matchesFilter = filter === 'All' || (filter === 'Fiat' ? asset.type === 'fiat' : asset.type === 'crypto');
    const matchesSearch = !search || a.asset.toLowerCase().includes(search.toLowerCase()) || asset.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalValue = accounts.reduce((sum, a) => sum + toKES(a.balance, a.asset), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your fiat and digital assets</p>
        </div>
        <DemoBadge />
      </div>

      {/* Total balance banner */}
      <div className="rounded-2xl gradient-elite p-6 text-white shadow-elite">
        <p className="text-sm text-white/80">Total Wallet Balance</p>
        <h2 className="mt-1 text-3xl font-bold">{formatKES(totalValue)}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/app/deposit" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">
            <ArrowDownToLine className="h-4 w-4" /> Deposit
          </Link>
          <Link to="/app/withdraw" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">
            <ArrowUpFromLine className="h-4 w-4" /> Withdraw
          </Link>
          <Link to="/app/send" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">
            <ArrowLeftRight className="h-4 w-4" /> Send
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-semibold transition-colors',
                filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-card sm:w-56"
          />
        </div>
      </div>

      {/* Asset cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} card />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No assets found" description="Try adjusting your filters or search." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(account => {
            const asset = ASSETS[account.asset];
            const price = MARKET_PRICES[account.asset];
            const kesValue = toKES(account.balance, account.asset);
            const change = price?.change24h ?? 0;
            return (
              <Link
                key={account.id}
                to={`/app/wallet/${account.asset}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-elite"
              >
                <div className="flex items-center gap-3">
                  <AssetIcon asset={account.asset} size={44} />
                  <div className="flex-1">
                    <p className="font-semibold">{account.asset}</p>
                    <p className="text-xs text-muted-foreground">{asset.name}</p>
                  </div>
                  {change !== 0 && (
                    <span className={cn('text-xs font-semibold', change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                      {change >= 0 ? '+' : ''}{change}%
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xl font-bold">{formatCurrency(account.balance, account.asset)}</p>
                  <p className="text-sm text-muted-foreground">{formatKES(kesValue)}</p>
                  {account.pending > 0 && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      {formatCurrency(account.pending, account.asset)} pending
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2 border-t border-border pt-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                    <ShoppingCart className="h-3.5 w-3.5" /> Buy
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                    <Tag className="h-3.5 w-3.5" /> Sell
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                    <ArrowLeftRight className="h-3.5 w-3.5" /> Send
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}