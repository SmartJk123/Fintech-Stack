import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DepositPage } from './pages/deposit/deposit.page';
import { LoginPage } from './pages/auth/login.page';
import { RegisterPage } from './pages/auth/register.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { WithdrawPage } from './pages/withdraw/withdraw.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'deposit', component: DepositPage, canActivate: [authGuard] },
  { path: 'withdraw', component: WithdrawPage, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionsPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];