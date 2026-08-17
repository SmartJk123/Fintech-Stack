// M-Pesa Daraja STK Push integration entrypoint.
// - When VITE_API_BASE_URL is set: calls your Spring Boot endpoint POST /deposits/mpesa/stk.
// - Otherwise: calls the Base44 backend function `mpesaStkPush` (logic portable to Spring Boot).
import { api, isApiConfigured } from './client';
import { base44 } from '@/api/base44Client';

export async function initiateMpesaStkPush({ phone, amount, accountReference = 'EliteWallet', transactionDesc = 'Deposit' }) {
  if (isApiConfigured()) {
    return api.post('/deposits/mpesa/stk', { phone, amount, accountReference, transactionDesc });
  }
  const res = await base44.functions.invoke('mpesaStkPush', {
    phone,
    amount,
    accountReference,
    transactionDesc,
  });
  return res.data;
}
