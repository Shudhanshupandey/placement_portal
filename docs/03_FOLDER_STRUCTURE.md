# 03 — Folder Structure

This reflects the **actual** layout. The physical rationale for every folder is in the root [`ARCHITECTURE.md`](../ARCHITECTURE.md); this document maps it to what is implemented.

## Top level

```
placement_portal/
├── Frontend/     # Next.js 15 app (documented below)
├── Backend/      # Firebase project
├── docs/         # documentation (this set) + architecture/ SDD + audit-report.md
├── scripts/  logs/
├── CLAUDE.md  ARCHITECTURE.md  README.md  .gitignore
```

## Frontend/

```
Frontend/
├── app/                         # ROUTING ONLY (App Router)
│   ├── (auth)/                  # public auth group (AuthShell layout)
│   │   ├── login/               # /login — student OTP  ✅
│   │   └── forgot-password/     # /forgot-password       ✅
│   ├── (student)/               # protected student group (role guard + shell)
│   │   ├── layout.tsx           # RequireAuth role=student requireComplete + shell
│   │   ├── dashboard/  profile/  placement-drives/  companies/
│   │   ├── applications/  interviews/  resume/  documents/  skills/
│   │   ├── notifications/  announcements/  settings/  help/          ✅ (13 pages)
│   ├── (marketing)/             # empty scaffold (landing NYI)
│   ├── onboarding/              # /onboarding — profile wizard  ✅
│   ├── recruiter/               # /recruiter/* (login,register,pending,landing) ✅
│   │   └── layout.tsx           # conditional guard (public login/register)
│   ├── admin/                   # /admin/* (login, landing stub) ✅
│   │   └── layout.tsx           # conditional guard (public login)
│   ├── verify-email/  unauthorized/     # system pages ✅
│   ├── api/                     # scaffold (route handlers NYI)
│   ├── layout.tsx  page.tsx     # root layout (providers) + entry redirect
│   ├── error.tsx  global-error.tsx  not-found.tsx  ✅
│
├── features/                    # BUSINESS LOGIC (feature-first)
│   ├── auth/            ✅  # student OTP + recruiter + admin auth
│   ├── onboarding/     ✅  # 4-step profile wizard
│   ├── profile/        ✅  # full-profile loader + missing-sections
│   ├── placement-drives/ ✅ # drive card, details, service, hooks
│   ├── applications/    ✅  # eligibility engine, apply flow, timeline, stats
│   ├── notifications/  ✅  # bell, list, service, hooks
│   ├── dashboard/      ✅  # student dashboard composition
│   └── analytics/ certificates/ companies/ interviews/ jobs/ media/
│       recruiters/ reports/ resume/ settings/ students/   🟥 empty barrels (NYI)
│
├── components/
│   ├── ui/             ✅  # 17 primitives (button, input, card, dialog, …)
│   ├── layout/         ✅  # app-sidebar, app-topbar, right-panel, auth-shell
│   └── shared/         ✅  # require-auth, require-role, full-screen-loader,
│                       #     empty-state, section-card
│
├── lib/
│   ├── firebase/client.ts   ✅ # single Firebase instance + emulator wiring
│   ├── auth/                ✅ # email-domain, route-hint (cookie)
│   ├── cloudinary/upload.ts ✅ # image upload (media)
│   ├── storage/upload.ts    ✅ # document upload (Firebase Storage)
│   └── utils.ts             ✅ # cn()
│
├── hooks/auth/use-auth.ts   ✅ # useAuth()
├── providers/               ✅ # query-provider, auth-provider, app-providers
├── contexts/auth-context.tsx ✅
├── config/env.ts            ✅ # centralized env
├── constants/               ✅ # roles, routes, student-nav
├── types/models/            ✅ # user.ts, student.ts
├── styles/globals.css       ✅ # Tailwind + SAITM tokens
├── middleware.ts            ✅ # edge role routing
└── store/ schemas/ utils/ actions/ emails/ templates/ assets/ data/ public/ tests/
                              🟥 scaffold folders (mostly empty / NYI)
```

## Anatomy of an implemented feature

Every implemented feature follows the same shape with a public barrel (`index.ts`):

```
features/applications/
├── components/     # apply-button, apply-dialog, application-row,
│                   #   application-stats, status-badge, status-timeline
├── hooks/          # use-applications (useMyApplications, useApplyToDrive)
├── services/       # applications.service.ts
├── lib/            # eligibility.ts, status-meta.ts
├── types.ts
└── index.ts        # PUBLIC API — import the feature only via this barrel
```

**Rule:** import a feature only through its barrel (`@/features/applications`), never internal paths. Cross-feature composition (e.g., `dashboard` importing `placement-drives`) goes barrel→barrel only. No dependency cycles exist (verified in the audit).

## Backend/

```
Backend/
├── functions/
│   ├── src/
│   │   ├── callable/     # send-otp, verify-otp, register-recruiter,
│   │   │                 #   approve-recruiter, review-student
│   │   ├── lib/          # admin.ts, otp.ts, email.ts
│   │   └── index.ts      # exports the 5 functions
│   ├── seed-admin.mjs    # provision an admin
│   ├── seed-demo.mjs     # seed drives + announcements
│   └── package.json  tsconfig.json
├── firestore.rules  storage.rules  firestore.indexes.json  firebase.json  .firebaserc
```

## Naming conventions (enforced)

kebab-case filenames (Windows↔CI safe) · PascalCase component exports · `use*` hooks · `*.service.ts` · `*.schema.ts` · `*.types.ts` · route segments kebab-case · dynamic segments `[camelCase]` · route groups `(kebab)`.
