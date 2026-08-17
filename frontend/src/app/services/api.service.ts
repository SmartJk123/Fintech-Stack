import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AssetRate,
  AuthResponse,
  DepositResponse,
  User,
  Wallet,
  WalletTransaction,
  WithdrawalResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  register(email: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, { email, password, fullName });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, { email, password });
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/auth/me`);
  }

  wallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.base}/wallets`);
  }

  rates(): Observable<AssetRate[]> {
    return this.http.get<AssetRate[]>(`${this.base}/rates`);
  }

  transactions(): Observable<WalletTransaction[]> {
    return this.http.get<WalletTransaction[]>(`${this.base}/transactions`);
  }

  mpesaDeposit(amount: number, phone: string): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.base}/deposits/mpesa`, { amount, phone });
  }

  cryptoDeposit(asset: string, amount: number): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.base}/deposits/crypto`, { asset, amount });
  }

  mpesaWithdraw(amount: number, phone: string, idempotencyKey: string): Observable<WithdrawalResponse> {
    return this.http.post<WithdrawalResponse>(`${this.base}/withdrawals/mpesa`, { amount, phone, idempotencyKey });
  }

  cryptoWithdraw(asset: string, amount: number, address: string, idempotencyKey: string): Observable<WithdrawalResponse> {
    return this.http.post<WithdrawalResponse>(`${this.base}/withdrawals/crypto`, { asset, amount, address, idempotencyKey });
  }
}