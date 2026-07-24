# 01 — Project Overview

> **Official documentation of the SAITM Enterprise Placement Management System (EPMS).**
> Everything in this documentation set reflects the **actual implementation** in the repository as of this writing. Features that are designed but not built are explicitly marked **`Not Yet Implemented`**.

## What this project is

The SAITM EPMS is a web platform that digitizes campus placements for **St. Andrews Institute of Technology & Management**. It serves three roles — **Student**, **Recruiter**, and **Admin (Placement Cell / TPO)** — from a single Next.js codebase with a Firebase backend.

## Implementation status at a glance

| Area | Status |
|------|--------|
| Student authentication (email OTP) | ✅ Implemented |
| Student onboarding wizard (4 steps) | ✅ Implemented |
| Student dashboard + 13 student pages | ✅ Implemented |
| Placement drives (browse, detail, apply) | ✅ Implemented |
| Eligibility engine + one-click apply | ✅ Implemented |
| Applications + status timeline | ✅ Implemented |
| Notifications (in-app) | ✅ Implemented |
| Recruiter auth (register → verify → approval) | ✅ Implemented |
| Admin secure login + role validation | ✅ Implemented |
| RBAC guards + edge middleware | ✅ Implemented |
| Cloud Functions (5) + Firestore/Storage rules | ✅ Implemented |
| **Recruiter hiring workspace** (post jobs, applicants, shortlist, interviews, offers) | 🟥 Not Yet Implemented (auth landing stub only) |
| **Admin console UI** (verification, approvals, analytics, reports, etc.) | 🟥 Not Yet Implemented (secure login + stub only; backend callables exist) |
| **FCM push notifications** | 🟥 Not Yet Implemented |
| **AI features** (resume scoring, mock interview, career assistant, recommendations) | 🟥 Not Yet Implemented |

> Many features named in product briefs (Resume Builder, Resume Analyzer, Placement Readiness, Career Roadmap, Company Recommendations, Saved Companies, Placement Calendar, Achievements, Learning Center, Community, Portfolio, Public Profile, dedicated Offer Letters module, Support ticketing) are **Not Yet Implemented**. See the module docs for what each existing page actually does.

## Tech stack (actual)

| Layer | Technology (installed version family) |
|-------|----------------------------------------|
| Framework | Next.js **15.5.x** (App Router) |
| Language | TypeScript **5.7** (strict) |
| Styling | Tailwind CSS **3.4** (literal-hex SAITM tokens) |
| UI primitives | Hand-authored shadcn-style components on Radix UI |
| Animation | Framer Motion **11** |
| Forms / Validation | React Hook Form **7** + Zod **3** |
| Server state | TanStack Query **5** |
| Icons | lucide-react |
| Toasts | sonner |
| Auth / DB / Storage / Serverless | Firebase **11** (Auth, Firestore, Storage, Cloud Functions v2) |
| Media storage | Cloudinary (unsigned upload) |
| Backend runtime | firebase-functions v2 + firebase-admin (Node 20) |

## Repository shape

```
placement_portal/
├── Frontend/     # Next.js 15 application (all UI + client logic)
├── Backend/      # Firebase: functions/, firestore.rules, storage.rules, indexes
├── docs/         # This documentation set + the design SDD (docs/architecture/)
├── scripts/  logs/
├── CLAUDE.md         # Binding, locked constraints (stack, palette, storage split)
├── ARCHITECTURE.md   # Physical folder blueprint
└── README.md
```

## Core principles the code follows

1. **Feature-first with a shared foundation** — business logic lives in `Frontend/features/*` modules; `app/` is routing only.
2. **Firestore Security Rules are the authorization boundary.** Client guards and middleware are UX; the server enforces access.
3. **Role via Firebase custom claims** — one identity, one of `student | recruiter | admin`.
4. **Locked design system** — SAITM Navy `#18305F` / Gold `#D8AE3E` + defined neutrals; no off-palette color.
5. **Storage split** — images → Cloudinary; documents → Firebase Storage.

## How to read this documentation

| Start here | If you are… |
|------------|-------------|
| [02_PROJECT_SETUP](./02_PROJECT_SETUP.md) | setting the project up locally |
| [04_SYSTEM_ARCHITECTURE](./04_SYSTEM_ARCHITECTURE.md) | understanding how it fits together |
| [07_AUTHENTICATION_SYSTEM](./07_AUTHENTICATION_SYSTEM.md) | working on sign-in / roles |
| [08_STUDENT_MODULE](./08_STUDENT_MODULE.md) | building student features |
| [16_FIRESTORE_COLLECTIONS](./16_FIRESTORE_COLLECTIONS.md) | working with data |
| [19_DEVELOPER_GUIDE](./19_DEVELOPER_GUIDE.md) | contributing code |

**Companion design docs:** the pre-implementation Software Design Document lives in [`docs/architecture/`](./architecture/) (12 numbered files). A production-readiness audit is in [`docs/audit-report.md`](./audit-report.md).

## Current health (from the audit)

Build ✅ · Lint ✅ (0 warnings) · Type-check ✅ · Runtime ✅. The only blocker to a *live* run is Firebase configuration (empty `.env.local` placeholders). See [18_DEPLOYMENT_GUIDE](./18_DEPLOYMENT_GUIDE.md).
