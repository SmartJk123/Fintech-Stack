# Fintech System

> A full-stack fintech application built with **Spring Boot** (REST API) and **Angular** (single-page app), driven by a structured learning roadmap based on the official [roadmap.sh](https://roadmap.sh/dashboard) tracks.

![Java](https://img.shields.io/badge/Java-17+-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![Angular](https://img.shields.io/badge/Angular-latest-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

This repository is the home for the **Fintech System** project. It is also a personal learning plan: instead of learning Spring Boot and Angular in isolation, we build a real fintech platform step by step — accounts, transactions, authentication, dashboards — and every feature maps to a topic on the roadmap.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Planned Features](#planned-features)
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

The Fintech System is a learning-by-building project with two halves:

- **Backend** — a Spring Boot REST API that handles accounts, transactions, authentication (JWT), and reporting.
- **Frontend** — an Angular application that consumes the API and provides a dashboard for managing money movements.

The goal is not just to build a demo, but to cover the same topics featured on the [Spring Boot roadmap](https://roadmap.sh/spring-boot) and the [Angular roadmap](https://roadmap.sh/angular) — from dependency injection and JPA on the backend, to components, RxJS, and state management on the frontend.

## Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Backend | Java 17+, Spring Boot, Spring MVC | REST API foundation |
| Data | Spring Data JPA, Hibernate, PostgreSQL (H2 for dev) | Persistence + ORM |
| Security | Spring Security, JWT, OAuth2 (later) | Authentication & authorization |
| Frontend | Angular, TypeScript | Modern SPA |
| Frontend state | RxJS, Signals, Angular Router | Reactive UI + navigation |
| Tooling | Maven/Gradle, npm, Git, Docker (optional) | Build, dependency & deploy |

## Planned Features

- [x] Repository scaffold and README
- [ ] User registration / login with JWT
- [ ] Account management (create, list, balance)
- [ ] Transactions and transfers between accounts
- [ ] Transaction history and search
- [ ] Dashboard with charts and summaries
- [ ] Admin role with user management
- [ ] Automated tests (backend + frontend)
- [ ] CI/CD pipeline and live deployment

## Repository Structure

```text
fintech-system/
├── backend/               # Spring Boot REST API
│   ├── src/main/java/...  # Controllers, services, repositories, entities
│   ├── src/main/resources/application.yml
│   └── pom.xml
├── frontend/              # Angular single-page app
│   ├── src/app/           # Components, services, guards, models
│   ├── angular.json
│   └── package.json
├── docs/                  # Roadmap notes and design decisions
├── .gitignore
└── README.md
```

> The `backend/` and `frontend/` folders will be added in [Milestone 1](#full-stack-milestones).

## Getting Started

### Prerequisites

- JDK 17+
- Node.js 18+ and npm
- Git
- PostgreSQL (optional — H2 works out of the box for development)

### Backend (Spring Boot)

Scaffold the API from [Spring Initializr](https://start.spring.io/) with: **Spring Web, Spring Data JPA, Spring Security, Validation, PostgreSQL Driver, H2, Spring Boot Actuator**, then run:

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

Key settings: database URL/credentials, JWT secret, and the Angular API base URL.

---

## Learning Roadmap

This roadmap follows the topic order of the official [Spring Boot roadmap](https://roadmap.sh/spring-boot) and [Angular roadmap](https://roadmap.sh/angular). Tick the boxes as you go — treat it as a living checklist.

### Phase 0 — Foundations (before starting)

These are prerequisites the roadmaps assume you know. They map to the [Java roadmap](https://roadmap.sh/java) and [Frontend roadmap](https://roadmap.sh/frontend).

- [ ] Git and GitHub basics (clone, branch, commit, push, pull request)
- [ ] Java fundamentals: OOP, collections, exceptions, streams
- [ ] Maven or Gradle build basics
- [ ] HTML, CSS, and JavaScript fundamentals
- [ ] TypeScript basics: types, interfaces, classes, generics

**Milestone:** This repository pushed to GitHub with a clean README.

### Phase 1 — Spring Core

From the *Introduction* section of the Spring Boot roadmap.

- [ ] Spring terminology and architecture
- [ ] Why use Spring
- [ ] Dependency Injection (DI)
- [ ] Spring IOC container
- [ ] Annotations
- [ ] Spring Bean Scope
- [ ] Configuration
- [ ] Spring AOP (aspect-oriented programming)

**Milestone:** A small demo that wires two beans together via DI and logs with an AOP aspect.

### Phase 2 — Spring MVC & REST APIs

- [ ] Servlet basics
- [ ] Spring MVC architecture and components
- [ ] Controllers and request mapping
- [ ] REST endpoints and JSON serialization
- [ ] Request validation and exception handling

**Milestone:** A `GET /api/v1/health` endpoint and a simple `AccountController` returning JSON.

### Phase 3 — Spring Boot Essentials

- [ ] Spring Boot Starters
- [ ] Autoconfiguration
- [ ] Embedded server (Tomcat)
- [ ] Actuators (health, metrics)
- [ ] Configuration properties and profiles

**Milestone:** Backend skeleton boots with Actuator health checks and environment profiles.

### Phase 4 — Data Access (Hibernate & Spring Data JPA)

- [ ] Hibernate and the entity lifecycle
- [ ] Spring Data repositories
- [ ] Spring Data JPA
- [ ] Entity mappings and relationships
- [ ] Transactions
- [ ] Database setup (H2 for dev, PostgreSQL for prod)

**Milestone:** `Account` entity with CRUD endpoints backed by a database.

### Phase 5 — Security

- [ ] Authentication vs. authorization
- [ ] Spring Security configuration
- [ ] JWT authentication flow
- [ ] Password hashing
- [ ] OAuth2 (advanced, optional)

**Milestone:** Register/login endpoints issuing JWTs, protected account routes.

### Phase 6 — Testing the Backend

- [ ] `@SpringBootTest` annotation
- [ ] `@MockBean` / Mockito
- [ ] MockMvc for controller tests
- [ ] Testcontainers or H2 for integration tests (optional)

**Milestone:** Tests for account CRUD and authentication endpoints.

### Phase 7 — Advanced Topics (stretch)

- [ ] Spring Cloud and microservices
- [ ] Service discovery and API gateway
- [ ] Dockerizing the backend

**Milestone (optional):** Split a transactions service out of the monolith.

---

### Phase A — TypeScript & Angular Tooling

From the *Introduction to Angular* section of the Angular roadmap.

- [ ] Angular history and why it exists
- [ ] Angular architecture (modules, components, services)
- [ ] Setting up a new project with the Angular CLI
- [ ] TypeScript basics for Angular

**Milestone:** An Angular workspace scaffolded and running with `ng serve`.

### Phase B — Components & Templates

- [ ] Components
- [ ] Modules
- [ ] Templates and template syntax
- [ ] Data binding (interpolation, property, event, two-way)
- [ ] Directives (structural + attribute)
- [ ] Pipes

**Milestone:** Fintech UI shell — header, sidebar, footer, and an empty dashboard page.

### Phase C — Services, HTTP & RxJS

- [ ] Services and remote data
- [ ] Dependency injection
- [ ] HTTP Client
- [ ] RxJS basics and the observable pattern
- [ ] Zones and change detection

**Milestone:** The dashboard loads accounts from the Spring Boot API.

### Phase D — Routing & Forms

- [ ] Angular Router
- [ ] Route guards and lazy loading
- [ ] Template-driven forms
- [ ] Reactive forms and validation

**Milestone:** Login form, protected dashboard route, and navigation between pages.

### Phase E — State Management & Signals

- [ ] Signals
- [ ] State management (NgRx or a signals-based store)
- [ ] Zones and how they relate to state updates

**Milestone:** Shared auth/account state so the header reflects the logged-in user.

### Phase F — Quality & Production

- [ ] Security (XSS/CSRF awareness, auth guards, HTTPS)
- [ ] Accessibility
- [ ] Performance (lazy loading, change detection, bundle size)
- [ ] Testing (unit tests + end-to-end)
- [ ] Internationalization (i18n) — optional
- [ ] SSR/SSG — optional
- [ ] Angular DevTools

**Milestone:** Frontend test suite green and the app served over HTTPS.

---

## Full-Stack Milestones

The checklists above are topic-by-topic. These milestones combine both stacks into shippable features:

- [ ] **M1 — Skeleton:** Both apps scaffolded; frontend calls the backend `/api/v1/health` endpoint.
- [ ] **M2 — Account CRUD:** Full-stack CRUD: Angular forms → API → JPA → PostgreSQL.
- [ ] **M3 — Authentication:** JWT login end-to-end, route guards, stored token, logout.
- [ ] **M4 — Transactions:** Transfer flow, transaction history, dashboard charts (RxJS + signals).
- [ ] **M5 — Hardening:** Backend + frontend tests, CI pipeline, Docker, live deployment, and docs.

## 12-Week Plan

| Week | Focus | Deliverable |
| --- | --- | --- |
| 1 | Java + Git + TypeScript foundations | Repo scaffold, README, first commits |
| 2 | Spring Core + first REST API | `/api/v1/health` endpoint |
| 3 | Spring Boot + JPA | `Account` CRUD API |
| 4 | Security + JWT | Auth endpoints + protected routes |
| 5 | Angular setup + components | UI shell + dashboard page |
| 6 | Services + HTTP + RxJS | Account list from the API |
| 7 | Routing + forms | Login form + guarded routes |
| 8 | Full-stack integration | End-to-end account management |
| 9 | Transactions + state | Transfer flow + shared state |
| 10 | Dashboard + charts | Transaction history and summaries |
| 11 | Testing | Backend + frontend test suites |
| 12 | Deploy + polish | Live demo + project docs |

## Progress Tracking

- Tick the checkboxes in this README as you complete topics.
- Track the same progress visually on your [roadmap.sh dashboard](https://roadmap.sh/dashboard).
- Reference roadmaps: [Spring Boot](https://roadmap.sh/spring-boot) · [Angular](https://roadmap.sh/angular) · [Java](https://roadmap.sh/java) · [Backend](https://roadmap.sh/backend) · [Frontend](https://roadmap.sh/frontend)

## Publishing to GitHub

To push this project to GitHub:

```bash
git init
git add .
git commit -m "feat: initial Fintech System README and learning roadmap"
git branch -M main
git remote add origin https://github.com/<your-username>/fintech-system.git
git push -u origin main
```

> If you use GitHub CLI, `gh repo create fintech-system --public --source=. --push` does the whole thing in one command.

## License

MIT (add a `LICENSE` file before publishing publicly).
