import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Key, Smartphone, Fingerprint, Monitor, AlertTriangle,
  Lock, CheckCircle2, XCircle, LogOut,
} from 'lucide-react';
import SecurityScoreComponent from '@/components/SecurityScore';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import DemoBadge from '@/components/DemoBadge';
import { securityService } from '@/lib/mock/services';

export default function Security() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    Promise.all([
      securityService.getSecurityScore(),
      securityService.getActiveSessions(),
    ]).then(([s, sess]) => {
      setScore(s);
      setSessions(sess);
      setLoading(false);
    });
  }, []);

  const sections = [
    { icon: Key, title: 'Password', desc: 'Last changed 30 days ago', status: 'pass', action: 'Change' },
    { icon: Smartphone, title: 'Two-Factor Authentication', desc: 'Authenticator app enabled', status: 'pass', action: 'Manage' },
    { icon: Lock, title: 'Transaction PIN', desc: 'PIN set for transactions', status: 'pass', action: 'Change' },
    { icon: Fingerprint, title: 'Biometric Login', desc: 'Not enabled on this device', status: 'warn', action: 'Enable' },
    { icon: Monitor, title: 'Trusted Devices', desc: '2 devices trusted', status: 'pass', action: 'View' },
    { icon: AlertTriangle, title: 'Login Alerts', desc: 'Email alerts enabled', status: 'pass', action: 'Manage' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Center</h1>
          <p className="text-sm text-muted-foreground">Manage your account security</p>
        </div>
        <DemoBadge />
      </div>

      {/* Security score */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {loading ? <LoadingSkeleton card /> : (
          <>
            <SecurityScoreComponent score={score.score} />
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {score.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  {item.status === 'pass' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Security settings */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Security Settings</h3>
        <div className="mt-4 space-y-2">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {s.status === 'pass' ? (
                  <span className="hidden items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:flex">
                    <CheckCircle2 className="h-4 w-4" /> Active
                  </span>
                ) : (
                  <span className="hidden items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 sm:flex">
                    <AlertTriangle className="h-4 w-4" /> Recommended
                  </span>
                )}
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                  {s.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active sessions */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Active Sessions</h3>
          <button className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400">Logout all</button>
        </div>
        <div className="mt-4 space-y-2">
          {loading ? <LoadingSkeleton lines={3} /> : sessions.map(s => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{s.device}</p>
                  {s.current && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">Current</span>}
                </div>
                <p className="text-xs text-muted-foreground">{s.location} · {s.ip} · {s.lastActive}</p>
              </div>
              {!s.current && (
                <button className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Login history */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold">Recent Login Activity</h3>
        <div className="mt-4 space-y-2">
          {[
            { device: 'MacBook Pro · Chrome', location: 'Nairobi, Kenya', time: 'Today, 6:00 AM', status: 'success' },
            { device: 'iPhone 15 · EliteWallet App', location: 'Nairobi, Kenya', time: 'Today, 4:00 AM', status: 'success' },
            { device: 'Unknown device', location: 'Lagos, Nigeria', time: 'Aug 10, 11:30 PM', status: 'blocked' },
            { device: 'Windows PC · Edge', location: 'Mombasa, Kenya', time: 'Aug 9, 2:15 PM', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', log.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/15' : 'bg-rose-100 dark:bg-rose-500/15')}>
                {log.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{log.device}</p>
                <p className="text-xs text-muted-foreground">{log.location} · {log.time}</p>
              </div>
              <span className={cn('text-xs font-semibold capitalize', log.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}