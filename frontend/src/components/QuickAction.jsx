import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ShoppingCart, Tag, Download } from 'lucide-react';

const icons = {
  deposit: Download,
  withdraw: ArrowUpRight,
  buy: ShoppingCart,
  sell: Tag,
  send: ArrowLeftRight,
  receive: ArrowDownLeft,
};

/**
 * @param {{ to?: string, icon: any, label: string, onClick?: () => void, variant?: 'default' | 'gold' }} props
 */
export default function QuickAction({ to, icon, label, onClick, variant = 'default' }) {
  const content = (
    <div className={cn(
      'flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-elite',
      variant === 'gold' && 'hover:border-amber-400/40'
    )}>
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-xl',
        variant === 'gold' ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
      )}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

export { icons };
