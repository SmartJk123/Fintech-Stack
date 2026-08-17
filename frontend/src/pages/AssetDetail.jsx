import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ShoppingCart, Tag, ArrowLeftRight, ArrowDownToLine, TrendingUp, TrendingDown,
} from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import TransactionRow from '@/components/TransactionRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import { walletService, transactionService } from '@/lib/mock/services';
import { formatCurrency, formatKES, toKES } from '@/lib/utils';
import { ASSETS, MARKET_PRICES } from '@/lib/mock/data';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AssetDetail() {
  const { asset } = useParams();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    walletService.getWallet().then(accts => {
      setAccount(accts.find(a => a.asset === asset));
      transactionService.getTransactions({ asset }).then(t => {
        setTransactions(t);
        setLoading(false);
      });
    });
  }, [asset]);

  const assetInfo = ASSETS[asset];
  const price = MARKET_PRICES[asset];

  if (!assetInfo) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-muted-foreground">Asset not found.</p>
        <Link to="/app/wallet" className="mt-4 text-primary hover:underline">← Back to wallet</Link>
      </div>
    );
  }

  const kesValue = account ? toKES(account.balance, account.asset) : 0;
  const sparkData = (price?.sparkline || [1, 2, 3, 4, 5, 6, 7]).map((v, i) => ({ name: `D${i}`, value: v }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/app/wallet" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to wallet
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AssetIcon asset={asset} size={48} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{assetInfo.name}</h1>
            <p className="text-sm text-muted-foreground">{assetInfo.network} network</p>
          </div>
        </div>
        <DemoBadge />
      </div>

      {/* Balance card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
              <p className="text-2xl font-bold">{formatCurrency(account?.balance || 0, asset)}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">KES Equivalent</p>
            {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
              <p className="text-2xl font-bold">{formatKES(kesValue)}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available</p>
            {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
              <p className="text-lg font-semibold">{formatCurrency((account?.balance || 0) - (account?.pending || 0), asset)}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
              <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(account?.pending || 0, asset)}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to={`/app/buy?asset=${asset}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4" /> Buy
          </Link>
          <Link to={`/app/sell?asset=${asset}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            <Tag className="h-4 w-4" /> Sell
          </Link>
          <Link to={`/app/send?asset=${asset}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            <ArrowLeftRight className="h-4 w-4" /> Send
          </Link>
          <Link to={`/app/receive?asset=${asset}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
            <ArrowDownToLine className="h-4 w-4" /> Receive
          </Link>
        </div>
      </div>

      {/* Market info + chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Price</p>
              <p className="text-2xl font-bold">{formatKES(price?.priceKES || 0, 0)}</p>
            </div>
            <div className={cn('flex items-center gap-1 font-semibold', (price?.change24h || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {(price?.change24h || 0) >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {price?.change24h || 0}%
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="assetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={assetInfo.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={assetInfo.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', fontSize: '0.875rem' }} />
                <Area type="monotone" dataKey="value" stroke={assetInfo.color} strokeWidth={2.5} fill="url(#assetGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Market Stats</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">24H Change</span>
              <span className={cn('font-semibold', (price?.change24h || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {price?.change24h || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">7D Change</span>
              <span className={cn('font-semibold', (price?.change7d || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {price?.change7d || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">30D Change</span>
              <span className={cn('font-semibold', (price?.change30d || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {price?.change30d || 0}%
              </span>
            </div>
            {price?.marketCap && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-semibold">{formatKES(price.marketCap, 0)}</span>
              </div>
            )}
            {price?.volume24h && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">24H Volume</span>
                <span className="font-semibold">{formatKES(price.volume24h, 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-semibold">{assetInfo.network}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Transaction History</h3>
        <div className="mt-2">
          {loading ? (
            <LoadingSkeleton lines={4} />
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No transactions for this asset yet.</p>
          ) : (
            transactions.map(t => <TransactionRow key={t.id} txn={t} linkTo={`/app/transactions/${t.id}`} />)
          )}
        </div>
      </div>
    </div>
  );
}