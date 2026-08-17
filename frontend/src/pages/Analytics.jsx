import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Download, DollarSign, ShoppingBag } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DemoBadge from '@/components/DemoBadge';
import { formatKES } from '@/lib/utils';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const monthlyData = [
  { name: 'Jan', income: 85000, expenses: 42000 },
  { name: 'Feb', income: 92000, expenses: 38000 },
  { name: 'Mar', income: 78000, expenses: 51000 },
  { name: 'Apr', income: 105000, expenses: 44000 },
  { name: 'May', income: 98000, expenses: 39000 },
  { name: 'Jun', income: 112000, expenses: 47000 },
  { name: 'Jul', income: 125000, expenses: 52000 },
  { name: 'Aug', income: 145000, expenses: 48000 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('Monthly');

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Personal financial insights</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge compact />
          <button className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', period === p ? 'bg-card shadow-sm' : 'text-muted-foreground')}>{p}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Income" value={formatKES(145000)} icon={TrendingUp} trend={16} accent="emerald" />
        <StatCard label="Expenses" value={formatKES(48000)} icon={TrendingDown} trend={-8} accent="rose" />
        <StatCard label="Trading Volume" value={formatKES(320000)} icon={ShoppingBag} trend={22} accent="primary" />
        <StatCard label="Fees Paid" value={formatKES(1850)} icon={DollarSign} sublabel="this month" accent="gold" />
      </div>

      {/* Income vs Expenses */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Income vs Expenses</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))' }} formatter={(v) => formatKES(v)} />
              <Bar dataKey="income" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(var(--chart-5))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio growth */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Portfolio Growth</h3>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData.map(d => ({ name: d.name, value: d.income - d.expenses }))}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))' }} formatter={(v) => formatKES(v)} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2.5} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Spending by Category</h3>
          <div className="mt-4 space-y-2">
            {[
              { category: 'Trading', amount: 320000, pct: 65 },
              { category: 'Transfers', amount: 95000, pct: 19 },
              { category: 'Withdrawals', amount: 48000, pct: 10 },
              { category: 'Fees', amount: 1850, pct: 6 },
            ].map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm"><span className="font-medium">{c.category}</span><span className="text-muted-foreground">{formatKES(c.amount)}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full gradient-elite" style={{ width: `${c.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Export Reports</h3>
          <div className="mt-4 space-y-2">
            {['CSV Export', 'PDF Report', 'Tax Statement'].map((r, i) => (
              <button key={i} className="flex w-full items-center justify-between rounded-xl border border-border p-3 hover:bg-muted">
                <span className="text-sm font-medium">{r}</span>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}