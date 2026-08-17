import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Wallet, TrendingUp, ShoppingCart, Tag, ArrowLeftRight,
  ArrowDownToLine, ArrowUpFromLine, CreditCard, Shield,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import QuickAction from '@/components/QuickAction';
import TransactionRow from '@/components/TransactionRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import AssetIcon from '@/components/AssetIcon';
import { walletService, transactionService } from '@/lib/mock/services';
import { formatKES, toKES } from '@/lib/utils';
import { PORTFOLIO_HISTORY, ASSETS, MARKET_PRICES } from '@/lib/mock/data';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, PieChart, Pie, Cell,
} from 'recharts';

const ranges = ['7D', '30D', '90D', '1Y', 'ALL'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [range, setRange] = useState('7D');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    Promise.all([
      walletService.getWallet(),
      transactionService.getTransactions(),
    ]).then(([accts, txns]) => {
      setAccounts(accts);
      setTransactions(txns.slice(0, 6));
      setTotalValue(walletService.getTotalPortfolioValueKES());
      setLoading(false);
    });
  }, []);

  const chartData = (PORTFOLIO_HISTORY[range] || []).map((v, i) => ({ name: `D${i + 1}`, value: v }));
  const change24h = ((chartData[chartData.length - 1]?.value - chartData[chartData.length - 2]?.value) / chartData[chartData.length - 2]?.value * 100) || 0;

  // Asset allocation
  const allocation = accounts.map(a => ({
    name: a.asset,
    value: toKES(a.balance, a.asset),
    color: ASSETS[a.asset]?.color,
  }));
  const totalAlloc = allocation.reduce((s, a) => s + a.value, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Amara 👋</h1>
          <p className="text-sm text-muted-foreground">Here's your portfolio overview for today.</p>
        </div>
        <DemoBadge />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <QuickAction to="/app/deposit" icon={<ArrowDownToLine className="h-5 w-5" />} label="Deposit" />
        <QuickAction to="/app/withdraw" icon={<ArrowUpFromLine className="h-5 w-5" />} label="Withdraw" />
        <QuickAction to="/app/buy" icon={<ShoppingCart className="h-5 w-5" />} label="Buy" />
        <QuickAction to="/app/sell" icon={<Tag className="h-5 w-5" />} label="Sell" />
        <QuickAction to="/app/send" icon={<ArrowLeftRight className="h-5 w-5" />} label="Send" />
        <QuickAction to="/app/receive" icon={<ArrowDownToLine className="h-5 w-5" />} label="Receive" variant="gold" />
      </div>

      {/* Portfolio + Allocation */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Portfolio value card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              {loading ? (
                <div className="mt-1 h-9 w-48 rounded bg-muted animate-pulse" />
              ) : (
                <h2 className="text-3xl font-bold tracking-tight">{formatKES(totalValue)}</h2>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <span className={cn('font-semibold', change24h >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                  {change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}% 24H
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">↑ 5.12% 7D</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">↑ 8.70% 30D</span>
              </div>
            </div>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {ranges.map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    range === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', fontSize: '0.875rem' }}
                  formatter={(v) => [formatKES(v), 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#portfolioGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset allocation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Asset Allocation</h3>
          {loading ? (
            <LoadingSkeleton className="mt-4" lines={4} />
          ) : (
            <>
              <div className="mx-auto mt-4 h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                      {allocation.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {allocation.map(a => (
                  <div key={a.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="font-medium">{a.name}</span>
                    </div>
                    <span className="text-muted-foreground">{((a.value / totalAlloc) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Balance" value={formatKES(totalValue)} icon={Wallet} trend={5.12} sublabel="vs last week" accent="primary" />
        <StatCard label="24H Volume" value={formatKES(102840)} icon={TrendingUp} trend={2.84} sublabel="across all assets" accent="emerald" />
        <StatCard label="Trading Fees" value={formatKES(550)} icon={CreditCard} sublabel="this month" accent="gold" />
        <StatCard label="Security Score" value="85/100" icon={Shield} sublabel="Strong" accent="primary" />
      </div>

      {/* Recent transactions + Market overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Transactions</h3>
            <Link to="/app/transactions" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-2">
            {loading ? (
              <LoadingSkeleton lines={5} />
            ) : (
              transactions.map(txn => (
                <TransactionRow key={txn.id} txn={txn} linkTo={`/app/transactions/${txn.id}`} />
              ))
            )}
          </div>
        </div>

        {/* Market overview */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Market Overview</h3>
            <Link to="/app/markets" className="text-sm font-medium text-primary hover:underline">All</Link>
          </div>
          <div className="mt-3 space-y-3">
            {['BTC', 'ETH', 'USDT', 'USDC'].map(code => {
              const price = MARKET_PRICES[code];
              const asset = ASSETS[code];
              return (
                <Link key={code} to={`/app/wallet/${code}`} className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted">
                  <div className="flex items-center gap-2.5">
                    <AssetIcon asset={code} size={32} />
                    <div>
                      <p className="text-sm font-semibold">{code}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatKES(price.priceKES, 0)}</p>
                    <p className={cn('text-xs font-medium', price.change24h >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                      {price.change24h >= 0 ? '+' : ''}{price.change24h}%
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}