import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Wallet, TrendingUp, ShoppingCart, Tag, ArrowLeftRight,
  ArrowDownToLine, ArrowUpFromLine, Receipt, CreditCard, PieChart, BarChart3,
  FileText, Bell, LifeBuoy, Shield, Settings, User, Menu, X, Search,
} from 'lucide-react';
import DemoBadge from './DemoBadge';

const navItems = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Wallet', to: '/app/wallet', icon: Wallet },
  { label: 'Markets', to: '/app/markets', icon: TrendingUp },
  { label: 'Buy', to: '/app/buy', icon: ShoppingCart },
  { label: 'Sell', to: '/app/sell', icon: Tag },
  { label: 'Send', to: '/app/send', icon: ArrowLeftRight },
  { label: 'Receive', to: '/app/receive', icon: ArrowDownToLine },
  { label: 'Deposit', to: '/app/deposit', icon: ArrowDownToLine },
  { label: 'Withdraw', to: '/app/withdraw', icon: ArrowUpFromLine },
  { label: 'Transactions', to: '/app/transactions', icon: Receipt },
  { label: 'Payments', to: '/app/payments', icon: CreditCard },
  { label: 'Portfolio', to: '/app/portfolio', icon: PieChart },
  { label: 'Analytics', to: '/app/analytics', icon: BarChart3 },
  { label: 'Statements', to: '/app/statements', icon: FileText },
  { label: 'Notifications', to: '/app/notifications', icon: Bell },
  { label: 'Support', to: '/app/support', icon: LifeBuoy },
];

const bottomNavItems = [
  { label: 'Security', to: '/app/security', icon: Shield },
  { label: 'Settings', to: '/app/settings', icon: Settings },
  { label: 'Profile', to: '/app/profile', icon: User },
];

// Mobile bottom nav — most important actions
const mobileNav = [
  { label: 'Home', to: '/app', icon: LayoutDashboard },
  { label: 'Wallet', to: '/app/wallet', icon: Wallet },
  { label: 'Send', to: '/app/send', icon: ArrowLeftRight },
  { label: 'Receive', to: '/app/receive', icon: ArrowDownToLine },
  { label: 'More', to: '/app/transactions', icon: Receipt },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(to);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-elite text-white font-bold text-lg shadow-elite">
          E
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight">EliteWallet</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item.to)
                  ? 'bg-primary text-primary-foreground shadow-elite'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item.to)
                  ? 'bg-primary text-primary-foreground shadow-elite'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <div className="rounded-xl gradient-elite p-4 text-white">
          <p className="text-sm font-semibold">Upgrade to Business</p>
          <p className="mt-1 text-xs text-white/80">Lower fees, team access, and invoicing.</p>
          <Link to="/app/settings" className="mt-3 inline-flex rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/30">
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden flex-1 sm:block">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions, assets..."
                  className="w-full rounded-xl border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card"
                />
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3 sm:flex-none">
              <DemoBadge compact className="hidden sm:inline-flex" />
              <Link to="/app/notifications" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">3</span>
              </Link>
              <Link to="/app/profile" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-elite text-sm font-bold text-white">
                  AM
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight">Amara Mwangi</p>
                  <p className="text-xs text-muted-foreground">Personal</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] px-4 pb-20 pt-6 sm:px-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-lg lg:hidden">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                isActive(item.to) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
