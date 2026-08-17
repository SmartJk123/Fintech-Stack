import React from 'react';
import { User, Mail, Phone, MapPin, Shield, Camera, CheckCircle2, Star } from 'lucide-react';
import DemoBadge from '@/components/DemoBadge';
import StatusBadge from '@/components/StatusBadge';

export default function Profile() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
        <DemoBadge />
      </div>

      {/* Profile header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-elite text-2xl font-bold text-white shadow-elite">AM</div>
            <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-sm">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Amara Mwangi</h2>
            <p className="text-sm text-muted-foreground">amara.mwangi@example.com</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status="Verified" />
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                <Star className="h-3 w-3" /> Starter Plan
              </span>
            </div>
          </div>
          <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Edit Profile</button>
        </div>
      </div>

      {/* Personal info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Personal Information</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">Amara Mwangi</p></div></div>
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">amara.mwangi@example.com</p></div></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">+254 712 345 678</p></div></div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Country</p><p className="font-medium">Kenya</p></div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Account Details</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Account Type</p><p className="font-medium">Personal</p></div></div>
            <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">KYC Status</p><p className="font-medium text-emerald-600 dark:text-emerald-400">Verified</p></div></div>
            <div className="flex items-center gap-3"><Star className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Subscription</p><p className="font-medium">Starter (KSh 499/mo)</p></div></div>
            <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Member Since</p><p className="font-medium">August 2026</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}