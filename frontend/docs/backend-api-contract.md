# EliteWallet Backend API Contract

This document defines the REST API contract the EliteWallet React prototype expects from a
Spring Boot + PostgreSQL backend. The frontend already calls these endpoints when
`VITE_API_BASE_URL` is set (see `src/lib/api/client.js`); when it is unset, the app falls
back to local mock data so development is never blocked.

Build the Spring Boot server to this contract and the Angular/Spring Boot port will
plug straight in.

## Conventions

- **Base URL**: configured via frontend env var `VITE_API_BASE_URL` (e.g. `https://api.elitewallet.io`).
- **Auth**: `Authorization: Bearer <jwt>` on all endpoints except `/auth/*`.
- **Content-Type**: `application/json`.
- **Errors**: `{ "message": "string", "code": "string" }` with appropriate HTTP status.
- **Money**: all money amounts are numbers (floats in asset-native units, e.g. `0.0051` BTC,
  `50000` KES). The frontend formats; the backend must preserve precision.
- **Dates**: ISO 8601 UTC strings (e.g. `2026-08-12T04:30:00Z`).
- **IDs**: opaque strings, passed back untouched by the frontend.

## Entities (PostgreSQL)

Six tables cover the current prototype. All have `created_at`, `updated_at` and a
`user_id` FK to the `users` table (auth owns users).

```
users            id(pk), email(unique), full_name, role(user|admin), created_at, updated_at
wallet_accounts  id(pk), user_id(fk), asset(varchar), balance(numeric), pending(numeric),
                 type(fiat|crypto), created_at, updated_at
                 unique(user_id, asset)
transactions     id(pk), user_id(fk), reference(varchar), type(deposit|withdraw|buy|sell|
                 send|receive), asset(varchar), amount(numeric), fee(numeric),
                 status(completed|pending|processing|failed), method, counterparty, network,
                 kes_value(numeric), date(timestamptz), created_at, updated_at
beneficiaries    id(pk), user_id(fk), name, type(elitewallet|mpesa|bank|crypto), identifier,
                 asset, network, bank, added_date(date), created_at, updated_at
notifications    id(pk), user_id(fk), category, title, message, read(bool), date(timestamptz)
support_tickets  id(pk), user_id(fk), subject, category, priority, status(open|resolved),
                 date(date), last_update(date), created_at, updated_at
api_keys         id(pk), user_id(fk), name, key_hash, status, created(date), last_used
invoices         id(pk), user_id(fk), number, customer, amount, currency, status,
                 due_date, issue_date, created_at, updated_at
```

## Endpoints

### Auth (Spring Security + JWT)
```
POST /auth/register      { email, password, fullName }        -> { userId }
POST /auth/login         { email, password }                  -> { token, user }
POST /auth/refresh       { token }                            -> { token }
POST /auth/forgot-password { email }                          -> { status: 'ok' }
POST /auth/reset-password  { token, newPassword }             -> { status: 'ok' }
GET  /auth/me             -> { id, email, fullName, role }
```

### Wallet
```
GET  /wallets                                               -> WalletAccount[]
GET  /assets/{code}                                         -> Asset
GET  /portfolio/history?range=7D|30D|90D|1Y|ALL             -> number[]
```
WalletAccount: `{ id, asset, balance, pending, type }`
Asset: `{ code, name, symbol, type, decimals, color, network }`

### Transactions
```
GET  /transactions?type=&status=&asset=                      -> Transaction[]
GET  /transactions/{id}                                     -> Transaction
```
Transaction: `{ id, reference, type, asset, amount, fee, status, date, method, counterparty, network, kesValue? }`

### Trading (Buy / Sell)
```
POST /trading/quote   { side: 'buy'|'sell', asset, amountKES } -> Quote
POST /trading/execute { rateId, side, asset, amountKES }        -> ExecutionResult
```
Quote: `{ side, asset, amountKES, assetAmount, price, fee, feeRate, netAmount, expiresAt, rateId }`
ExecutionResult: `{ status, transactionId, reference, side, asset, amountKES }`

### Payments / Transfers
```
POST /transfers/send  { asset, amount, recipient, network? }   -> ExecutionResult
GET  /beneficiaries                                    -> Beneficiary[]
POST /beneficiaries    { name, type, identifier, asset, network?, bank? } -> Beneficiary
DEL  /beneficiaries/{id}                               -> { status: 'ok', id }
```
Beneficiary: `{ id, name, type, identifier, asset, network?, bank?, addedDate }`

### Deposits / Withdrawals
```
POST /deposits        { method, amount, asset, phone?, reference? }    -> ExecutionResult
POST /deposits/mpesa/stk { phone, amount, accountReference?, transactionDesc? } -> STKPushResponse
POST /withdrawals     { method, amount, asset, destination, network? } -> ExecutionResult
GET  /wallets/{asset}/deposit-address                       -> { address }
```
**STKPushResponse** (Safaricom Daraja raw shape):
```json
{ "MerchantRequestID": "...", "CheckoutRequestID": "...",
  "ResponseCode": "0", "ResponseDescription": "...",
  "CustomerMessage": "..." }
```
The STK push logic is already written and portable — see
`base44/functions/mpesaStkPush/entry.ts`. It needs the same secrets in Spring Boot env
(`application.yml`): `mpesa.consumer-key`, `mpesa.consumer-secret`, `mpesa.shortcode`,
`mpesa.passkey`, `mpesa.env`, `mpesa.callback-url`.

### Markets
```
GET /markets/prices          -> { [assetCode]: MarketPrice }
GET /markets/prices/{asset}  -> MarketPrice
```
MarketPrice: `{ priceKES, change24h, change7d, change30d?, marketCap?, volume24h?, sparkline?: number[] }`

### KYC
```
GET  /kyc           -> KycStatus
POST /kyc/submit    { documents: [...] } -> { status: 'pending' }
```
KycStatus: `{ status: 'Unverified'|'Pending'|'Verified', level, submittedDate?, verifiedDate?, documents[] }`

### Notifications
```
GET  /notifications                -> Notification[]
POST /notifications/{id}/read      -> { status: 'ok', id }
```
Notification: `{ id, category, title, message, date, read }`

### Subscription / Plans
```
GET /subscription   -> { plan, status, price, currency, renewalDate, features[] }
GET /plans          -> Plan[]
```

### Security
```
GET  /security/score     -> { score, items[] }
GET  /security/sessions  -> Session[]
POST /security/verify-pin { pin }  -> { status } | error
POST /security/verify-2fa { code } -> { status } | error
```

### Support
```
GET  /support/tickets          -> Ticket[]
POST /support/tickets { subject, category, priority, description } -> Ticket
GET  /support/faqs             -> { q, a }[]
```

### Developer
```
GET  /developer/keys           -> ApiKey[]
POST /developer/keys { name }  -> ApiKey  (returns plaintext key ONCE)
```

### Invoices
```
GET  /invoices           -> Invoice[]
POST /invoices { customer, amount, currency, dueDate } -> Invoice
```

## Deliberately out of scope for the prototype
- Real transaction settlement / ledger double-entry movements (requires licensed partners).
- Private key custody / hot wallet signing.
- KYC document processing (route to SmileIdentity/Onfido when ready).
- Real market data (use CoinGecko/Binance API as a server-side price feed).