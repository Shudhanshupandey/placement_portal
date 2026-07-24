# SAITM Placement Portal — Folder Architecture

> **Status:** Architecture blueprint (no application logic yet).
> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui · Framer Motion · React Hook Form · Zod · TanStack Query · Firebase (Auth, Firestore, Cloud Functions, Storage) · Cloudinary.
> **Model:** Feature-First architecture with a Shared Foundation layer. Monorepo split into `Frontend/` (Next.js) and `Backend/` (Firebase).

---

## 0. The one decision that shapes everything

The brief asks for **feature-based architecture** but also lists **file-type folders** (`components/`, `hooks/`, `services/`, `types/`). These are usually presented as opposites. They are not. The correct enterprise answer — the one used at Vercel, in Nx workspaces, and in every large Next.js codebase — is a **hybrid**:

| Layer | Question it answers | Location |
|-------|---------------------|----------|
| **Feature modules** | "Everything about *jobs*." | `features/jobs/` (its own components, hooks, services, schemas, types) |
| **Shared foundation** | "Things *every* feature reuses." | `components/ui`, `lib/`, `hooks/`, `config/`, `types/` |
| **App Router** | "What URL renders what." | `app/` — routing + layout composition **only** |

**The rule:** Code lives inside a feature *until a second feature needs it*, at which point it is promoted to the shared foundation. `app/` never contains business logic — a `page.tsx` imports from a feature and renders it. This keeps features isolated, keeps the shared layer small and deliberate, and keeps routing thin.

Everything below is an application of that single rule.

---

## 1. Top-level repository tree

```
placement_portal/
├── Frontend/                  # Next.js 15 application (the portal UI + BFF)
├── Backend/                   # Firebase project: Cloud Functions, security rules, indexes
├── docs/                      # Cross-cutting project documentation (ADRs, guides)
├── scripts/                   # Repo-wide automation (seeding, migrations, CI helpers)
├── logs/                      # Local runtime/debug logs (git-ignored)
├── .github/                   # CI/CD workflows, PR & issue templates
├── .gitignore
├── package.json               # Workspace root (pnpm/npm workspaces)
└── README.md
```

Only four app-level concerns live at the root: the two deployables (`Frontend`, `Backend`) and two support folders (`docs`, `scripts`). Everything else nests inside a deployable. This keeps the root readable at a glance — a reviewer knows *what ships* in three seconds.

---

## 2. `Frontend/` — the Next.js application (full tree)

```
Frontend/
├── app/                         # ── ROUTING LAYER (App Router) ──
│   │                            #    Routes, layouts, loading/error UI. No business logic.
│   ├── (marketing)/             # Route group: public, unauthenticated site
│   │   ├── page.tsx             #   / (landing)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── layout.tsx           #   Marketing shell (public navbar/footer)
│   │
│   ├── (auth)/                  # Route group: AUTHENTICATION
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── layout.tsx           #   Centered auth card shell
│   │
│   ├── (student)/               # Route group: STUDENT PORTAL (role-scoped)
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── certificates/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx          #   Browse jobs
│   │   │   └── [jobId]/page.tsx  #   Job detail
│   │   ├── applications/
│   │   │   ├── page.tsx
│   │   │   └── [applicationId]/page.tsx
│   │   ├── interviews/page.tsx
│   │   ├── placement-drives/
│   │   │   ├── page.tsx
│   │   │   └── [driveId]/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx           #   Student shell (sidebar + navbar + auth guard)
│   │
│   ├── (recruiter)/             # Route group: RECRUITER PORTAL
│   │   ├── dashboard/page.tsx
│   │   ├── company/page.tsx     #   Manage own company profile
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [jobId]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── applications/
│   │   │   ├── page.tsx
│   │   │   └── [applicationId]/page.tsx
│   │   ├── interviews/
│   │   │   ├── page.tsx
│   │   │   └── [interviewId]/page.tsx
│   │   ├── placement-drives/[driveId]/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (admin)/                 # Route group: ADMIN PORTAL
│   │   ├── dashboard/page.tsx
│   │   ├── students/{page.tsx,[studentId]/page.tsx}
│   │   ├── recruiters/{page.tsx,[recruiterId]/page.tsx}
│   │   ├── companies/{page.tsx,[companyId]/page.tsx}
│   │   ├── placement-drives/{page.tsx,new/page.tsx,[driveId]/page.tsx}
│   │   ├── jobs/{page.tsx,[jobId]/page.tsx}
│   │   ├── applications/page.tsx
│   │   ├── interviews/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                     # Route Handlers (the "BFF" edge)
│   │   ├── health/route.ts
│   │   ├── cloudinary/sign/route.ts   # Signed-upload signature generation
│   │   └── webhooks/
│   │       └── [provider]/route.ts
│   │
│   ├── layout.tsx               # ROOT layout — all providers mount here
│   ├── loading.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   └── sitemap.ts / robots.ts
│
├── features/                    # ── ★ FEATURE MODULES (business logic lives here) ──
│   ├── auth/
│   │   ├── components/          #   LoginForm, RegisterForm, RoleGuard...
│   │   ├── hooks/               #   useLogin, useRegister, useSession
│   │   ├── services/            #   auth.service.ts (Firebase Auth calls)
│   │   ├── schemas/             #   login.schema.ts, register.schema.ts (Zod)
│   │   ├── types/               #   auth.types.ts
│   │   ├── constants.ts
│   │   └── index.ts             #   ← PUBLIC API (barrel). Only this is imported outside.
│   ├── dashboard/               #   Role-aware dashboard widgets & aggregation
│   ├── profile/
│   ├── resume/                  #   Resume builder/upload/parse
│   ├── certificates/
│   ├── jobs/
│   ├── applications/
│   ├── interviews/
│   ├── placement-drives/
│   ├── companies/
│   ├── students/
│   ├── recruiters/
│   ├── notifications/
│   ├── analytics/
│   ├── reports/
│   ├── media/                   #   Cloudinary/Storage upload widgets & logic
│   └── settings/
│       └── (same 7-part internal shape as auth/)
│
├── components/                  # ── SHARED UI (used by ≥2 features) ──
│   ├── ui/                      #   shadcn/ui primitives (button, input, dialog...)
│   ├── layout/                  #   Navbar, Sidebar, Footer, PortalShell, PageHeader
│   ├── forms/                   #   FormField, FormWrapper, FileDropzone (RHF-bound)
│   ├── tables/                  #   DataTable, columns helpers, pagination
│   ├── charts/                  #   BarChart, LineChart, StatCard wrappers (Recharts)
│   ├── cards/                   #   Generic card compositions
│   ├── dialogs/                 #   Confirm, Alert dialog compositions
│   ├── modals/                  #   Full modal shells / drawer patterns
│   ├── dashboard/               #   Cross-portal dashboard widgets (KpiTile, ActivityFeed)
│   └── shared/                  #   EmptyState, Loader, ErrorState, Avatar, Logo
│
├── lib/                         # ── CONFIGURED SINGLETONS & WRAPPERS ──
│   ├── firebase/                #   client.ts, admin.ts, firestore.ts, storage.ts
│   ├── cloudinary/              #   cloudinary.ts (SDK config)
│   ├── auth/                    #   session.ts, get-current-user.ts, rbac.ts
│   ├── validation/              #   zod resolver helpers, shared refinements
│   ├── api/                     #   fetcher.ts, query-client.ts, error-mapper.ts
│   ├── storage/                 #   upload helpers, signed-url builders
│   ├── permissions/             #   can(), policy definitions, role matrix
│   ├── theme/                   #   theme tokens bridge, cn() consumers
│   ├── utils.ts                 #   cn() (clsx + tailwind-merge) — shadcn standard
│   └── logger.ts
│
├── hooks/                       # ── SHARED React hooks (cross-feature) ──
│   ├── auth/                    #   useAuth, useUser, useRole
│   ├── firestore/               #   useCollection, useDocument, useMutation
│   ├── media/                   #   useUpload, useImageUpload
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-toast.ts
│
├── services/                    # ── DATA-ACCESS LAYER (framework-agnostic) ──
│   ├── auth/auth.service.ts
│   ├── firestore/base.service.ts       # Generic CRUD over a collection
│   ├── functions/functions.service.ts  # Callable Cloud Functions client
│   ├── storage/storage.service.ts
│   ├── notifications/notifications.service.ts
│   ├── companies/companies.service.ts
│   ├── students/students.service.ts
│   ├── recruiters/recruiters.service.ts
│   ├── placement-drives/drives.service.ts
│   ├── jobs/jobs.service.ts
│   └── applications/applications.service.ts
│
├── contexts/                    # React Context definitions (state only)
│   ├── auth-context.tsx
│   ├── theme-context.tsx
│   └── notification-context.tsx
│
├── providers/                   # Provider components that wire contexts/libs
│   ├── theme-provider.tsx
│   ├── query-provider.tsx
│   ├── auth-provider.tsx
│   └── app-providers.tsx        #   Composes all providers; imported by app/layout.tsx
│
├── store/                       # Client-only global state (Zustand)
│   ├── ui.store.ts              #   sidebar open, modals, theme prefs
│   └── filters.store.ts
│
├── config/                      # Static configuration objects
│   ├── firebase.config.ts
│   ├── cloudinary.config.ts
│   ├── site.config.ts           #   name, nav, metadata, portals
│   └── env.ts                   #   Zod-validated environment access
│
├── types/                       # GLOBAL/shared TypeScript types
│   ├── global.d.ts
│   ├── firebase.types.ts
│   ├── api.types.ts
│   ├── models/                  #   User, Student, Company, Job... (domain entities)
│   └── index.ts
│
├── schemas/                     # Cross-cutting Zod schemas (shared enums, pagination)
│   ├── common.schema.ts
│   └── pagination.schema.ts
│
├── constants/                   # App-wide constant values
│   ├── routes.ts
│   ├── roles.ts
│   ├── query-keys.ts            #   TanStack Query key factory
│   └── messages.ts
│
├── utils/                       # PURE, dependency-free helper functions
│   ├── format-date.ts
│   ├── format-currency.ts
│   ├── slugify.ts
│   └── cn.ts (or re-export lib/utils)
│
├── actions/                     # Global Next.js Server Actions ("use server")
│   └── revalidate.ts            #   (feature-specific actions live in features/*/actions)
│
├── emails/                      # React Email templates (previewable, type-safe)
│   ├── components/
│   ├── application-received.tsx
│   ├── interview-scheduled.tsx
│   └── welcome.tsx
│
├── templates/                   # Document/report templates (PDF, offer letters)
│   └── offer-letter.tsx
│
├── styles/                      # Global stylesheets
│   ├── globals.css              #   Tailwind directives + CSS variables
│   ├── theme.css                #   Design tokens (light/dark)
│   └── animations.css           #   Keyframes not expressible in Tailwind
│
├── assets/                      # SOURCE assets imported into code (not served raw)
│   ├── illustrations/
│   └── brand/
│
├── data/                        # Static seed data / fixtures / lookup lists
│   ├── branches.ts
│   ├── departments.ts
│   └── seed/
│
├── public/                      # Served verbatim at the site root
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── videos/
│
├── tests/                       # Test suites + setup
│   ├── e2e/                     #   Playwright
│   ├── integration/
│   ├── unit/                    #   (or co-locate *.test.ts next to source)
│   ├── mocks/                   #   MSW handlers, fixtures
│   └── setup.ts
│
├── middleware.ts                # Edge auth/RBAC redirects (MUST be at app root)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json                # Path aliases: @/features, @/components, @/lib...
├── components.json              # shadcn/ui config
├── .env.example
└── package.json
```

---

## 3. `Backend/` — Firebase project

```
Backend/
├── functions/                   # Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── triggers/            #   Firestore/Auth/Storage event triggers
│   │   ├── callable/            #   httpsCallable functions (client-invoked)
│   │   ├── scheduled/           #   Cron (pubsub schedule) jobs
│   │   ├── webhooks/            #   HTTP endpoints (payments, external ATS)
│   │   ├── services/            #   Shared server logic (email, notifications)
│   │   ├── lib/                 #   admin SDK init, helpers
│   │   ├── types/
│   │   └── index.ts             #   Function exports
│   ├── package.json             #   Functions have their OWN dependencies
│   └── tsconfig.json
├── firestore.rules              # Firestore security rules (the real authz boundary)
├── storage.rules                # Storage security rules
├── firestore.indexes.json       # Composite index definitions
├── firebase.json                # Emulator + deploy config
└── .firebaserc                  # Project aliases (dev/staging/prod)
```

---

## 4. Folder-by-folder reference

Each entry follows the same shape: **Why it exists · What belongs here · Best practices · Naming · Mistakes to avoid.**

### `app/`
- **Why:** The App Router's routing table. URLs, nested layouts, `loading`/`error`/`not-found` boundaries, and route-group composition.
- **What belongs:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` (in `api/`), `middleware.ts` sits beside it at the app root.
- **Best practices:** Keep files thin — a `page.tsx` fetches minimal data and renders a feature component. Use **route groups** `(student)`, `(recruiter)`, `(admin)`, `(auth)` to give each portal its own layout and guard without polluting the URL. Co-locate `loading.tsx`/`error.tsx` with the segments they wrap.
- **Naming:** Route segments are **kebab-case** (`placement-drives`). Dynamic segments use `[camelCase]` (`[jobId]`). Route groups use `(kebab)`.
- **Mistakes:** Putting business logic, data-access, or large components directly in `page.tsx`. Deeply nesting folders that don't correspond to URLs. Forgetting `error.tsx`/`loading.tsx` (users see blank screens on failure).

### `app/(auth)/` — Authentication
- **Why:** Isolate the unauthenticated flows so they share one minimal shell and never load portal chrome.
- **What belongs:** `login`, `register`, `forgot-password`, `reset-password`, `verify-email` pages; a centered-card `layout.tsx`.
- **Best practice:** UI here is presentational; the actual Firebase Auth calls live in `features/auth`. `middleware.ts` bounces already-authenticated users away from these routes.

### `app/(student|recruiter|admin)/` — the three Portals
- **Why:** Each audience gets an isolated route group with its own `layout.tsx` (sidebar, nav) and its own auth/role guard. This is how one codebase cleanly serves three products.
- **What belongs:** Only routes for that role. Shared feature UI is imported from `features/`.
- **Best practice:** Guard at the layout level *and* in `middleware.ts` — defense in depth. Firestore rules are the real authorization boundary; client guards are UX, not security.
- **Mistake:** Duplicating a table/chart across all three portals instead of promoting it to `components/` or a feature.

### `app/api/`
- **Why:** Route Handlers for work that must run on the server with secrets: Cloudinary signature signing, webhook receivers, health checks.
- **Naming:** Folder + `route.ts`. **Mistake:** Rebuilding Firestore CRUD here — the client SDK + rules already do that. Reserve `api/` for secret-bearing or third-party glue.

### `features/` — ★ the core
- **Why:** The unit of isolation. Everything about one domain (jobs, applications, interviews…) lives together, so a change to "jobs" touches one folder.
- **What belongs (per feature):** `components/`, `hooks/`, `services/`, `schemas/`, `types/`, `constants.ts`, and a mandatory `index.ts` barrel that is the feature's **public API**.
- **Best practices:**
  - **Import through the barrel only:** other code does `import { JobCard } from '@/features/jobs'`, never `@/features/jobs/components/job-card`. This lets you refactor a feature's internals freely.
  - **No feature imports another feature's internals.** Cross-feature needs are promoted to `components/`, `lib/`, or `services/`.
  - Start every new domain concept inside a feature; promote to shared only on the second consumer (rule of three-ish).
- **Naming:** Feature folders kebab-case; the barrel is always `index.ts`.
- **Mistakes:** A god-feature that absorbs unrelated concerns. Reaching into another feature's files (creates hidden coupling). Skipping the barrel.

### `components/` — shared UI
- **Why:** UI used by two or more features. If only one feature uses it, it belongs in that feature.
- **Subfolders map 1:1 to the brief:** `ui/` (shadcn primitives), `layout/` (Navbar, Sidebar, Footer, shells), `forms/`, `tables/`, `charts/`, `cards/`, `dialogs/`, `modals/`, `dashboard/`, `shared/`.
- **Best practices:** Keep these **presentational and stateless** where possible — data comes via props. `ui/` is owned by shadcn's generator; don't hand-edit primitives beyond variant additions.
- **Naming:** Files **kebab-case** (`data-table.tsx`), exported components **PascalCase** (`DataTable`).
- **Mistakes:** Business logic or data-fetching inside a "dumb" component. Letting `components/` become the dumping ground for feature-specific UI.

### `lib/`
- **Why:** Configured third-party clients and thin wrappers — the app's "SDK layer." Distinct from `utils/` (which is *pure* functions with no dependencies).
- **What belongs:** `firebase/` (client + admin init), `cloudinary/`, `auth/` (session, RBAC), `api/` (fetcher, TanStack `queryClient`), `permissions/`, `storage/`, `theme/`, `utils.ts` (the shadcn `cn()`), `logger.ts`.
- **Best practices:** Instantiate SDK singletons here once (avoid re-init on hot reload with a global guard). Keep `firebase/admin.ts` server-only (`import 'server-only'`).
- **Mistakes:** Mixing pure helpers into `lib/` (put them in `utils/`). Importing `firebase/admin` into client components (leaks credentials).

### `hooks/`
- **Why:** Reusable React hooks shared across features. Feature-specific hooks live in `features/*/hooks`.
- **What belongs:** `auth/` (useAuth, useRole), `firestore/` (useCollection, useDocument — TanStack Query wrappers), `media/` (useUpload), plus primitives (`use-debounce`, `use-media-query`).
- **Naming:** File `use-*.ts` (kebab), export `useSomething` (camelCase). **Mistake:** Putting non-hook logic in here, or calling hooks conditionally.

### `services/`
- **Why:** The **data-access layer** — pure functions that talk to Firestore/Functions/Storage and return typed domain objects. Framework-agnostic (no React), so they're trivially testable and reusable by hooks *and* Server Actions.
- **What belongs:** One file per domain: `jobs.service.ts`, `applications.service.ts`, etc., plus a generic `base.service.ts` for CRUD.
- **Best practices:** Services return validated, typed data (parse Firestore docs through Zod at the boundary). Hooks call services; components call hooks — never components → services directly.
- **Naming:** `<domain>.service.ts`. **Mistake:** Putting React state or UI concerns in a service; duplicating query logic that belongs in a hook.

### `contexts/` vs `providers/`
- **Why two folders:** `contexts/` holds the `createContext` *definitions and their hooks*; `providers/` holds the *components that supply values and wire libraries*. Separating them keeps context files import-light and lets providers compose freely.
- **contexts/:** `auth-context.tsx`, `theme-context.tsx`, `notification-context.tsx`.
- **providers/:** `theme-provider`, `query-provider` (TanStack), `auth-provider`, and `app-providers.tsx` which nests them all — imported once by `app/layout.tsx`.
- **Mistake:** Deeply nested provider pyramids in `layout.tsx` (compose them in `app-providers.tsx` instead). Overusing context for server data that TanStack Query should own.

### `store/`
- **Why:** Global **client-only** state that isn't server data — sidebar open/closed, active modal, unsaved filters. Zustand is the recommended lightweight choice.
- **Best practice:** Server/remote data belongs to TanStack Query, **not** the store. The store is for ephemeral UI state only. **Mistake:** Mirroring Firestore data into Zustand (creates two sources of truth).

### `config/`
- **Why:** Static, environment-shaped configuration objects consumed across the app.
- **What belongs:** `firebase.config.ts`, `cloudinary.config.ts`, `site.config.ts` (nav, metadata), `env.ts` (a **Zod-validated** wrapper around `process.env` — fail fast on missing vars at boot).
- **Mistake:** Reading `process.env` scattered across the codebase instead of through `env.ts`. Committing secrets (only `.env.example` is committed).

### `types/`
- **Why:** Global/shared TypeScript types and domain models used by many features.
- **What belongs:** `global.d.ts`, `firebase.types.ts`, `api.types.ts`, `models/` (User, Student, Company, Job, Application…).
- **Best practice:** Prefer **inferring types from Zod schemas** (`z.infer<typeof jobSchema>`) so validation and types never drift. Feature-local types stay in `features/*/types`.
- **Naming:** `*.types.ts`; types PascalCase. **Mistake:** A single `types.ts` mega-file; duplicating a type that should be inferred from a schema.

### `schemas/`
- **Why:** Cross-cutting **Zod** schemas (pagination, shared enums, common refinements). Form/entity schemas live in their feature.
- **Best practice:** Schema is the source of truth — derive both runtime validation *and* the TS type from it. **Mistake:** Types and schemas maintained separately.

### `constants/`
- **Why:** Named magic values shared app-wide.
- **What belongs:** `routes.ts` (typed route map), `roles.ts`, `query-keys.ts` (TanStack key factory — critical for cache correctness), `messages.ts`.
- **Naming:** `SCREAMING_SNAKE_CASE` for values, kebab-case files. **Mistake:** Hard-coded strings/route paths sprinkled through components.

### `utils/`
- **Why:** **Pure, dependency-free** helper functions — formatting, string/date/number utilities. If it needs a configured SDK, it belongs in `lib/`.
- **Naming:** `verb-noun.ts` (`format-date.ts`). **Mistake:** Blurring the `lib` vs `utils` line — the test is "does it import a third-party client?" If yes → `lib/`; if no → `utils/`.

### `actions/`
- **Why:** Global Next.js **Server Actions** (`"use server"`) for mutations invoked from client components. Most actions are feature-specific and live in `features/*/actions`; only truly global ones (e.g. `revalidate`) live here.
- **Best practice:** Validate every input with Zod at the top of the action. **Mistake:** Trusting client input; putting secret logic that belongs in Cloud Functions here.

### `emails/`
- **Why:** Transactional email templates authored as **React Email** components — previewable, type-safe, versioned with the code. Rendered to HTML and sent by a Cloud Function.
- **What belongs:** `welcome.tsx`, `application-received.tsx`, `interview-scheduled.tsx`, shared `components/`.
- **Mistake:** Inlining HTML email strings in Cloud Functions (unmaintainable, untestable).

### `templates/`
- **Why:** Document/report templates that generate artifacts — PDF offer letters, placement reports. Distinct from `emails/`.
- **Mistake:** Confusing with `emails/`; emails are for delivery, templates for generated documents.

### `styles/`
- **Why:** Global CSS that Tailwind utilities can't express.
- **What belongs:** `globals.css` (Tailwind directives + CSS variables), `theme.css` (light/dark tokens), `animations.css` (keyframes).
- **Best practice:** Prefer Tailwind utilities in components; reserve these for tokens, resets, and complex keyframes. **Mistake:** Recreating a parallel CSS system that competes with Tailwind.

### `assets/` vs `public/`
- **`assets/`:** Source files **imported into code** (illustrations, brand SVGs) — they go through the bundler (optimized, hashed, tree-shaken).
- **`public/`:** Files **served verbatim** at the root URL (`favicon`, OG images, fonts, videos) — no processing.
- **Rule:** "Do I `import` it?" → `assets/`. "Do I reference it by URL?" → `public/`.
- **Mistake:** Dumping bundler-importable art into `public/` (loses optimization) or vice-versa.

### `public/`
- **What belongs:** `images/`, `icons/`, `fonts/`, `videos/`.
- **Best practice:** Use `next/image` and `next/font` for anything user-facing. **Mistake:** Storing large videos here (serve from Cloudinary/Storage instead).

### `data/`
- **Why:** Static lookup data and fixtures (branches, departments, seed data) that ship with the app.
- **Mistake:** Storing dynamic/user data here — that belongs in Firestore.

### `tests/`
- **Why:** Central home for `e2e/` (Playwright), `integration/`, `mocks/` (MSW), and `setup.ts`. Unit tests may co-locate as `*.test.ts` beside source — pick one convention and document it.
- **Best practice:** Point tests at the **Firebase Emulator Suite**, never production. **Mistake:** Mixing philosophies (some co-located, some central) without a rule.

### `middleware.ts`
- **Why:** Edge-runtime gate that runs before every matched request — role-based redirects, auth session checks, portal routing.
- **Constraint:** Must sit at the **app root** (`Frontend/middleware.ts`), not in a folder. Keep it fast and Edge-compatible (no Node-only APIs, no Admin SDK). **Mistake:** Treating it as the security boundary — Firestore rules are.

### `docs/`, `scripts/`, `logs/` (root)
- **`docs/`:** ADRs (Architecture Decision Records), onboarding, API/data-model docs. Keep this `ARCHITECTURE.md` and future decisions here.
- **`scripts/`:** Repo automation — Firestore seeding, data migrations, index deploys, codegen. Naming: `verb-noun.ts`.
- **`logs/`:** Local debug output. **Always git-ignored.**

---

## 5. Naming conventions (project-wide)

| Item | Convention | Example |
|------|-----------|---------|
| Folders (all) | kebab-case | `placement-drives/` |
| Route groups | `(kebab)` | `(recruiter)/` |
| Dynamic route segments | `[camelCase]` | `[applicationId]/` |
| **All source files** | **kebab-case** | `job-card.tsx`, `use-auth.ts` |
| React components (export) | PascalCase | `JobCard` |
| Hooks (export) | camelCase, `use` prefix | `useCurrentUser` |
| Services | `<domain>.service.ts` | `jobs.service.ts` |
| Schemas | `<name>.schema.ts` | `login.schema.ts` |
| Types | `<name>.types.ts`, types PascalCase | `Application` |
| Constants (values) | SCREAMING_SNAKE_CASE | `MAX_UPLOAD_MB` |
| Barrels | `index.ts` | — |

> **Windows/Linux footgun (you're on Windows):** Windows filesystems are case-insensitive; CI/Vercel/Linux are case-sensitive. `import './JobCard'` when the file is `jobcard.tsx` works locally and **breaks the build in CI**. Enforcing **kebab-case filenames everywhere** eliminates an entire class of "works on my machine" bugs.

---

## 6. Why this architecture is scalable

1. **Bounded blast radius.** A change to "interviews" lives in `features/interviews/`. You can add, refactor, or delete a whole domain by touching one folder. In a file-type structure that same change is smeared across `components/`, `hooks/`, `services/`, and `types/`.
2. **Public APIs via barrels.** Each feature exposes only its `index.ts`. Internals refactor freely without breaking consumers — the same encapsulation principle that makes libraries maintainable, applied internally.
3. **Enforceable boundaries.** Because features don't import each other's internals, you can add an ESLint boundary rule (or `import/no-restricted-paths`) that *fails CI* on illegal cross-feature imports. Architecture becomes automated, not aspirational.
4. **Parallel team velocity.** Two engineers on `jobs` and `applications` rarely touch the same files → fewer merge conflicts. Onboarding is faster because a new hire learns one feature, not the whole tree.
5. **Layered testability.** `services/` are pure and framework-free → unit-testable in isolation. Hooks wrap services → integration-testable. UI is presentational → component-testable. Each layer has an obvious test seam.
6. **Thin, swappable routing.** Because `app/` only composes features, migrating routes, adding a portal, or restructuring URLs never risks business logic.
7. **Extraction-ready.** Any feature is already a de-facto package. Promoting `features/analytics` into a shared `packages/analytics` in an Nx/Turborepo monorepo is a move, not a rewrite.

---

## 7. Why this beats a traditional (file-type) structure

| Concern | Traditional (`components/`, `hooks/`, `services/` only) | This (feature-first + shared) |
|--------|----------------------------------------------------------|-------------------------------|
| "Where is everything about *jobs*?" | Scattered across 5+ top-level folders | One folder: `features/jobs/` |
| Adding a feature | Edit many shared folders; high conflict risk | Add one isolated folder |
| Deleting a feature | Hunt-and-peck across the tree; dead code lingers | Delete one folder |
| Coupling | Implicit, easy to create accidentally | Explicit; enforceable by lint |
| Folder growth at scale | `components/` balloons to hundreds of files | Each feature stays small; count of features grows, not folder size |
| Onboarding | Must understand the whole app to change one thing | Learn one feature |
| Merge conflicts | Frequent in shared folders | Rare (work is localized) |

File-type architecture optimizes for "all buttons together." Product teams don't work on "all buttons" — they work on **features**. This structure matches how work actually arrives.

---

## 8. Future scalability advantages

- **Monorepo / Nx / Turborepo:** Features graduate into `packages/*` with almost no refactor — the boundaries already exist.
- **Micro-frontends:** A portal (`(admin)`) or heavy feature (`analytics`) can be split into its own deployable when it earns the complexity.
- **Codegen-friendly:** The uniform 7-part feature shape means you can scaffold a new feature (`plop`/`hygen`) in seconds — consistency compounds.
- **Backend portability:** All Firebase touchpoints funnel through `lib/firebase` and `services/`. If Firestore is ever swapped (Supabase, custom API), you change the service layer — features and UI don't move.
- **Design-system extraction:** `components/ui` + `styles/theme` can be lifted into a shared `@saitm/ui` package for other institutional apps.
- **Team scaling:** Feature ownership (CODEOWNERS per `features/*`) maps cleanly onto squads as the team grows.

---

## 9. TL;DR for reviewers

- **`app/` = routing only.** **`features/` = business logic.** **Shared foundation = reused-by-many only.**
- Every feature has the same 7 parts and one public `index.ts`.
- `lib` (configured SDKs) ≠ `utils` (pure functions). `assets` (imported) ≠ `public` (served). `contexts` (definitions) ≠ `providers` (wiring). `store` (client UI state) ≠ TanStack Query (server data).
- Firestore **rules** are the security boundary; middleware/guards are UX.
- kebab-case every filename — it saves you from Windows↔CI casing bugs.
```
