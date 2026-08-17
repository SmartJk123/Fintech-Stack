import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private tokenSignal = signal<string | null>(localStorage.getItem('ew_token'));
  private userSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  constructor() {
    if (this.tokenSignal()) {
      this.api.me().subscribe({
        next: (user) => this.userSignal.set(user),
        error: () => this.logout(),
      });
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.login(email, password).pipe(tap((r) => this.setSession(r)));
  }

  register(email: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.api.register(email, password, fullName).pipe(tap((r) => this.setSession(r)));
  }

  logout(): void {
    localStorage.removeItem('ew_token');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('ew_token', response.token);
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
  }
}