# Fintech System

> A full-stack fintech platform built with **Spring Boot** (REST API + ledger engine) and **Angular** (enterprise dashboard), backed by PostgreSQL. The learning path follows the official [roadmap.sh](https://roadmap.sh/dashboard) tracks for [Spring Boot](https://roadmap.sh/spring-boot) and [Angular](https://roadmap.sh/angular), applied to a real financial product.

The Fintech System is a learning-by-building project: instead of learning Spring Boot and Angular in isolation, we build a real fintech platform step by step - multi-currency wallets (KES, USD, BTC), a double-entry ledger, JWT security, dashboards, and async integrations like M-Pesa webhooks.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Tech Stack](#tech-stack)
- [Database & Architecture Decisions](#database--architecture-decisions)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Learning Roadmap](#learning-roadmap)
- [Full-Stack Milestones](#full-stack-milestones)
- [12-Week Plan](#12-week-plan)
- [Progress Tracking](#progress-tracking)
- [Publishing to GitHub](#publishing-to-github)
- [License](#license)

---

## Project Overview

The system has two halves:

- **Backend** - a Spring Boot REST API that owns all business logic: the core ledger engine, JWT authentication with role-based access control, idempotent transfer endpoints, and async jobs.
- **Frontend** - an Angular application that consumes the API and provides a responsive dashboard for wallets, transfers, exchange, and portfolio summaries.

The guiding principle: **Spring Boot owns the money.** No client-side database writes, no business rules in the browser - the API is the only path to the ledger.

## Architecture at a Glance

```mermaid
flowchart LR
    subgraph FE["Angular SPA"]
        A[Wallet Dashboard] --> B[Services / RxJS / Signals]
        B --> C[Reactive Forms + HTTP Interceptors]
    end

    subgraph BE["Spring Boot API"]
        D[Controllers / DTOs] --> E[Services<br/>@Transactional Ledger Engine]
        E --> F[Spring Security<br/>JWT + RBAC]
    end

    subgraph DATA["Data Layer"]
        G[(PostgreSQL<br/>via Supabase)]
        H[(Redis<br/>Idempotency + Cache)]
    end

    subgraph ASYNC["Async Layer"]
        I[Kafka / RabbitMQ]
        J[Webhooks<br/>M-Pesa / Crypto]
    end

    C -->|HTTP + JSON + JWT| D
    E --> G
    E --> H
    E --> I
    I --> J
```

## Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Backend | Java 17+, Spring Boot, Spring MVC | REST API + business logic |
| Ledger | Spring Data JPA, Hibernate, Flyway/Liquibase | ORM + versioned schema migrations |
| Database | PostgreSQL (Supabase as managed host) | ACID guarantees, exact `NUMERIC` math, row locking |
| Cache / Idempotency | Redis | Prevents double charges, caches exchange rates |
| Security | Spring Security, JWT, BCrypt | Stateless auth + RBAC |
| Async | Kafka / RabbitMQ | Emails, PDF statements, notifications |
| Frontend | Angular, TypeScript, RxJS | Enterprise dashboard SPA |
| UI | Angular Material or Tailwind CSS | Component library / styling |
| Tooling | Maven/Gradle, npm, Git, Docker | Build, dependency & deploy |

## Database & Architecture Decisions

### PostgreSQL - yes, the right call

- **ACID guarantees:** multi-currency transfers are atomic - either both the debit and credit happen, or neither does.
- **Exact math precision:** `NUMERIC` prevents floating-point rounding errors on financial values (e.g., fractional crypto amounts like `0.00000001` BTC).
- **Concurrency controls:** row-level pessimistic locking (`SELECT ... FOR UPDATE`) prevents race conditions during simultaneous transfers.

### Supabase - yes as a managed database host

Spring Boot connects directly to Supabase's PostgreSQL database with standard JDBC / Spring Data JPA credentials. You get an enterprise database on cloud infrastructure with automatic backups and a visual SQL browser out of the box.

### Supabase - no for client SDKs / Auth / Realtime

Do **not** use the Supabase client SDKs inside Spring Boot or Angular. In a Java enterprise stack, Spring Boot must own business logic, security, and authentication via **Spring Security + JWT**. Allowing direct client-side database writes would bypass the strict ledger validation rules that keep the books balanced.

## Repository Structure

```text
fintech-stack/
|-- backend/                     # Spring Boot REST API
|   |-- src/main/java/...        # controllers, services, entities, security, ledger
|   |-- src/main/resources/
|   |   |-- db/migration/        # Flyway / Liquibase migrations
|   |   `-- application.yml
|   `-- pom.xml
|-- frontend/                    # Angular 21 SPA
|   |-- src/
|   |   |-- app/
|   |   |   |-- layout/
|   |   |   |   |-- header/    # indigo header + golden border
|   |   |   |   `-- footer/    # indigo footer + golden border
|   |   |   |-- features/      # auth, dashboard, wallet, admin (planned)
|   |   |   |-- core/          # interceptors, guards, state (planned)
|   |   |   `-- shared/        # UI components, models (planned)
|   |   |-- styles.css         # indigo + golden theme
|   |   `-- index.html
|   |-- angular.json
|   `-- package.json
|-- docs/                        # Design decisions and roadmap notes
|-- .gitignore
`-- README.md
```

> The `backend/` folder will be added in [Milestone 1](#full-stack-milestones).

## Getting Started

### Prerequisites

- JDK 17+
- Node.js 18+ and npm
- Git
- PostgreSQL (local or Supabase) and Redis (Docker recommended)

### Backend (Spring Boot)

Scaffold from [Spring Initializr](https://start.spring.io/) with: **Spring Web, Spring Data JPA, Spring Security, Validation, PostgreSQL Driver, Flyway/Liquibase, Spring Boot Actuator, Lombok**, then run:

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`.

### Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

### Configuration

Copy the sample configuration and adjust values locally:

```bash
cp backend/src/main/resources/application.example.yml backend/src/main/resources/application-local.yml
```

Key settings: PostgreSQL URL/credentials (local or Supabase), Redis connection, JWT secret, and the Angular API base URL.

---

## Learning Roadmap

A 4-phase internship roadmap, sequenced so the financial heart of the platform is built before the UI. Every phase maps back to the official [Spring Boot](https://roadmap.sh/spring-boot) and [Angular](https://roadmap.sh/angular) roadmaps - tick the boxes as you go.

### Roadmap Overview

```mermaid
flowchart TD
    P1[Phase 1<br/>Core Ledger Engine<br/>Java / Spring Boot / PostgreSQL] --> P2[Phase 2<br/>Secure APIs & Business Logic<br/>Spring Security / JWT / RBAC]
    P2 --> P3[Phase 3<br/>Enterprise Angular Dashboard<br/>RxJS / Forms / Interceptors]
    P3 --> P4[Phase 4<br/>Advanced Fintech<br/>Kafka / Audit / Webhooks]
```

### Phase 1 - Core Ledger Engine (Java & Database)

**Goal:** build the financial heart of the platform before touching the UI.

**Core schema (PostgreSQL):**

```mermaid
erDiagram
    USERS ||--o{ WALLETS : owns
    WALLETS ||--o{ TRANSACTIONS : "participates in"
    TRANSACTIONS ||--|{ LEDGER_ENTRIES : contains

    USERS {
        bigint id PK
        varchar email
        varchar password_hash
        varchar role
    }

    WALLETS {
        bigint id PK
        bigint user_id FK
        varchar currency "KES / USD / BTC"
        numeric balance
    }

    TRANSACTIONS {
        uuid id PK
        varchar type "TRANSFER / EXCHANGE"
        varchar status
        uuid idempotency_key
    }

    LEDGER_ENTRIES {
        bigint id PK
        uuid transaction_id FK
        bigint wallet_id FK
        numeric amount
        varchar side "DEBIT / CREDIT"
    }
```

**Checklist:**

- [ ] Design schema: `users`, `wallets` (multi-currency: KES, USD, BTC), `transactions`, `ledger_entries` (debits & credits)
- [ ] Set up Flyway or Liquibase for versioned database migrations
- [ ] Configure Spring Data JPA and Hibernate entities
- [ ] Write `@Transactional` business logic for multi-currency transfers
- [ ] Double-entry validation: enforce `SUM(debits) = SUM(credits)` for every transaction
- [ ] Implement pessimistic locking (`SELECT ... FOR UPDATE`) on wallet rows for concurrent transfers

**Roadmap.sh topics covered:** Spring terminology & architecture, DI/IOC/beans, Spring Boot essentials, autoconfiguration, Hibernate & entity lifecycle, Spring Data JPA.

**Milestone:** a transfer endpoint that atomically creates balanced debit/credit ledger entries.

### Phase 2 - Secure APIs & Business Logic

**Goal:** expose secure, stateless endpoints for frontend consumption.

**Checklist:**

- [ ] JWT-based authentication: login, register, password hashing (BCrypt)
- [ ] Role-based access control (RBAC): `ROLE_CUSTOMER`, `ROLE_BUSINESS`, `ROLE_ADMIN`
- [ ] DTO-driven REST endpoints:
- [ ] `POST /api/v1/wallets/transfer`
- [ ] `POST /api/v1/exchange`
- [ ] `GET /api/v1/portfolio/summary`
- [ ] Idempotency with Redis keys so network retries never double-charge a user
- [ ] Request validation, exception handling, and clean API error responses

**Transfer flow (with locking + idempotency):**

```mermaid
sequenceDiagram
    participant C as Angular Client
    participant S as Spring Boot Service
    participant R as Redis
    participant DB as PostgreSQL

    C->>S: POST /api/v1/wallets/transfer (Idempotency-Key)
    S->>R: Check / set idempotency key
    S->>DB: BEGIN + SELECT ... FOR UPDATE (both wallets)
    S->>S: Validate balances and exchange rate
    S->>DB: Debit wallet A, Credit wallet B, ledger entries
    S->>DB: COMMIT
    S->>C: 200 OK - balanced ledger
```

**Roadmap.sh topics covered:** Spring MVC & REST, Spring Security (authentication, authorization, JWT, OAuth2 later), testing with MockMvc / `@SpringBootTest` / `@MockBean`.

**Milestone:** protected transfer + exchange endpoints that are safe under concurrent retries.

### Phase 3 - Enterprise Angular Dashboard

**Goal:** build a responsive dashboard matching the modern wallet experience.

**Checklist:**

- [ ] Set up an Angular project with standalone components, RxJS, and Angular Material or Tailwind
- [ ] Define feature modules: `AuthModule`, `DashboardModule`, `WalletModule`, `AdminModule`
- [ ] Use RxJS Observables and `BehaviorSubject` for real-time balance changes, exchange rate streaming, and state
- [ ] Build multi-step transfer flows with Angular Reactive Forms and strict client-side validation
- [ ] Write an HTTP interceptor that attaches the JWT to every request and handles 401/403 errors seamlessly
- [ ] Route guards for authenticated/customer/admin areas

**Roadmap.sh topics covered:** Angular architecture, components & modules, templates & binding, directives & pipes, services & dependency injection, HTTP Client & RxJS, routing & forms, signals & state management.

**Milestone:** a wallet dashboard with live balances, portfolio summary, and a validated multi-step transfer form.

### Phase 4 - Advanced Fintech Capabilities

**Goal:** elevate the app to enterprise standards.

**Checklist:**

- [ ] Asynchronous processing with Kafka / RabbitMQ (payment emails, PDF statements, M-Pesa notifications)
- [ ] Spring Actuator for health, metrics, and monitoring
- [ ] Admin audit log table recording every administrative action
- [ ] Mock third-party webhooks: M-Pesa STK Push and crypto network confirmations
- [ ] Containerize backend + frontend with Docker
- [ ] CI/CD pipeline and deployment

**Roadmap.sh topics covered:** microservices & Spring Cloud (optional), testing, security hardening, accessibility, performance, internationalization.

**Milestone:** statement generation runs asynchronously, M-Pesa mock webhooks are handled, and the platform deploys.

---

## Full-Stack Milestones

- [ ] **M1 - Skeleton:** both apps scaffolded; frontend calls the backend `/api/v1/health` endpoint.
- [ ] **M2 - Ledger engine:** schema + Flyway migrations, `Account`/`Wallet` entities, transfer API with double-entry validation and pessimistic locking.
- [ ] **M3 - Security:** JWT login, RBAC roles, idempotent transfer endpoints with Redis.
- [ ] **M4 - Dashboard:** Angular wallet dashboard, portfolio summary, multi-step transfer flow with charts.
- [ ] **M5 - Enterprise:** async broker jobs, audit log, mock M-Pesa/crypto webhooks, tests, Docker, CI/CD, live deployment.

## 12-Week Plan

```mermaid
timeline
    title 12-Week Fintech Build Plan
    Week 1 : Java + Git + TypeScript foundations : Repo scaffold and README
    Week 2 : Spring Core + REST : First API (/health)
    Week 3 : PostgreSQL + Flyway : Schema migrations
    Week 4 : Ledger engine : Transfer + double-entry + locking
    Week 5 : Security + JWT + RBAC : Auth endpoints
    Week 6 : Idempotency + Redis : Safe retries
    Week 7 : Angular setup + components : UI shell + dashboard
    Week 8 : Services + HTTP interceptor : Wallet list UI
    Week 9 : Forms + routing : Multi-step transfer flow
    Week 10 : RxJS + state : Live balances + exchange rates
    Week 11 : Async + audit + webhooks : Kafka, M-Pesa mock
    Week 12 : Testing + deploy : Live demo + docs
```

| Week | Focus | Deliverable |
| --- | --- | --- |
| 1 | Java + Git + TypeScript foundations | Repo scaffold, README, first commits |
| 2 | Spring Core + first REST API | `/api/v1/health` endpoint |
| 3 | PostgreSQL schema + Flyway | Versioned migrations |
| 4 | Ledger engine | Transfer + double-entry + locking |
| 5 | Security + JWT + RBAC | Auth endpoints + protected routes |
| 6 | Idempotency + Redis | Retry-safe transfer endpoint |
| 7 | Angular setup + components | UI shell + dashboard page |
| 8 | Services + HTTP + interceptor | Wallet list from the API |
| 9 | Forms + routing | Multi-step transfer flow UI |
| 10 | RxJS + state | Live balances + exchange rates |
| 11 | Async + audit + webhooks | Broker jobs, M-Pesa mock |
| 12 | Testing + deploy | Backend/frontend tests, live demo |

## Progress Tracking

- Tick the checkboxes in this README as you complete topics.
- Track the same progress visually on your [roadmap.sh dashboard](https://roadmap.sh/dashboard).
- Reference roadmaps: [Spring Boot](https://roadmap.sh/spring-boot), [Angular](https://roadmap.sh/angular), [Java](https://roadmap.sh/java), [Backend](https://roadmap.sh/backend), [Frontend](https://roadmap.sh/frontend)

## Publishing to GitHub

This repository targets [https://github.com/SmartJk123/Fintech-Stack](https://github.com/SmartJk123/Fintech-Stack).

```bash
# one-time GitHub CLI auth (opens browser)
gh auth login --hostname github.com --git-protocol https --web

# add the remote and push
git remote add origin https://github.com/SmartJk123/Fintech-Stack.git
git push -u origin main

# later changes
git add .
git commit -m "feat: describe your change"
git push
```

## License

MIT License

By Joy kamau