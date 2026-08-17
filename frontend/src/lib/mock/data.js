// EliteWallet Mock Data — realistic demo data for all modules
// All data is simulated. No real financial data is used.

export const ASSETS = {
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', type: 'fiat', decimals: 2, color: '#22c55e', network: 'M-Pesa' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2, color: '#3b82f6', network: 'Bank' },
  BTC: { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8, color: '#f7931a', network: 'Bitcoin' },
  ETH: { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', decimals: 8, color: '#627eea', network: 'Ethereum' },
  USDT: { code: 'USDT', name: 'Tether USD', symbol: '₮', type: 'crypto', decimals: 6, color: '#26a17b', network: 'Tron' },
  USDC: { code: 'USDC', name: 'USD Coin', symbol: '$', type: 'crypto', decimals: 6, color: '#2775ca', network: 'Ethereum' },
};

export const MARKET_PRICES = {
  KES: { priceKES: 1, change24h: 0, change7d: 0, marketCap: null, volume24h: null },
  USD: { priceKES: 142.5, change24h: 0.12, change7d: -0.34, marketCap: null, volume24h: null },
  BTC: { priceKES: 9842500, change24h: 2.84, change7d: 5.12, change30d: 8.7, marketCap: 19500000000000, volume24h: 85000000000, sparkline: [96.2, 96.8, 97.1, 96.5, 97.3, 98.1, 98.42] },
  ETH: { priceKES: 342800, change24h: 1.92, change7d: 3.45, change30d: 6.2, marketCap: 412000000000, volume24h: 18000000000, sparkline: [33.1, 33.5, 33.8, 33.4, 34.0, 34.2, 34.28] },
  USDT: { priceKES: 142.3, change24h: 0.01, change7d: -0.02, change30d: 0.05, marketCap: 119000000000, volume24h: 45000000000, sparkline: [142.2, 142.3, 142.3, 142.2, 142.3, 142.3, 142.3] },
  USDC: { priceKES: 142.4, change24h: 0.02, change7d: -0.01, change30d: 0.03, marketCap: 34000000000, volume24h: 8000000000, sparkline: [142.3, 142.4, 142.4, 142.3, 142.4, 142.4, 142.4] },
};

export const WALLET_ACCOUNTS = [
  { id: 'wa-001', asset: 'KES', balance: 248650.40, pending: 0, type: 'fiat' },
  { id: 'wa-002', asset: 'USD', balance: 3200.00, pending: 0, type: 'fiat' },
  { id: 'wa-003', asset: 'BTC', balance: 0.0842, pending: 0.001, type: 'crypto' },
  { id: 'wa-004', asset: 'ETH', balance: 1.4532, pending: 0, type: 'crypto' },
  { id: 'wa-005', asset: 'USDT', balance: 850.00, pending: 0, type: 'crypto' },
  { id: 'wa-006', asset: 'USDC', balance: 420.00, pending: 0, type: 'crypto' },
];

export const TRANSACTIONS = [
  { id: 'txn-20260812-001', reference: 'EW-DEP-001', type: 'deposit', asset: 'KES', amount: 50000, fee: 0, status: 'completed', date: '2026-08-12T04:30:00Z', method: 'M-Pesa', counterparty: 'M-Pesa •2547•••••89', network: 'M-Pesa' },
  { id: 'txn-20260811-002', reference: 'EW-BUY-002', type: 'buy', asset: 'BTC', amount: 0.0051, fee: 250, status: 'completed', date: '2026-08-11T14:22:00Z', method: 'Instant Buy', counterparty: 'EliteWallet Exchange', network: 'Bitcoin', kesValue: 50000 },
  { id: 'txn-20260811-003', reference: 'EW-SEND-003', type: 'send', asset: 'USDT', amount: 200, fee: 1, status: 'completed', date: '2026-08-11T10:15:00Z', method: 'Crypto Transfer', counterparty: 'TKn••••••••••••x4Jp', network: 'Tron' },
  { id: 'txn-20260810-004', reference: 'EW-RCV-004', type: 'receive', asset: 'ETH', amount: 0.25, fee: 0, status: 'completed', date: '2026-08-10T18:45:00Z', method: 'Crypto Transfer', counterparty: '0x742d••••••••••••••••••••••••••••••3aF1', network: 'Ethereum' },
  { id: 'txn-20260809-005', reference: 'EW-SELL-005', type: 'sell', asset: 'ETH', amount: 0.3, fee: 180, status: 'completed', date: '2026-08-09T09:30:00Z', method: 'Instant Sell', counterparty: 'EliteWallet Exchange', network: 'Ethereum', kesValue: 102840 },
  { id: 'txn-20260808-006', reference: 'EW-WDR-006', type: 'withdraw', asset: 'KES', amount: 20000, fee: 35, status: 'completed', date: '2026-08-08T16:20:00Z', method: 'M-Pesa', counterparty: 'M-Pesa •2547••••••42', network: 'M-Pesa' },
  { id: 'txn-20260807-007', reference: 'EW-DEP-007', type: 'deposit', asset: 'USD', amount: 1000, fee: 0, status: 'completed', date: '2026-08-07T11:00:00Z', method: 'Bank Transfer', counterparty: 'Equity Bank ••••4521', network: 'Bank' },
  { id: 'txn-20260806-008', reference: 'EW-BUY-008', type: 'buy', asset: 'ETH', amount: 0.5, fee: 120, status: 'completed', date: '2026-08-06T13:45:00Z', method: 'Instant Buy', counterparty: 'EliteWallet Exchange', network: 'Ethereum', kesValue: 171400 },
  { id: 'txn-20260805-009', reference: 'EW-SEND-009', type: 'send', asset: 'KES', amount: 5000, fee: 0, status: 'completed', date: '2026-08-05T08:30:00Z', method: 'EliteWallet Transfer', counterparty: 'grace.kariuki', network: 'Internal' },
  { id: 'txn-20260812-010', reference: 'EW-WDR-010', type: 'withdraw', asset: 'BTC', amount: 0.01, fee: 0.0001, status: 'pending', date: '2026-08-12T05:45:00Z', method: 'Crypto Withdrawal', counterparty: 'bc1q••••••••••••••••••••••••••••••••x7Kz', network: 'Bitcoin' },
  { id: 'txn-20260812-011', reference: 'EW-BUY-011', type: 'buy', asset: 'USDC', amount: 300, fee: 75, status: 'processing', date: '2026-08-12T06:00:00Z', method: 'Instant Buy', counterparty: 'EliteWallet Exchange', network: 'Ethereum', kesValue: 42720 },
  { id: 'txn-20260804-012', reference: 'EW-RCV-012', type: 'receive', asset: 'KES', amount: 15000, fee: 0, status: 'completed', date: '2026-08-04T14:10:00Z', method: 'EliteWallet Transfer', counterparty: 'james.otieno', network: 'Internal' },
];

export const NOTIFICATIONS = [
  { id: 'n-001', category: 'transactions', title: 'Deposit Successful', message: 'KSh 50,000 deposited via M-Pesa', date: '2026-08-12T04:31:00Z', read: false },
  { id: 'n-002', category: 'security', title: 'New Device Login', message: 'Login detected from Nairobi, Kenya', date: '2026-08-11T20:00:00Z', read: false },
  { id: 'n-003', category: 'transactions', title: 'Withdrawal Pending', message: 'BTC withdrawal of 0.01 is being processed', date: '2026-08-12T05:46:00Z', read: false },
  { id: 'n-004', category: 'kyc', title: 'KYC Verified', message: 'Your identity verification is complete', date: '2026-08-03T10:00:00Z', read: true },
  { id: 'n-005', category: 'promotions', title: 'Lower Fees on Starter', message: 'Upgrade to Starter for 50% lower trading fees', date: '2026-08-09T12:00:00Z', read: true },
  { id: 'n-006', category: 'system', title: 'Scheduled Maintenance', message: 'Brief maintenance window on Aug 15, 2-3 AM EAT', date: '2026-08-10T09:00:00Z', read: true },
];

export const BENEFICIARIES = [
  { id: 'b-001', name: 'Grace Kariuki', type: 'elitewallet', identifier: 'grace.kariuki', asset: 'KES', addedDate: '2026-07-15' },
  { id: 'b-002', name: 'James Otieno', type: 'elitewallet', identifier: 'james.otieno', asset: 'KES', addedDate: '2026-07-20' },
  { id: 'b-003', name: 'M-Pesa Wallet', type: 'mpesa', identifier: '254712345678', asset: 'KES', addedDate: '2026-06-10' },
  { id: 'b-004', name: 'BTC Cold Storage', type: 'crypto', identifier: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', asset: 'BTC', network: 'Bitcoin', addedDate: '2026-05-22' },
  { id: 'b-005', name: 'Equity Bank', type: 'bank', identifier: '0112345678901', asset: 'KES', bank: 'Equity Bank', addedDate: '2026-04-18' },
];

export const SUPPORT_TICKETS = [
  { id: 'tkt-001', subject: 'Deposit not reflecting', category: 'Transactions', priority: 'High', status: 'Open', date: '2026-08-11', lastUpdate: '2026-08-12' },
  { id: 'tkt-002', subject: 'How to enable 2FA?', category: 'Security', priority: 'Medium', status: 'Resolved', date: '2026-08-05', lastUpdate: '2026-08-06' },
];

export const API_KEYS = [
  { id: 'key-001', name: 'Production API', key: 'jw_live_••••••••••••••••3aF9', created: '2026-07-01', lastUsed: '2026-08-12', status: 'active' },
  { id: 'key-002', name: 'Sandbox Testing', key: 'jw_test_••••••••••••••••9bC2', created: '2026-06-15', lastUsed: '2026-08-10', status: 'active' },
];

export const INVOICES = [
  { id: 'inv-001', number: 'INV-2026-001', customer: 'Acme Ltd', amount: 45000, currency: 'KES', status: 'Paid', dueDate: '2026-08-01', issueDate: '2026-07-15' },
  { id: 'inv-002', number: 'INV-2026-002', customer: 'Beta Corp', amount: 1200, currency: 'USD', status: 'Sent', dueDate: '2026-08-20', issueDate: '2026-08-05' },
  { id: 'inv-003', number: 'INV-2026-003', customer: 'Gamma LLC', amount: 28000, currency: 'KES', status: 'Overdue', dueDate: '2026-07-30', issueDate: '2026-07-15' },
];

export const KYC_STATUS = {
  status: 'Verified',
  level: 2,
  submittedDate: '2026-08-01',
  verifiedDate: '2026-08-03',
  documents: [
    { type: 'National ID', status: 'Verified', submittedDate: '2026-08-01' },
    { type: 'Selfie Verification', status: 'Verified', submittedDate: '2026-08-01' },
    { type: 'Proof of Address', status: 'Verified', submittedDate: '2026-08-01' },
  ],
};

export const SUBSCRIPTION = {
  plan: 'Starter',
  status: 'Active',
  price: 499,
  currency: 'KES',
  renewalDate: '2026-09-01',
  features: ['5 wallets', 'Lower trading fees', 'Priority support', 'API access (1000 calls/mo)'],
};

export const PORTFOLIO_HISTORY = {
  '7D': [1180000, 1195000, 1210000, 1205000, 1220000, 1235000, 1248650],
  '30D': [1150000, 1160000, 1145000, 1180000, 1195000, 1210000, 1205000, 1220000, 1235000, 1248650],
  '90D': [1080000, 1100000, 1120000, 1150000, 1160000, 1145000, 1180000, 1195000, 1210000, 1205000, 1220000, 1235000, 1248650],
  '1Y': [850000, 900000, 950000, 1000000, 1050000, 1080000, 1100000, 1120000, 1150000, 1160000, 1145000, 1180000, 1195000, 1210000, 1205000, 1220000, 1235000, 1248650],
  ALL: [500000, 650000, 750000, 850000, 900000, 950000, 1000000, 1050000, 1080000, 1100000, 1120000, 1150000, 1160000, 1145000, 1180000, 1195000, 1210000, 1205000, 1220000, 1235000, 1248650],
};

export const SECURITY_SCORE = {
  score: 85,
  items: [
    { label: 'Strong Password', status: 'pass', detail: 'Password meets all requirements' },
    { label: 'Two-Factor Authentication', status: 'pass', detail: 'Authenticator app enabled' },
    { label: 'Transaction PIN', status: 'pass', detail: 'PIN set for transactions' },
    { label: 'Biometric Login', status: 'warn', detail: 'Not enabled on this device' },
    { label: 'Trusted Devices', status: 'pass', detail: '2 devices trusted' },
    { label: 'Login Alerts', status: 'pass', detail: 'Email alerts enabled' },
  ],
};

export const ACTIVE_SESSIONS = [
  { id: 's-001', device: 'MacBook Pro • Chrome', location: 'Nairobi, Kenya', ip: '154.76.•••.•••', current: true, lastActive: 'Now' },
  { id: 's-002', device: 'iPhone 15 • EliteWallet App', location: 'Nairobi, Kenya', ip: '154.76.•••.•••', current: false, lastActive: '2 hours ago' },
  { id: 's-003', device: 'Windows PC • Edge', location: 'Mombasa, Kenya', ip: '197.232.•••.•••', current: false, lastActive: '3 days ago' },
];

export const DEMO_ADDRESSES = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT: 'TKn8VZ9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e',
  USDC: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
};

export const FAQS = [
  { q: 'Is EliteWallet available in my country?', a: 'EliteWallet is currently available in Kenya with expansion planned across East Africa. Check our website for the latest supported countries.' },
  { q: 'Which currencies and assets are supported?', a: 'We support KES and USD as fiat currencies, and BTC, ETH, USDT, and USDC as digital assets. More currencies are added regularly.' },
  { q: 'How long do deposits take?', a: 'M-Pesa deposits are instant. Bank transfers typically take 1-2 business hours. Crypto deposits depend on blockchain confirmations.' },
  { q: 'What are the fees?', a: 'Fees vary by transaction type. M-Pesa deposits are free. Trading fees start at 0.5%. See our pricing page for a full breakdown.' },
  { q: 'Is my money safe?', a: 'EliteWallet uses bank-grade encryption, two-factor authentication, and cold storage for digital assets. Your funds are protected at every level.' },
  { q: 'How does KYC verification work?', a: 'We verify your identity with a government ID, selfie, and proof of address. Verification typically completes within 24 hours.' },
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: 0,
    currency: 'KES',
    period: 'forever',
    description: 'Get started with essential wallet features',
    features: ['2 wallets (KES, USD)', 'Standard trading fees', 'M-Pesa deposits', 'Basic support', 'Email notifications'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Starter',
    price: 499,
    currency: 'KES',
    period: 'month',
    description: 'For active individual users',
    features: ['5 wallets', 'Lower trading fees (0.5%)', 'All deposit methods', 'Priority support', 'API access (1K calls/mo)', 'Advanced analytics'],
    cta: 'Choose Starter',
    popular: true,
  },
  {
    name: 'Business',
    price: 2499,
    currency: 'KES',
    period: 'month',
    description: 'For teams and growing businesses',
    features: ['Unlimited wallets', 'Lowest fees (0.3%)', 'Team management', 'Roles & permissions', 'Invoicing', 'API (10K calls/mo)', 'Webhooks', 'Dedicated support'],
    cta: 'Choose Business',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: null,
    currency: 'KES',
    period: 'custom',
    description: 'For large organizations',
    features: ['Everything in Business', 'Custom fee structures', 'Unlimited API calls', 'SSO & SAML', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
];