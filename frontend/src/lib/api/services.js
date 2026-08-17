// EliteWallet service layer (configurable).
// - If VITE_API_BASE_URL is set: calls your Spring Boot REST API (see client.js).
// - Otherwise: returns local mock data so the prototype keeps working.
//
// Existing imports from @/lib/mock/services are re-exported through this module,
// so routing flips automatically for every page.
//
// Expected Spring Boot endpoints (base + path):
//   GET    /wallets                         GET  /assets/{code}
//   GET    /portfolio/history               GET  /transactions[?type=&status=&asset=]
//   GET    /transactions/{id}               POST /trading/quote        POST /trading/execute
//   POST   /transfers/send                   GET  /beneficiaries        POST /beneficiaries     DELETE /beneficiaries/{id}
//   POST   /deposits                          POST /withdrawals
//   GET    /markets/prices                   GET  /markets/prices/{asset}
//   GET    /kyc                              POST /kyc/submit
//   GET    /notifications                     POST /notifications/{id}/read
//   GET    /subscription                      GET  /plans
//   GET    /security/score                    GET  /security/sessions   POST /security/verify-pin  POST /security/verify-2fa
//   GET    /support/tickets                  POST /support/tickets      GET  /support/faqs
//   GET    /developer/keys                   POST /developer/keys
//   GET    /invoices                         POST /invoices

import { api, isApiConfigured } from './client';
import {
  ASSETS,
  MARKET_PRICES,
  WALLET_ACCOUNTS,
  TRANSACTIONS,
  NOTIFICATIONS,
  BENEFICIARIES,
  SUPPORT_TICKETS,
  API_KEYS,
  INVOICES,
  KYC_STATUS,
  SUBSCRIPTION,
  PORTFOLIO_HISTORY,
  SECURITY_SCORE,
  ACTIVE_SESSIONS,
  DEMO_ADDRESSES,
  FAQS,
  PRICING_PLANS,
} from '@/lib/mock/data';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ─── Wallet Service ───────────────────────────────────────────
export const walletService = {
  async getWallet() {
    if (isApiConfigured())return api.get('/wallets');
    await delay();
    return WALLET_ACCOUNTS;
  },
  async getWalletAccounts() {
    if (isApiConfigured())return api.get('/wallets');
    await delay();
    return WALLET_ACCOUNTS;
  },
  async getAsset(code) {
    if (isApiConfigured())return api.get(`/assets/${code}`);
    await delay(200);
    return ASSETS[code];
  },
  async getPortfolio() {
    if (isApiConfigured())return api.get('/portfolio/history');
    await delay();
    return PORTFOLIO_HISTORY;
  },
  getAssetValueKES(account) {
    const price = MARKET_PRICES[account.asset]?.priceKES ?? 0;
    return account.balance * price;
  },
  getTotalPortfolioValueKES() {
    return WALLET_ACCOUNTS.reduce((sum, acc) => {
      const price = MARKET_PRICES[acc.asset]?.priceKES ?? 0;
      return sum + acc.balance * price;
    }, 0);
  },
};

// ─── Transaction Service ──────────────────────────────────────
export const transactionService = {
  async getTransactions(filters = {}) {
    if (isApiConfigured()){
      const defined = Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== ''));
      const qs = new URLSearchParams(defined).toString();
      return api.get(`/transactions${qs ? `?${qs}` : ''}`);
    }
    await delay();
    let result = [...TRANSACTIONS];
    if (filters.type) result = result.filter((t) => t.type === filters.type);
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.asset) result = result.filter((t) => t.asset === filters.asset);
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  async getTransaction(id) {
    if (isApiConfigured())return api.get(`/transactions/${id}`);
    await delay(200);
    return TRANSACTIONS.find((t) => t.id === id);
  },
};

// ─── Trading Service (Buy/Sell) ───────────────────────────────
export const tradingService = {
  async getQuote(orderData) {
    if (isApiConfigured())return api.post('/trading/quote', orderData);
    const { side, asset, amountKES } = orderData;
    await delay(600);
    const price = MARKET_PRICES[asset]?.priceKES ?? 0;
    const feeRate = 0.005;
    const fee = amountKES * feeRate;
    const netAmount = amountKES - fee;
    const assetAmount = netAmount / price;
    return {
      side,
      asset,
      amountKES,
      assetAmount,
      price,
      fee,
      feeRate,
      netAmount,
      expiresAt: Date.now() + 120000,
      rateId: `quote-${Date.now()}`,
    };
  },
  async executeOrder(orderData) {
    if (isApiConfigured())return api.post('/trading/execute', orderData);
    await delay(1500);
    return {
      status: 'success',
      transactionId: `txn-${Date.now()}`,
      reference: `EW-${orderData.side.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      ...orderData,
    };
  },
};

// ─── Payment / Transfer Service (Send) ────────────────────────
export const paymentService = {
  async sendTransfer(transferData) {
    if (isApiConfigured())return api.post('/transfers/send', transferData);
    const { asset, amount, recipient, network } = transferData;
    await delay(1500);
    return {
      status: 'success',
      transactionId: `txn-${Date.now()}`,
      reference: `EW-SEND-${Math.floor(Math.random() * 9000) + 1000}`,
      asset,
      amount,
      recipient,
      network,
    };
  },
  async getBeneficiaries() {
    if (isApiConfigured())return api.get('/beneficiaries');
    await delay();
    return BENEFICIARIES;
  },
  async addBeneficiary(data) {
    if (isApiConfigured())return api.post('/beneficiaries', data);
    await delay(400);
    return { status: 'success', id: `b-${Date.now()}`, ...data };
  },
  async removeBeneficiary(id) {
    if (isApiConfigured())return api.del(`/beneficiaries/${id}`);
    await delay(400);
    return { status: 'success', id };
  },
};

// ─── Deposit / Withdraw Service ───────────────────────────────
export const depositService = {
  async createDeposit(depositData) {
    if (isApiConfigured())return api.post('/deposits', depositData);
    const { method, amount, asset, phone } = depositData;
    await delay(1200);
    return {
      status: 'success',
      transactionId: `txn-${Date.now()}`,
      reference: `EW-DEP-${Math.floor(Math.random() * 9000) + 1000}`,
      method,
      amount,
      asset,
      phone,
    };
  },
  async createWithdrawal(withdrawalData) {
    if (isApiConfigured())return api.post('/withdrawals', withdrawalData);
    const { method, amount, asset, destination, network } = withdrawalData;
    await delay(1500);
    return {
      status: 'success',
      transactionId: `txn-${Date.now()}`,
      reference: `EW-WDR-${Math.floor(Math.random() * 9000) + 1000}`,
      method,
      amount,
      asset,
      destination,
      network,
    };
  },
  getDepositAddress(asset) {
    return DEMO_ADDRESSES[asset] || 'demo-address';
  },
};

// ─── Market Service ───────────────────────────────────────────
export const marketService = {
  async getMarketPrices() {
    if (isApiConfigured())return api.get('/markets/prices');
    await delay();
    return MARKET_PRICES;
  },
  async getAssetPrice(asset) {
    if (isApiConfigured())return api.get(`/markets/prices/${asset}`);
    await delay(200);
    return MARKET_PRICES[asset];
  },
};

// ─── KYC Service ──────────────────────────────────────────────
export const kycService = {
  async getStatus() {
    if (isApiConfigured())return api.get('/kyc');
    await delay();
    return KYC_STATUS;
  },
  async submitVerification(data) {
    if (isApiConfigured())return api.post('/kyc/submit', data);
    await delay(2000);
    return { status: 'pending', ...data };
  },
};

// ─── Notification Service ─────────────────────────────────────
export const notificationService = {
  async getNotifications() {
    if (isApiConfigured())return api.get('/notifications');
    await delay();
    return NOTIFICATIONS;
  },
  async markAsRead(id) {
    if (isApiConfigured())return api.post(`/notifications/${id}/read`);
    await delay(200);
    return { status: 'success', id };
  },
};

// ─── Subscription Service ─────────────────────────────────────
export const subscriptionService = {
  async getSubscription() {
    if (isApiConfigured())return api.get('/subscription');
    await delay();
    return SUBSCRIPTION;
  },
  async getPlans() {
    if (isApiConfigured())return api.get('/plans');
    await delay();
    return PRICING_PLANS;
  },
};

// ─── Security Service ──────────────────────────────────────────
export const securityService = {
  async getSecurityScore() {
    if (isApiConfigured())return api.get('/security/score');
    await delay();
    return SECURITY_SCORE;
  },
  async getActiveSessions() {
    if (isApiConfigured())return api.get('/security/sessions');
    await delay();
    return ACTIVE_SESSIONS;
  },
  async verifyTransactionPin(pin) {
    if (isApiConfigured())return api.post('/security/verify-pin', { pin });
    await delay(800);
    return pin === '1234' ? { status: 'success' } : { status: 'error', message: 'Invalid PIN' };
  },
  async verify2FA(code) {
    if (isApiConfigured())return api.post('/security/verify-2fa', { code });
    await delay(800);
    return code === '123456' ? { status: 'success' } : { status: 'error', message: 'Invalid code' };
  },
};

// ─── Support Service ──────────────────────────────────────────
export const supportService = {
  async getTickets() {
    if (isApiConfigured())return api.get('/support/tickets');
    await delay();
    return SUPPORT_TICKETS;
  },
  async createTicket(data) {
    if (isApiConfigured())return api.post('/support/tickets', data);
    await delay(800);
    return { status: 'success', id: `tkt-${Date.now()}`, ...data };
  },
  async getFAQs() {
    if (isApiConfigured())return api.get('/support/faqs');
    await delay(200);
    return FAQS;
  },
};

// ─── Developer/API Service ────────────────────────────────────
export const developerService = {
  async getAPIKeys() {
    if (isApiConfigured())return api.get('/developer/keys');
    await delay();
    return API_KEYS;
  },
  async createAPIKey(name) {
    if (isApiConfigured())return api.post('/developer/keys', { name });
    await delay(800);
    return {
      id: `key-${Date.now()}`,
      name,
      key: `jw_live_${Math.random().toString(36).slice(2, 18)}`,
      status: 'active',
      created: new Date().toISOString().slice(0, 10),
      lastUsed: 'Never',
    };
  },
};

// ─── Invoice Service ──────────────────────────────────────────
export const invoiceService = {
  async getInvoices() {
    if (isApiConfigured())return api.get('/invoices');
    await delay();
    return INVOICES;
  },
  async createInvoice(data) {
    if (isApiConfigured())return api.post('/invoices', data);
    await delay(800);
    return { status: 'success', id: `inv-${Date.now()}`, ...data };
  },
};

// ─── Asset metadata (re-exported for direct imports) ─────────
export { ASSETS, MARKET_PRICES, DEMO_ADDRESSES };
