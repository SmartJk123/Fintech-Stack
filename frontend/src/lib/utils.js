import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ASSETS, MARKET_PRICES } from './mock/services';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format a number as currency
export function formatCurrency(amount, assetCode, opts = {}) {
  const asset = ASSETS[assetCode];
  if (!asset) return String(amount);
  const decimals = opts.decimals ?? asset.decimals;
  const value = Number(amount) || 0;
  return `${asset.symbol}${value.toLocaleString('en-US', { minimumFractionDigits: asset.type === 'fiat' ? 2 : decimals > 4 ? 4 : 2, maximumFractionDigits: decimals })}`;
}

// Format KES specifically
export function formatKES(amount, decimals = 2) {
  const value = Number(amount) || 0;
  return `KSh ${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

// Format a plain number with commas
export function formatNumber(amount, decimals = 2) {
  const value = Number(amount) || 0;
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Get KES value of an asset amount
export function toKES(amount, assetCode) {
  const price = MARKET_PRICES[assetCode]?.priceKES ?? 0;
  return amount * price;
}

// Format a date
export function formatDate(dateStr, opts = {}) {
  const d = new Date(dateStr);
  if (opts.time) {
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  if (opts.dateOnly) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Relative time
export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr, { dateOnly: true });
}

// Status badge color mapping
export function statusColor(status) {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400',
    reversed: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400',
  };
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400';
}

// Transaction type icon/color
export function txnTypeInfo(type) {
  const map = {
    deposit: { label: 'Deposit', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/15', sign: '+' },
    withdraw: { label: 'Withdraw', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/15', sign: '-' },
    buy: { label: 'Buy', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/15', sign: '+' },
    sell: { label: 'Sell', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-500/15', sign: '-' },
    send: { label: 'Send', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-500/15', sign: '-' },
    receive: { label: 'Receive', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/15', sign: '+' },
    fee: { label: 'Fee', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-500/15', sign: '-' },
  };
  return map[type] || { label: type, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-500/15', sign: '' };
}

// Mask an address/string in the middle
export function maskAddress(addr, visible = 6) {
  if (!addr || addr.length <= visible * 2) return addr;
  return `${addr.slice(0, visible)}••••${addr.slice(-visible)}`;
}

// Generate a mock QR code URL (placeholder service)
export function qrCodeUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
}