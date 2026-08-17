import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  busy = signal(false);
  error = signal('');

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    const fullName = this.form.value.fullName ?? '';
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.auth.register(email, password, fullName).subscribe({
      next: () => this.busy.set(false),
      error: (err) => {
        this.busy.set(false);
        this.error.set(this.message(err));
      },
    });
  }

  private message(err: unknown): string {
    const body = err as { error?: { message?: string } };
    return body?.error?.message ?? 'Registration failed. Please try again.';
  }
}