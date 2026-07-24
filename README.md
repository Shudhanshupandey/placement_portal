<div align="center">

# SAITM Placement Portal

**St. Andrews Institute of Technology & Management**
Official Training & Placement Portal — Students · Recruiters · Admin/TPO

</div>

---

> ⚠️ **Before writing any code in this repo, read [CLAUDE.md](./CLAUDE.md).**
> It contains the **locked** constraints — tech stack, color palette, SAITM branding, and storage rules — that must never be changed. This README is the overview; `CLAUDE.md` is the law; [ARCHITECTURE.md](./ARCHITECTURE.md) is the folder blueprint.

---

## 1. Overview

A premium, production-grade placement portal that feels like an **official SAITM product**. It serves three audiences from one codebase:

- **Students** — build/upload resumes, apply to jobs, track applications, drives, interviews, and offer letters.
- **Recruiters** — manage a company profile, post jobs, search/shortlist candidates, schedule interviews, update selection status.
- **Admin / TPO** — manage students, recruiters, companies, drives, applications; view reports & analytics; handle user management and settings.

This is **not** a demo. Every screen must be responsive, accessible, secure, and performant, and must stay visually consistent with the existing SAITM website. **We improve UX; we do not redesign the brand.**

## 2. Tech Stack (locked — do not change)

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (everywhere) |
| Styling | **Tailwind CSS** |
| UI Kit | **shadcn/ui** |
| Animation | **Framer Motion** |
| Forms | **React Hook Form** |
| Validation | **Zod** |
| Data fetching / cache | **TanStack Query** |
| Icons | **Lucide React** |
| Auth | **Firebase Authentication** |
| Database | **Cloud Firestore** |
| Serverless | **Firebase Cloud Functions** |
| Push | **Firebase Cloud Messaging (FCM)** |
| Media storage | **Cloudinary** |
| Document storage | **Firebase Storage** |
| Deploy | **Vercel** (frontend) + **Firebase** (backend) |

## 3. Storage Strategy (strict split)

| Store | Use **only** for |
|-------|------------------|
| **Cloudinary** | Company logos · Student photos · Gallery images · Campus images · Banners |
| **Firebase Storage** | Resume PDFs · Certificates · Offer letters · Documents |

> Images → Cloudinary. Documents → Firebase Storage. Never mix these.

## 4. Design System (locked palette)

The portal uses the SAITM website's identity. **Never use random colors.**

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary — SAITM Navy** | `#18305F` | Navbar, sidebar, dashboard, footer, headings, icons, primary buttons |
| **Secondary — SAITM Gold** | `#D8AE3E` | CTA buttons, statistics, active items, highlights, progress, badges |
| Background | `#F8F7F4` | App background |
| Card | `#FFFFFF` | Cards / surfaces |
| Section Background | `#F5F6F8` | Section blocks |
| Heading | `#172554` | Heading text |
| Primary Text | `#374151` | Body text |
| Secondary Text | `#6B7280` | Muted text |
| Border | `#E5E7EB` | Borders / dividers |
| Success | `#22C55E` | Success states |
| Warning | `#F59E0B` | Warning states |
| Error | `#EF4444` | Error states |
| Info | `#3B82F6` | Info states |
| Primary Gradient | `#18305F → #23488A` | Hero / navy surfaces |
| Gold Gradient | `#D8AE3E → #E7C15C` | Gold accents / CTAs |

**Design principles:** premium spacing · modern cards · rounded corners · soft shadows · elegant hover states · subtle motion · accessible · fully responsive (mobile → large screens).

## 5. Modules

<details>
<summary><b>Student Portal</b></summary>

Dashboard · Profile · Resume Builder · Resume Upload · Skills · Education · Projects · Job Applications · Placement Drives · Interview Schedule · Notifications · Offer Letters · Company Tracking
</details>

<details>
<summary><b>Recruiter Portal</b></summary>

Dashboard · Company Profile · Job Posting · Candidate Search · Shortlisting · Interview Scheduling · Selection Status
</details>

<details>
<summary><b>Admin / TPO Portal</b></summary>

Dashboard · Students · Recruiters · Companies · Placement Drives · Applications · Reports · Analytics · Notifications · User Management · Settings
</details>

## 6. Architecture

**Feature-first with a shared foundation.** Business logic lives in isolated `features/*` modules (each with its own `components/ hooks/ services/ schemas/ types/` + a public `index.ts` barrel). `app/` is routing only. Shared, reused-by-many code lives in the flat top-level folders.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the complete folder tree and the rationale for every folder.

```
placement_portal/
├── Frontend/   # Next.js 15 app  (app/, features/, components/, lib/, services/, …)
├── Backend/    # Firebase        (functions/, firestore.rules, storage.rules, indexes)
├── docs/  scripts/  logs/
├── CLAUDE.md        # ← binding development constraints (read first)
├── ARCHITECTURE.md  # ← folder blueprint
└── README.md
```

## 7. Coding Standards

- Clean, modular, DRY code following **SOLID** and **feature-based** structure.
- **TypeScript everywhere.** Derive types from Zod schemas (`z.infer`) so types and validation never drift.
- **Server Components by default**; Client Components only when interactivity/browser APIs require it.
- Scalable Firestore queries (indexed, paginated, no client-side over-fetching).
- Lazy-load heavy components; optimize every image (`next/image`, Cloudinary transforms).
- Maintain excellent **Lighthouse** scores and accessibility (WCAG AA).
- Import features through their barrel only — never reach into a feature's internals.
- Firestore **security rules** are the real authorization boundary; client guards are UX.

## 8. Getting Started

> Status: **architecture scaffolded** (folders + config). App bootstrap is the next step.

```bash
# Frontend (from repo root)
cd Frontend
npm install
npm run dev            # http://localhost:3000

# Backend (Firebase)
cd Backend
firebase emulators:start
```

Environment variables live in `Frontend/.env.local` (see `.env.example`) and are validated at boot via `config/env.ts`. Never commit real secrets.

## 9. Deployment

- **Frontend →** Vercel (connect the `Frontend/` project root).
- **Backend →** Firebase (`firebase deploy` for Functions, Firestore rules/indexes, Storage rules).

---

<div align="center">
Built for SAITM · Keep it premium, keep it on-brand.
</div>
