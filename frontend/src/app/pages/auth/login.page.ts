import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  busy = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.auth.login(email, password).subscribe({
      next: () => this.busy.set(false),
      error: (err) => {
        this.busy.set(false);
        this.error.set(this.message(err));
      },
    });
  }

  private message(err: unknown): string {
    const body = err as { error?: { message?: string } };
    return body?.error?.message ?? 'Login failed. Please try again.';
  }
}