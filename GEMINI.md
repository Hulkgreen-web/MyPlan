# Project Context: MyPlan

## Overview
MyPlan is a modern fullstack monorepo designed for personal finance and budgeting management. It is managed with **pnpm workspaces** and **Turborepo**, backed by **PostgreSQL** and **Redis**.

---

## Repository Structure

```
MyPlan/
├── apps/
│   ├── api/                    # Fastify Backend
│   │   ├── src/
│   │   │   ├── entities/       # MikroORM PostgreSQL entities
│   │   │   ├── routes/         # Modular route plugins (Fastify + Zod)
│   │   │   │   ├── auth/       # Authentication routes (/auth/*)
│   │   │   │   ├── transactions/ # Transaction routes (/transactions/*)
│   │   │   │   └── users/      # User routes (/users/*)
│   │   │   ├── app.ts          # Fastify app builder & plugin registration
│   │   │   ├── index.ts        # Server entry point (starts on port 3001)
│   │   │   └── mikro-orm.config.ts # MikroORM database configuration
│   │   └── test/               # Vitest integration tests & mocks
│   │
│   └── web/                    # React Frontend (Vite + TailwindCSS + Clean Architecture)
│       └── src/
│           ├── CompositionRoot.tsx # Dependency injection wiring & providers
│           ├── domain/         # Business domain layer (pure TS, zero UI dependencies)
│           │   ├── auth/       # Value objects, User entity, AuthRepository port, UseCases
│           │   └── transactions/# Value objects, Transaction entity, TransactionRepository port, UseCases
│           ├── data/           # Data access layer
│           │   ├── auth/       # AuthApi, AuthMapper, AuthRepository implementation
│           │   └── transactions/# TransactionApi, TransactionMapper, TransactionRepository implementation
│           ├── presentation/   # Presentation UI & ViewModel layer
│           │   ├── components/ # Pure declarative UI components (auth, transactions, layout, logo)
│           │   ├── hooks/      # ViewModels / Container logic (useProfile, useTransactions, etc.)
│           │   ├── pages/      # Routed views (Home, auth/*, transactions/*, Savings)
│           │   └── i18n/       # Localization configuration & dictionary files
│           ├── AuthContext.tsx # Context wrapping Use Cases for React lifecycle
│           └── api.ts          # Base HTTP client with transparent token refresh
│
├── packages/
│   └── shared/                 # Shared domain logic
│       └── src/
│           ├── auth.ts         # User & Auth Zod schemas and inferred types
│           ├── transactions.ts # Transaction Zod schemas and inferred types
│           ├── users.ts        # User response schemas
│           └── utils/          # Shared enums and helpers
│
├── docker-compose.yml          # Local infra (PostgreSQL on 5432, Redis on 6379)
├── pnpm-workspace.yaml         # Dependency catalog and workspace definition
└── turbo.json                  # Turborepo task pipeline
```

---

## Tech Stack & Dependencies

- **Package Manager:** `pnpm` (uses catalog in `pnpm-workspace.yaml`).
- **Orchestration:** `Turborepo`.
- **Backend:**
  - Fastify v4 (`fastify`)
  - Type-safe routing & validation: `fastify-type-provider-zod` + `zod`
  - ORM: MikroORM v7 (`@mikro-orm/postgresql`, `@mikro-orm/decorators`)
  - Auth: `@fastify/jwt`, `@fastify/cookie`, `bcrypt`
  - Logger: `@fastify/one-line-logger`
  - Test runner: `vitest`
  - Runtime: `tsx` (dev), `tsc` (build)
- **Frontend:**
  - React 18, React Router 7
  - Vite 8
  - Tailwind CSS 3 + DaisyUI 4
  - i18next localization
- **Database & Cache:**
  - PostgreSQL 16
  - Redis 7

---

## Key Architectural Conventions

### 1. Modern Fastify Routing with Zod Type Provider
- Each route lives in its own dedicated file (`*.route.ts`) and is registered in the module's `index.ts`.
- Routes use `FastifyPluginAsyncZod<{ em: SqlEntityManager }>` for strong typing of input, output, and parameters.
- **Mandatory schemas on all endpoints:**
  - `schema.body`: Validates and automatically types incoming JSON payloads. Never call `Schema.parse(request.body)` manually inside handlers.
  - `schema.params` / `schema.querystring`: Validates path and URL parameters.
  - `schema.response`: Validates output, optimizes serialization via Fastify's compiler, and strips sensitive fields (e.g. passwords, relations) before returning to the client.
- **Parent-child plugin registration:**
  When registering child route plugins from a domain `index.ts` that was mounted with a `prefix` (e.g. `prefix: '/auth'`), pass `{ em }` to child plugins rather than the entire `opts` object. Passing `opts` directly duplicates the prefix (e.g. creating `/auth/auth/...`).

### 2. MikroORM Decorators with ESM (`tsx`)
- The project runs in ESM mode (`"type": "module"`).
- `tsx` uses `esbuild` under the hood, which does not support `emitDecoratorMetadata`.
- **Rule:** Every MikroORM decorator MUST explicitly declare its column type:
  ```ts
  // Correct:
  @Property({ type: 'string' })
  name!: string;

  // Incorrect (fails at runtime):
  @Property()
  name!: string;
  ```

### 3. Authentication & Sessions
- **Access Token:** Short-lived JWT (15 minutes), returned in response payload, provided in `Authorization: Bearer <token>` header.
- **Refresh Token:** Long-lived JWT (7 days), persisted in database (`RefreshToken` entity), stored in an `HttpOnly`, `SameSite=lax` cookie.
- Révocation is supported via deletion of the `RefreshToken` record in the database upon logout.

### 4. Shared Contract (`packages/shared`)
- All API contracts, Zod schemas, input types, and response types are centralized in `packages/shared`.
- Both `apps/api` and `apps/web` import directly from `shared`.
- Never duplicate schemas or types between front and back.

### 5. Mandatory Frontend Clean Architecture Rules (STRICT — ALWAYS FOLLOW NO MATTER WHAT)
Every feature, module, or screen on the frontend MUST follow Clean Architecture principles without exception:

#### A. Layer Responsibilities & Naming Conventions
1. **Domain Layer (`apps/web/src/domain/<concept>/`)**:
   - Zero dependencies on React, UI libraries, HTTP clients, or frameworks. Pure TypeScript only.
   - **Value Objects (`value-objects/*-*.vo.ts`)**: Self-validating, immutable objects representing single attributes (e.g. `TransactionAmount`, `TransactionName`, `UserEmail`, `UserPassword`). Must throw domain errors upon invalid input and expose a `.value` getter.
   - **Models / Entities (`models/*.model.ts`)**: Aggregate domain state and business invariants. Expose primitive and VO getters. Use `static create(...)` factory methods.
   - **Repository Ports (`repositories/*.repository.ts`)**: Domain interfaces declaring required persistence/data operations.
   - **Use Cases (`usecases/*-*.usecase.ts`)**: Single-responsibility application operations exposing an `execute(...)` method. Strictly depend on repository interfaces.

2. **Data Layer (`apps/web/src/data/<concept>/`)**:
   - Implements domain repository interfaces and communicates with external APIs.
   - **API Client (`api/*Api.ts`, `api/*ApiInterface.ts`)**: Handles HTTP requests using `@/api.ts` (`apiFetch`). Returns shared DTOs from `packages/shared`.
   - **Mappers (`mappers/*Mapper.ts`)**: Pure conversion functions translating shared DTOs into Domain Entities/Models and vice-versa.
   - **Repositories (`repositories/*Repository.ts`)**: Concrete classes implementing domain repository ports by calling API datasources and transforming data with mappers.

3. **Dependency Injection (`apps/web/src/CompositionRoot.tsx`)**:
   - The single place where all datasources, mappers, repositories, and use cases are instantiated.
   - NEVER instantiate repositories or use cases directly inside React components or hooks.
   - Exposes typed context hooks (`useTransactionUseCases()`, `useAuthUseCases()`) consumed exclusively by presentation hooks.

4. **Presentation Layer (`apps/web/src/presentation/`)**:
   - **Feature-based Subdirectories**: Presentation MUST mirror domain concepts with subfolders:
     - `components/<concept>/components/` (e.g. `components/transactions/components/`, `components/auth/components/`)
     - `hooks/<concept>/` (e.g. `hooks/transactions/`, `hooks/auth/`)
     - `pages/<concept>/` (e.g. `pages/transactions/`, `pages/auth/`)
   - **Hook-as-ViewModel (Container-Presentational)**: TSX files MUST be purely declarative view templates. NEVER write inline fetch calls, complex state reducers, or business rules in TSX components. All logic, validation handling, and use-case execution MUST live in dedicated custom hooks (`useTransactionListPage`, `useProfile`, etc.).
   - **DaisyUI & Tailwind**: All UI components must prioritize semantic DaisyUI components (cards, badges, modals, heroes, tabs).

#### B. Path Aliases (Mandatory)
Always use configured path aliases instead of multi-level relative paths (`../../../`):
- `@/*` -> `apps/web/src/*` (e.g. `@/AuthContext.tsx`, `@/CompositionRoot.tsx`, `@/api.ts`)
- `@domain/*` -> `apps/web/src/domain/*`
- `@data/*` -> `apps/web/src/data/*`
- `@presentation/*` -> `apps/web/src/presentation/*`
- `shared` -> `packages/shared/src/index.ts`

---

## Essential Commands

### Development
```bash
# Start background databases (PostgreSQL & Redis)
docker-compose up -d db redis

# Run dev server across all workspaces (API on 3001, Web on 3000)
pnpm dev

# Run API only in watch mode
pnpm --filter api dev

# Run Web only
pnpm --filter web dev
```

### Build & Typecheck
```bash
# Typecheck and build all packages
pnpm build

# Build API only
pnpm --filter api build

# Build Web only
pnpm --filter web build
```

### Testing
```bash
# Run Vitest test suite on backend
pnpm --filter api test
```

### Database Operations (MikroORM)
```bash
pnpm --filter api schema:update # Update DB schema to match entities
pnpm --filter api seed          # Run seeders
pnpm --filter api schema:fresh  # Fresh migration and seed
```
