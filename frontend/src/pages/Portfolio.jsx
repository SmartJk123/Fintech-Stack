import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AssetIcon from '@/components/AssetIcon';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import { walletService } from '@/lib/mock/services';
import { formatKES, formatCurrency, toKES } from '@/lib/utils';
import { ASSETS, MARKET_PRICES, PORTFOLIO_HISTORY } from '@/lib/mock/data';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

const ranges = ['7D', '30D', '90D', '1Y', 'ALL'];

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [range, setRange] = useState('30D');

  useEffect(() => {
    walletService.getWallet().then(a => { setAccounts(a); setLoading(false); });
  }, []);

  const totalValue = accounts.reduce((s, a) => s + toKES(a.balance, a.asset), 0);
  const chartData = (PORTFOLIO_HISTORY[range] || []).map((v, i) => ({ name: `D${i + 1}`, value: v }));
  const change = chartData.length >= 2 ? ((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value * 100) : 0;
  const profitLoss = chartData.length >= 2 ? chartData[chartData.length - 1].value - chartData[0].value : 0;

  const allocation = accounts.map(a => ({ name: a.asset, value: toKES(a.balance, a.asset), color: ASSETS[a.asset]?.color }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">Track your asset performance</p>
        </div>
        <DemoBadge />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Value</p>
          {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : <p className="text-2xl font-bold">{formatKES(totalValue)}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Profit / Loss ({range})</p>
          {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
            <p className={cn('text-2xl font-bold', profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {profitLoss >= 0 ? '+' : ''}{formatKES(Math.abs(profitLoss))}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Return ({range})</p>
          {loading ? <div className="mt-1 h-7 w-32 rounded bg-muted animate-pulse" /> : (
            <p className={cn('text-2xl font-bold', change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          )}
        </div>
      </div>

      {/* Performance chart */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Performance</h3>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {ranges.map(r => (
              <button key={r} onClick={() => setRange(r)} className={cn('rounded-md px-2.5 py-1 text-xs font-semibold', range === r ? 'bg-card shadow-sm' : 'text-muted-foreground')}>{r}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
              <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))' }} formatter={(v) => [formatKES(v), 'Value']} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#portGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation + Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Asset Allocation</h3>
          {loading ? <LoadingSkeleton className="mt-4" lines={4} /> : (
            <>
              <div className="mx-auto mt-4 h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {allocation.map((e, i) => <Cell key={i} fill={e.color} />)}
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
                    <span className="text-muted-foreground">{((a.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Asset Breakdown</h3>
          {loading ? <LoadingSkeleton className="mt-4" lines={6} /> : (
            <div className="mt-4 space-y-2">
              {accounts.map(a => {
                const price = MARKET_PRICES[a.asset];
                const val = toKES(a.balance, a.asset);
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <AssetIcon asset={a.asset} size={36} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.asset}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(a.balance, a.asset)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatKES(val)}</p>
                      <p className={cn('text-xs', (price?.change24h || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                        {price?.change24h >= 0 ? '+' : ''}{price?.change24h || 0}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}