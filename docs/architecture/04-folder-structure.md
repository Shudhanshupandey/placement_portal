# 04 — Folder Structure

This document is the **module map** for the EPMS. The physical, per-folder rationale (why each top-level folder exists, naming, mistakes to avoid) lives in [`ARCHITECTURE.md`](../../ARCHITECTURE.md); here we extend it to the **three-role** system.

## Principle

**Feature-first with a shared foundation.** Business logic lives in isolated `features/*` modules (each with its own `components/ hooks/ services/ schemas/ types/` and a public `index.ts` barrel). `app/` is routing only. Cross-cutting building blocks live in the flat top-level folders. Code lives inside a feature until a second feature needs it, then it is promoted.

## Monorepo top level

```
placement_portal/
├── Frontend/     # Next.js 15 app (this document)
├── Backend/      # Firebase: functions/, firestore.rules, storage.rules, indexes
├── docs/         # SRS, architecture (this SDD), guides
├── scripts/      # repo automation
└── logs/
```

## `Frontend/app/` — routing (App Router)

Route groups isolate each audience with its own layout and guard:

```
app/
├── (marketing)/            # public landing
├── (auth)/                 # login, verify, recruiter register, forgot
├── (student)/              # ✅ Student portal (role-guarded layout)
│   ├── dashboard, profile, placement-drives, companies,
│   ├── applications, interviews, resume, documents, skills,
│   ├── notifications, announcements, settings, help
├── onboarding/             # ✅ profile completion wizard (own layout)
├── (recruiter)/            # 🟡 Recruiter portal
│   ├── dashboard, company, jobs/[new|edit], candidates,
│   ├── shortlist, interviews, offers, notifications, settings
├── (admin)/                # 🟡 Admin/TPO console
│   ├── dashboard, students, recruiters, companies,
│   ├── placement-drives, applications, interviews, offers,
│   ├── reports, analytics, announcements, support,
│   ├── activity-logs, settings, user-management
├── unauthorized/           # 403
├── api/                    # route handlers (cloudinary sign, webhooks)
├── layout.tsx, error.tsx, global-error.tsx, not-found.tsx
```

## `Frontend/features/` — business logic (per domain)

Each feature has the uniform shape `components/ hooks/ services/ schemas/ types/ + index.ts`.

| Feature | Status | Consumed by |
|---|---|---|
| `auth` | ✅ | (auth) |
| `onboarding` | ✅ | onboarding |
| `profile` | ✅ | student, recruiter (view), admin |
| `placement-drives` | ✅ | student, recruiter, admin |
| `applications` | ✅ | student, recruiter, admin |
| `notifications` | ✅ | all roles |
| `dashboard` | ✅ | student home (composition) |
| `companies` | 🟡 | recruiter, admin, student |
| `interviews` | 🟡 | all roles |
| `offers` | 🟡 | student, recruiter, admin |
| `candidates` (search/shortlist) | 🟡 | recruiter, admin |
| `recruiter-onboarding` | 🟡 | (auth), admin approval |
| `announcements` | 🟡 | admin (author), all (read) |
| `analytics` | 🟡 | admin, recruiter |
| `reports` | 🟡 | admin |
| `support` | 🟡 | all |
| `activity-logs` | 🟡 | admin |
| `settings` | 🟡 | all |
| `media` | 🟡 | shared upload widgets |

> **Cross-feature composition** (e.g., dashboard importing `placement-drives` + `applications`) is done through **barrels only** — never internal paths. Features never import each other's internals.

## Shared foundation (flat top-level)

```
Frontend/
├── components/     # shared UI: ui/ (shadcn) layout/ forms/ tables/
│                   #   charts/ cards/ dialogs/ modals/ dashboard/ shared/
├── lib/            # configured SDKs & wrappers: firebase/ cloudinary/
│                   #   auth/ api/ storage/ permissions/ theme/ utils.ts
├── hooks/          # shared hooks: auth/ firestore/ media/ + primitives
├── services/       # framework-agnostic data-access (where shared)
├── contexts/       # context definitions (auth, theme, notification)
├── providers/      # provider components (query, auth, app-providers)
├── store/          # Zustand: client-only UI state
├── config/         # env.ts, firebase.config, site.config
├── types/          # global + domain model types
├── schemas/        # cross-cutting Zod schemas
├── constants/      # routes, roles, nav, query-keys, messages
├── utils/          # pure helpers
├── actions/        # global server actions
├── emails/         # React Email templates
├── styles/         # globals.css, theme.css, animations.css
├── assets/         # imported source assets
├── data/           # static seed/lookup data
├── public/         # served verbatim (images, icons, fonts, videos)
├── tests/          # e2e, integration, unit, mocks
├── middleware.ts   # 🟡 edge role redirects
└── (config files)
```

## Role-module strategy

Each role's `app/(role)/layout.tsx` supplies:
- a role-specific **navigation config** (`constants/*-nav.ts`),
- a **role guard** (`RequireAuth` + claim/status check),
- the shared **shell** components (`components/layout/app-sidebar`, `app-topbar`, `right-panel`) parameterized by role.

The shell is written once and reused by all three portals; only the nav config and guards differ. This keeps three products in one codebase without duplication.

## `Backend/`

```
Backend/
├── functions/src/
│   ├── callable/    # sendOtp, verifyOtp, approveRecruiter, setRole…
│   ├── triggers/    # onApplicationWrite, onDrivePublish (fan-out notifications)
│   ├── scheduled/   # analytics aggregation, OTP cleanup
│   ├── webhooks/    # external integrations
│   ├── lib/         # admin init, otp, email
│   └── index.ts
├── firestore.rules, storage.rules, firestore.indexes.json, firebase.json
```

## Naming conventions (project-wide)

kebab-case filenames (Windows↔CI safe); PascalCase component exports; `use*` hooks; `*.service.ts`; `*.schema.ts`; `*.types.ts`; route segments kebab-case; dynamic segments `[camelCase]`; route groups `(kebab)`.
