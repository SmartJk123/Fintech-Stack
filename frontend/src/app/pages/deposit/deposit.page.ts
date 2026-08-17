import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetRate, DepositResponse } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-deposit',
  imports: [ReactiveFormsModule],
  templateUrl: './deposit.page.html',
  styleUrl: './deposit.page.css',
})
export class DepositPage {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  tab = signal<'mpesa' | 'crypto'>('mpesa');
  rates = signal<AssetRate[]>([]);
  cryptoAssets = computed(() => this.rates().filter((r) => r.type === 'crypto'));
  busy = signal(false);
  error = signal('');
  result = signal<DepositResponse | null>(null);

  mpesaForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    phone: ['', [Validators.required, Validators.pattern(/^(254|0)?[17]\d{8}$/)]],
  });

  cryptoForm = this.fb.group({
    asset: ['BTC', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.00000001)]],
  });

  constructor() {
    this.api.rates().subscribe({
      next: (rates) => this.rates.set(rates),
      error: () => undefined,
    });
  }

  mpesaDeposit(): void {
    if (this.mpesaForm.invalid || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.result.set(null);
    const amount = this.mpesaForm.value.amount ?? 0;
    const phone = this.mpesaForm.value.phone ?? '';
    this.api.mpesaDeposit(amount, phone).subscribe({
      next: (response) => {
        this.result.set(response);
        this.busy.set(false);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(this.message(err));
      },
    });
  }

  cryptoDeposit(): void {
    if (this.cryptoForm.invalid || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.result.set(null);
    const asset = this.cryptoForm.value.asset ?? 'BTC';
    const amount = this.cryptoForm.value.amount ?? 0;
    this.api.cryptoDeposit(asset, amount).subscribe({
      next: (response) => {
        this.result.set(response);
        this.busy.set(false);
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(this.message(err));
      },
    });
  }

  private message(err: unknown): string {
    const body = err as { error?: { message?: string } };
    return body?.error?.message ?? 'Deposit failed. Please try again.';
  }
}