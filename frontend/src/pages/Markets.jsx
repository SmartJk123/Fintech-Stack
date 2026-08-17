import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, Star } from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import { marketService } from '@/lib/mock/services';
import { formatKES } from '@/lib/utils';
import { ASSETS, MARKET_PRICES } from '@/lib/mock/data';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const categories = ['All', 'Favorites', 'Crypto', 'Stablecoins'];

export default function Markets() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState(['BTC', 'ETH']);

  useEffect(() => {
    marketService.getMarketPrices().then(() => setLoading(false));
  }, []);

  const assets = Object.entries(ASSETS).filter(([code, info]) => {
    if (info.type !== 'crypto') return false;
    const matchesSearch = !search || code.toLowerCase().includes(search.toLowerCase()) || info.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' ? true : category === 'Favorites' ? favorites.includes(code) : category === 'Stablecoins' ? ['USDT', 'USDC'].includes(code) : true;
    return matchesSearch && matchesCategory;
  });

  const toggleFav = (code) => {
    setFavorites(f => f.includes(code) ? f.filter(c => c !== code) : [...f, code]);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
          <p className="text-sm text-muted-foreground">Live crypto prices and market data</p>
        </div>
        <DemoBadge />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', category === c ? 'bg-card shadow-sm' : 'text-muted-foreground')}>{c}</button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-card sm:w-56" />
        </div>
      </div>

      {/* Market table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">24H</th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">Market Cap</th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">Volume</th>
              <th className="hidden px-4 py-3 sm:table-cell">7D Chart</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><LoadingSkeleton className="p-4" lines={4} /></td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No assets found</td></tr>
            ) : assets.map(([code, info]) => {
              const price = MARKET_PRICES[code];
              const sparkData = (price?.sparkline || []).map((v, i) => ({ name: `D${i}`, value: v }));
              const isUp = (price?.change24h || 0) >= 0;
              return (
                <tr key={code} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleFav(code)} className="text-muted-foreground hover:text-amber-500">
                        <Star className={cn('h-4 w-4', favorites.includes(code) && 'fill-amber-400 text-amber-400')} />
                      </button>
                      <AssetIcon asset={code} size={36} />
                      <div>
                        <p className="font-semibold">{code}</p>
                        <p className="text-xs text-muted-foreground">{info.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatKES(price?.priceKES || 0, 0)}</td>
                  <td className={cn('hidden px-4 py-3 text-right font-semibold sm:table-cell', isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                    {isUp ? '+' : ''}{price?.change24h || 0}%
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm lg:table-cell">{price?.marketCap ? formatKES(price.marketCap, 0) : '—'}</td>
                  <td className="hidden px-4 py-3 text-right text-sm lg:table-cell">{price?.volume24h ? formatKES(price.volume24h, 0) : '—'}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData}>
                          <Area type="monotone" dataKey="value" stroke={isUp ? '#10b981' : '#f43f5e'} strokeWidth={1.5} fill="none" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/app/buy?asset=${code}`} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Buy</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}