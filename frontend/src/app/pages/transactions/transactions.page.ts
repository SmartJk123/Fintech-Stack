import { Component, inject, signal } from '@angular/core';
import { WalletTransaction } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.page.html',
  styleUrl: './transactions.page.css',
})
export class TransactionsPage {
  private api = inject(ApiService);

  transactions = signal<WalletTransaction[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.transactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.message(err));
      },
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  format(value: number | undefined, precision = 2): string {
    if (value === undefined || value === null) {
      return '—';
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    });
  }

  private message(err: unknown): string {
    const body = err as { error?: { message?: string } };
    return body?.error?.message ?? 'Could not load transactions.';
  }
}