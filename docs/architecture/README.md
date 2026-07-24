# SAITM EPMS — Software Design Document (SDD)

**Enterprise Placement Management System** for St. Andrews Institute of Technology & Management.

> **Phase 1 — Planning & Architecture.** This directory contains the complete architecture and design documentation produced *before* implementation of the remaining phases. It is the single source of truth for how the system is designed; it does not contain implementation code.

## Document index

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Software Requirement Specification](./01-srs.md) | What the system must do and the constraints it operates under |
| 02 | [Database Design](./02-database-design.md) | Every Firestore collection: fields, types, relationships, indexes, validation, security |
| 03 | [Authentication Flow](./03-authentication-flow.md) | Per-role sign-in, OTP, approval and session design + diagrams |
| 04 | [Folder Structure](./04-folder-structure.md) | Enterprise, feature-first project layout with per-role modules |
| 05 | [Security Rules Design](./05-security-rules.md) | Role × collection × operation permission matrix and policies |
| 06 | [Navigation Structure](./06-navigation-structure.md) | Sidebar, topbar, breadcrumbs, quick actions per role |
| 07 | [Routing Structure](./07-routing-structure.md) | Public, protected, role and dynamic routes |
| 08 | [Component Architecture](./08-component-architecture.md) | Reusable component taxonomy and contracts |
| 09 | [UI Design System](./09-ui-design-system.md) | Tokens, typography, spacing, states — SAITM branded |
| 10 | [State Management](./10-state-management.md) | Client vs server state, caching, offline |
| 11 | [Feature Mapping](./11-feature-mapping.md) | Every feature → modules, collections, APIs, components |
| 12 | [Development Roadmap](./12-roadmap.md) | Phased delivery plan (Phases 1–10) |

## Companion documents (repo root)

- [`CLAUDE.md`](../../CLAUDE.md) — **binding, locked** constraints (tech stack, palette, branding, storage split).
- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) — the physical folder blueprint with per-folder rationale.
- [`docs/student-auth-onboarding.md`](../student-auth-onboarding.md) — as-built notes for the shipped auth + onboarding module.

## Status legend

Throughout these documents, each capability is tagged:

- ✅ **Implemented** — built and verified (Student auth, onboarding, dashboard).
- 🟡 **Planned** — designed here, not yet built (Recruiter, Admin, some collections).
- 🔵 **Future** — post-v1 (AI features, advanced analytics).

## Guiding principles

1. **Feature-first with a shared foundation** — business logic lives in isolated `features/*` modules; `app/` is routing only.
2. **Security is server-side** — Firestore Security Rules are the authorization boundary; client guards are UX.
3. **Role via custom claims** — a single identity, one of three roles (`student` | `recruiter` | `admin`), enforced in rules and functions.
4. **Locked design system** — SAITM Navy `#18305F` / Gold `#D8AE3E` and the defined neutrals; no off-palette color.
5. **Denormalize for reads** — embed snapshots (e.g., applicant data on an application) to keep student/recruiter dashboards fast and index-light.
