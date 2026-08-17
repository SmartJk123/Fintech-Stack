export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Wallet {
  id: string;
  asset: string;
  balance: number;
  pending: number;
  type: string;
  name: string;
}

export interface AssetRate {
  symbol: string;
  name: string;
  type: string;
  precision: number;
  usd: number;
  kes: number;
}

export interface WalletTransaction {
  id: string;
  reference: string;
  type: string;
  asset: string;
  amount: number;
  fee: number;
  status: string;
  method: string;
  counterparty?: string;
  network?: string;
  kesValue?: number;
  date: string;
}

export interface DepositResponse {
  reference: string;
  status: string;
  message: string;
  address?: string;
  demo: boolean;
}

export interface WithdrawalResponse {
  reference: string;
  status: string;
  message: string;
  transactionId?: string;
  demo: boolean;
}