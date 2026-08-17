# VS Code AI Prompts — Angular + Spring Boot + PostgreSQL port

Paste these into Cursor / GitHub Copilot / Windsurf in order. They reference
`docs/backend-api-contract.md` in this same repo, so open that file's context first.

Copy the contract file into your new Angular/Spring Boot repo (it already lives at
`docs/backend-api-contract.md` here) and feed it to the AI alongside these prompts.

---

## Prompt 1 — Spring Boot skeleton + PostgreSQL schema

> Read `docs/backend-api-contract.md` in this repo. Scaffold a Spring Boot 3.x project
> (Java 21, Maven, Spring Web, Spring Data JPA, Spring Security, PostgreSQL driver, Flyway,
> spring-boot-starter-validation). Package `io.elitewallet.api`.
> Generate the full PostgreSQL schema as Flyway migrations (`V1__init.sql`) matching the
> tables in the contract's "Entities" section — `users`, `wallet_accounts`, `transactions`,
> `beneficiaries`, `notifications`, `support_tickets`, `api_keys`, `invoices`.
> Add JPA entities + repositories for each table, all scoping reads/writes by the current
> authenticated `user_id` (extract from JWT via a `@CurrentUserId` argument resolver) to
> enforce per-user isolation. Do not implement any transaction settlement or custody logic.
> Output `application.yml` with placeholders for Postgres, JWT secret, and M-Pesa secrets
> (consumer-key, consumer-secret, shortcode, passkey, env, callback-url).

## Prompt 2 — REST controllers + DTOs

> Read `docs/backend-api-contract.md`. For every endpoint in that contract, create a
> `@RestController` matching the path, HTTP method, request shape, and response shape exactly.
> Use record-style DTOs that mirror the contract's JSON shapes. Return 400 on validation
> errors and 404 for missing owned resources. Implement the trading/quote and
> trading/execute endpoints with 0.5% fee arithmetic and a 120-second quote expiry cached
> in-memory; return the exact `Quote` and `ExecutionResult` shapes in the contract. Stub
> other business endpoints against the repositories. Do not write any frontend code.

## Prompt 3 — M-Pesa Daraja service

> Read `base44/functions/mpesaStkPush/entry.ts` in this repo and translate its logic to
> a Spring `@Service MpesaService` plus a REST controller `POST /deposits/mpesa/stk`.
> Use the same Daraja OAuth + STK Push flow, the same phone normalization, the same
> password (shortcode + passkey + timestamp, Base64) and timestamp format. Read secrets
> from `application.yml` (`mpesa.*`). Wire it into the existing `/deposits/mpesa/stk`
> controller. Add a webhook controller for Safaricom's callback at
> `POST /webhooks/mpesa/stk-callback` that surfaces the raw callback JSON and marks the
> matching transaction row's status; do not settle funds.

## Prompt 4 — Security (JWT + per-user RLS)

> Implement Spring Security with a JWT stateless filter. `POST /auth/register` creates a
> user, `POST /auth/login` issues a JWT, `GET /auth/me` returns the authenticated user.
> Hash passwords with BCrypt. Every other endpoint requires authentication; all repository
> queries must filter by the current user's id from the JWT claim so one user can never
> read another's wallet_accounts, transactions, beneficiaries, notifications, or tickets.
> Add `@PreAuthorize` or method-level checks for admin-only operations (none exist yet in
> the contract, but wire it in).

## Prompt 5 — Seed data matching the React mock

> Read `src/lib/mock/data.js` in this repo. Generate a Spring `CommandLineRunner` / Flyway
> seed migration (`V2__seed.sql`) that creates one demo user (email demo@elitewallet.io,
> BCrypt password "Demo1234!") and inserts data that mirrors WALLET_ACCOUNTS, TRANSACTIONS,
> NOTIFICATIONS, BENEFICIARIES, SUPPORT_TICKETS, API_KEYS, INVOICES, KYC_STATUS,
> SUBSCRIPTION, PORTFOLIO_HISTORY, SECURITY_SCORE, ACTIVE_SESSIONS, MARKET_PRICES, and
> PRICING_PLANS. Preserve field names and amounts so the UI looks identical when pointed
> at this backend.

## Prompt 6 — Angular frontend

> Separate task — do after the backend runs and returns the seed data. Create an Angular
> standalone app (Angular 18+, TypeScript, Tailwind CSS) that mirrors the EliteWallet React
> pages in `src/pages/` of this repo (Dashboard, Wallet, Markets, Buy, Sell, Send, Receive,
> Deposit, Withdraw, Transactions, TransactionDetail, Payments, Portfolio, Analytics,
> Statements, Notifications, Support, Security, Settings, Profile). Use Angular Router
> with the same routes the React app uses (`/app/...` under an auth guard). Build an
> `HttpClient`-based service layer that calls the Spring Boot REST endpoints exactly as
> named in `docs/backend-api-contract.md` — one service per domain (WalletService,
> TradingService, TransactionService, etc.). Port the Tailwind design tokens from
> `src/index.css` and `tailwind.config.js`. Replicate the responsive sidebar/topbar layout
> from `src/components/AppLayout.jsx`. Reuse the M-Pesa STK Push UX pattern from the React
> Deposit page. Do not invent new features beyond what the React prototype has.

---

Tip: run prompts 1–5 inside the Spring Boot project folder; run prompt 6 inside a separate
Angular folder that proxies to the running backend at `VITE_API_BASE_URL` (or Angular's
`proxy.conf.json`).