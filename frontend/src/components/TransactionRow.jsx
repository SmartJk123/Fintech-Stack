import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatKES, formatDate, txnTypeInfo, toKES } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ShoppingCart, Tag, Download } from 'lucide-react';

const typeIcons = {
  deposit: Download,
  withdraw: ArrowUpRight,
  buy: ShoppingCart,
  sell: Tag,
  send: ArrowLeftRight,
  receive: ArrowDownLeft,
};

/**
 * @param {{ txn: any, showAsset?: boolean, linkTo?: any }} props
 */
export default function TransactionRow({ txn, showAsset = true, linkTo }) {
  const info = txnTypeInfo(txn.type);
  const Icon = typeIcons[txn.type] || ArrowLeftRight;
  const kesValue = txn.kesValue || toKES(txn.amount, txn.asset);

  const content = (
    <div className="flex items-center gap-3 py-3.5">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', info.bg)}>
        <Icon className={cn('h-4.5 w-4.5', info.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold capitalize">{info.label}</p>
          <StatusBadge status={txn.status} />
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {formatDate(txn.date, { dateOnly: true })} · {txn.counterparty}
        </p>
      </div>
      <div className="text-right">
        <p className={cn('text-sm font-bold', info.color)}>
          {info.sign}{formatCurrency(txn.amount, txn.asset)}
        </p>
        <p className="text-xs text-muted-foreground">{formatKES(kesValue)}</p>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40 -mx-2 px-2 rounded-lg">
        {content}
      </Link>
    );
  }
  return <div className="border-b border-border/60 last:border-0">{content}</div>;
}
