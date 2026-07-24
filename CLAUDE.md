# CLAUDE.md — Binding Development Constraints

**Read this before writing ANY code in this repo.** These constraints are approved and **locked**. Do not deviate. If a requirement is unclear, propose the best architecture first, then implement — think like a Senior Software Architect before coding.

This is the **SAITM Placement Portal** — a production-grade Training & Placement portal for St. Andrews Institute of Technology & Management. It is **not a demo**. Every deliverable must be production-ready, scalable, responsive, secure, accessible, and maintainable.

Companion docs: [README.md](./README.md) (overview) · [ARCHITECTURE.md](./ARCHITECTURE.md) (folder blueprint).

---

## 🔒 NEVER change these

1. **Tech stack** (below) — never swap, add alternatives to, or remove any of it.
2. **Color palette** (below) — never introduce a color outside these tokens.
3. **SAITM branding** — do not redesign the brand. Match the existing SAITM website's typography, colors, spacing, and UI language. Improve UX only.
4. **Storage split** — images → Cloudinary; documents → Firebase Storage. Never mix.

---

## Tech Stack (locked)

**Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · React Hook Form · Zod · TanStack Query · Lucide React.

**Backend:** Firebase Authentication · Cloud Firestore · Firebase Cloud Functions · Firebase Cloud Messaging (FCM).

**Storage:** Cloudinary (media) · Firebase Storage (documents).

**Deploy:** Vercel (frontend) · Firebase (backend).

## Storage rules (strict)

| Cloudinary — media ONLY | Firebase Storage — documents ONLY |
|-------------------------|-----------------------------------|
| Company logos, student photos, gallery images, campus images, banners | Resume PDFs, certificates, offer letters, documents |

## Color palette (locked — use as design tokens, never hard-code random hex)

```
Primary   SAITM Navy   #18305F   navbar, sidebar, dashboard, footer, headings, icons, primary buttons
Secondary SAITM Gold   #D8AE3E   CTA buttons, statistics, active items, highlights, progress, badges
Background              #F8F7F4
Card                    #FFFFFF
Section BG              #F5F6F8
Heading                 #172554
Primary Text            #374151
Secondary Text          #6B7280
Border                  #E5E7EB
Success                 #22C55E
Warning                 #F59E0B
Error                   #EF4444
Info                    #3B82F6
Primary Gradient        #18305F → #23488A
Gold Gradient           #D8AE3E → #E7C15C
```

Expose these as CSS variables + Tailwind theme tokens (e.g. `bg-primary`, `text-heading`, `border-border`). Reference tokens in components — never paste raw hex in JSX.

**Design principles:** premium spacing · modern cards · rounded corners · soft shadows · elegant hover · subtle Framer Motion animations · accessible (WCAG AA) · fully responsive (mobile · tablet · laptop · desktop · large screens). No outdated UI, no random decoration. Keep it elegant and premium.

---

## Modules

- **Student:** Dashboard, Profile, Resume Builder, Resume Upload, Skills, Education, Projects, Job Applications, Placement Drives, Interview Schedule, Notifications, Offer Letters, Company Tracking.
- **Recruiter:** Dashboard, Company Profile, Job Posting, Candidate Search, Shortlisting, Interview Scheduling, Selection Status.
- **Admin/TPO:** Dashboard, Students, Recruiters, Companies, Placement Drives, Applications, Reports, Analytics, Notifications, User Management, Settings.

---

## Architecture & Coding Rules

- **Feature-first + shared foundation.** Business logic lives in `Frontend/features/<feature>/` (each with `components/ hooks/ services/ schemas/ types/` + a public `index.ts` barrel). `app/` is **routing only** — pages compose features, no business logic in `page.tsx`.
- **Import features through their barrel only** (`@/features/jobs`). Never import a feature's internals from outside it. Features never import each other's internals — promote shared code to `components/`, `lib/`, or `services/`.
- **TypeScript everywhere.** Derive types from Zod schemas with `z.infer` so validation and types never drift.
- **Server Components by default.** Add `"use client"` only when interactivity, hooks, or browser APIs require it. Lazy-load heavy client components.
- **Data layer:** `services/*` = pure Firestore/Functions/Storage access (no React). Hooks (TanStack Query) call services. Components call hooks. Never components → services directly.
- **`lib/` = configured SDK singletons/wrappers; `utils/` = pure functions.** `store/` (Zustand) = client UI state only; server data belongs to TanStack Query.
- **Scalable Firestore:** indexed + paginated queries, no client-side over-fetching. Firestore **security rules** are the authorization boundary; middleware/client guards are UX/defense-in-depth only.
- **Performance:** optimize every image (`next/image` + Cloudinary transforms for media), maintain excellent Lighthouse scores.
- **Naming:** kebab-case filenames (Windows↔CI casing safety), PascalCase component exports, `use*` hooks, `*.service.ts`, `*.schema.ts`, `*.types.ts`.
- Clean, reusable, DRY, modular code following **SOLID**.

---

## Working agreement

Whenever building anything in this repo, conform to **every** rule above. If a feature is ambiguous, propose the architecture, get alignment, then implement. Update [ARCHITECTURE.md](./ARCHITECTURE.md) when the structure evolves, and keep this file authoritative.
