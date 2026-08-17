import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Check, Trash2, ShoppingBag, Shield, FileCheck, CreditCard, Sparkles, Server } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import { notificationService } from '@/lib/mock/services';
import { timeAgo } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'transactions', label: 'Transactions', icon: ShoppingBag },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'kyc', label: 'KYC', icon: FileCheck },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'promotions', label: 'Promotions', icon: Sparkles },
  { id: 'system', label: 'System', icon: Server },
];

const catIcons = {
  transactions: ShoppingBag, security: Shield, kyc: FileCheck, payments: CreditCard, promotions: Sparkles, system: Server,
};

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    notificationService.getNotifications().then(n => { setNotifications(n); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.category === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(n => n.map(item => ({ ...item, read: true })));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge compact />
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
              <Check className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => setFilter(c.id)} className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold', filter === c.id ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted')}>
              <Icon className="h-3.5 w-3.5" /> {c.label}
            </button>
          );
        })}
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {loading ? <LoadingSkeleton className="p-4" lines={5} /> : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up. New notifications will appear here." />
        ) : (
          filtered.map(n => {
            const Icon = catIcons[n.category] || Bell;
            return (
              <div key={n.id} className={cn('flex items-start gap-3 border-b border-border/60 p-4 last:border-0', !n.read && 'bg-primary/5')}>
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', !n.read ? 'bg-primary/10' : 'bg-muted')}>
                  <Icon className={cn('h-5 w-5', !n.read ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{timeAgo(n.date)}</p>
                </div>
                <button className="text-muted-foreground hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })
        )}
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Notification Preferences</h3>
        <div className="mt-4 space-y-3">
          {['Email notifications', 'Push notifications', 'SMS alerts for transactions', 'Security alerts'].map((pref, i) => (
            <label key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">{pref}</span>
              <input type="checkbox" defaultChecked={i < 3} className="h-5 w-5 rounded" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}