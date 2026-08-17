import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssetRate, Wallet } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private api = inject(ApiService);

  wallets = signal<Wallet[]>([]);
  rates = signal<AssetRate[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.wallets().subscribe({
      next: (wallets) => {
        this.wallets.set(wallets);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.message(err));
      },
    });
    this.api.rates().subscribe({
      next: (rates) => this.rates.set(rates),
      error: () => undefined,
    });
  }

  rate(symbol: string): AssetRate | undefined {
    return this.rates().find((r) => r.symbol === symbol);
  }

  precision(symbol: string): number {
    return this.rate(symbol)?.precision ?? 2;
  }

  kesValue(wallet: Wallet): number {
    const r = this.rate(wallet.asset);
    return r ? wallet.balance * r.kes : 0;
  }

  totalKes(): number {
    return this.wallets().reduce((sum, wallet) => sum + this.kesValue(wallet), 0);
  }

  format(value: number, precision = 2): string {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    });
  }

  private message(err: unknown): string {
    const body = err as { error?: { message?: string } };
    return body?.error?.message ?? 'Could not load your wallet.';
  }
}