import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Shield, Bell, Globe, Palette, Key, Moon, Sun, Monitor } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';

const sections = [
  { id: 'general', label: 'General', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'currency', label: 'Currency & Language', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Access', icon: Key },
];

export default function Settings() {
  const [active, setActive] = useState('general');
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('KES');
  const [language, setLanguage] = useState('English');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="rounded-2xl border border-border bg-card p-3">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActive(s.id)} className={cn('mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', active === s.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                <Icon className="h-4 w-4" /> {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
          {active === 'general' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">General Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium">Full Name</label><input defaultValue="Amara Mwangi" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" /></div>
                <div><label className="text-sm font-medium">Email</label><input defaultValue="amara.mwangi@example.com" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" /></div>
                <div><label className="text-sm font-medium">Phone</label><input defaultValue="+254 712 345 678" className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-card" /></div>
                <div><label className="text-sm font-medium">Country</label><select className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><option>Kenya</option><option>Uganda</option><option>Tanzania</option></select></div>
              </div>
              <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save Changes</button>
            </div>
          )}

          {active === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Appearance</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={cn('flex flex-col items-center gap-2 rounded-xl border p-4 transition-all', theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-semibold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {active === 'currency' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Currency & Language</h3>
              <div><label className="text-sm font-medium">Display Currency</label><select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><option>KES</option><option>USD</option><option>BTC</option></select></div>
              <div><label className="text-sm font-medium">Language</label><select value={language} onChange={e => setLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"><option>English</option><option>Swahili</option><option>French</option></select></div>
            </div>
          )}

          {active === 'security' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Security Settings</h3>
              {['Change password', 'Two-factor authentication', 'Transaction PIN', 'Biometric login', 'Active sessions'].map(s => (
                <div key={s} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm font-medium">{s}</span>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted">Manage</button>
                </div>
              ))}
            </div>
          )}

          {active === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Notification Preferences</h3>
              {['Email notifications', 'Push notifications', 'SMS alerts', 'Transaction alerts', 'Security alerts', 'Promotional emails'].map((p, i) => (
                <label key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm font-medium">{p}</span>
                  <input type="checkbox" defaultChecked={i < 4} className="h-5 w-5 rounded" />
                </label>
              ))}
            </div>
          )}

          {active === 'api' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold">API Access</h3>
              <p className="text-sm text-muted-foreground">Generate API keys to integrate EliteWallet with your applications.</p>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm font-semibold">Production Key</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">jw_live_••••••••••••••••3aF9</p>
              </div>
              <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create New Key</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}