# 01 — Software Requirement Specification (SRS)

**System:** SAITM Enterprise Placement Management System (EPMS)
**Version:** 1.0 (Phase 1) · **Status:** Architecture baseline

---

## 1. Project Overview

The SAITM EPMS is a web platform that digitizes the end-to-end campus placement lifecycle for St. Andrews Institute of Technology & Management. It connects three constituencies — **Students**, **Recruiters**, and the **Placement Cell (Admin/TPO)** — on a single, secure, branded product.

It replaces manual, spreadsheet- and email-driven placement operations with a structured system for profiles, eligibility-gated applications, drive management, interview scheduling, offers, and analytics. The system is designed to scale to thousands of concurrent students across multiple graduating batches.

## 2. Objectives

| # | Objective | Success measure |
|---|-----------|-----------------|
| O1 | One verified identity per student, tied to the college domain | 100% of student accounts are `@saitm.ac.in` |
| O2 | Eliminate ineligible/incomplete applications | Applications blocked unless profile-complete **and** eligible, with reasons |
| O3 | One-click applications using stored profile data | No re-entry of data at apply time |
| O4 | Real-time visibility of drives, statuses, interviews | Students see approved drives instantly |
| O5 | Centralized, auditable placement operations for the TPO | All state changes traceable via activity logs |
| O6 | Premium, on-brand, accessible, responsive UX | Lighthouse ≥ 90; WCAG AA |
| O7 | Secure by construction | Authorization enforced in Firestore Rules, not the client |

## 3. Business Requirements

- **BR1** — The Placement Cell must publish placement drives and control their visibility (draft → published → closed).
- **BR2** — Students must maintain a rich profile (personal, academic, professional, documents) that recruiters can evaluate.
- **BR3** — Eligibility (course, branch, year, CGPA, backlogs, passing year, skills) must be enforced automatically per drive.
- **BR4** — Recruiters must onboard through a verified, admin-approved process before posting or viewing candidates.
- **BR5** — The system must track each application through a defined status lifecycle with a visible timeline.
- **BR6** — Stakeholders must receive timely notifications (in-app + push) for drives, interviews, and status changes.
- **BR7** — The TPO must access reports and analytics (placement rate, package distribution, company participation).
- **BR8** — All actions on sensitive entities must be auditable.

## 4. Functional Requirements

### 4.1 Student (✅ core implemented)
- FR-S1 Sign in with college email via **email OTP**; block non-`@saitm.ac.in`.
- FR-S2 First-login **profile completion wizard** (personal mandatory; academic/professional/documents optional).
- FR-S3 View & edit profile; upload photo (Cloudinary) and documents (Firebase Storage).
- FR-S4 Browse **approved** placement drives with full detail and eligibility summary.
- FR-S5 **Apply** with automatic profile-completeness gate + eligibility check + one-click confirm.
- FR-S6 Track **applications** and their **status timeline**.
- FR-S7 View **interviews**, **offers**, **notifications**, **announcements**.
- FR-S8 Manage **settings** (notification preferences, privacy, connected links). 🟡 partial
- FR-S9 Receive **push notifications** (FCM). 🟡

### 4.2 Recruiter 🟡
- FR-R1 Register with a work email; verify email; await **admin approval**.
- FR-R2 Create and manage a **company profile** (logo via Cloudinary).
- FR-R3 Create **job posts / drives** (subject to admin approval before publishing).
- FR-R4 **Search & shortlist** eligible candidates; view applicant profiles/resumes.
- FR-R5 **Schedule interviews** and advance application status.
- FR-R6 Record **selection / offer** outcomes.

### 4.3 Admin / Placement Cell 🟡
- FR-A1 Secure login with role-based access.
- FR-A2 Manage **students, recruiters, companies** (approve/suspend).
- FR-A3 Create/approve/publish/close **placement drives**.
- FR-A4 Oversee **applications** and **interviews** across all drives.
- FR-A5 Publish **announcements** and targeted notifications.
- FR-A6 View **reports & analytics**; export data.
- FR-A7 Manage **support tickets**, **settings**, and **activity logs**.

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | First load JS budget ≤ ~350 KB per route; server components by default; lazy-load heavy client trees; indexed, paginated Firestore queries. |
| **Scalability** | Stateless frontend on Vercel edge/serverless; Firestore auto-scales; denormalized reads to avoid N+1. |
| **Security** | Firestore Rules as the authorization boundary; custom-claim roles; OTP hashed + rate-limited; least-privilege storage rules. |
| **Availability** | Target 99.9% (managed Firebase + Vercel). Graceful degradation to empty/error states when offline. |
| **Accessibility** | WCAG 2.1 AA: semantic markup, focus-visible rings, keyboard navigation, ARIA on interactive widgets. |
| **Responsiveness** | Mobile → large-screen; fluid layouts, mobile drawer, collapsible sidebar. |
| **Maintainability** | Feature-first modules, barrel public APIs, TypeScript everywhere, Zod-derived types. |
| **Observability** | Client error boundaries; structured function logs; activity logs for audit. |
| **Internationalization** | English (v1); copy centralized to allow future i18n. 🔵 |
| **Compliance** | Data minimization; Aadhaar optional & never displayed publicly; documents access-scoped to owner + authorized staff. |

## 6. User Roles

| Role | Identity source | Onboarding | Primary surface |
|------|-----------------|------------|-----------------|
| **Student** | `@saitm.ac.in` email OTP | Self-serve wizard | Student dashboard |
| **Recruiter** | Work email + verification | Self-register → **admin approval** | Recruiter dashboard |
| **Admin/TPO** | Provisioned by super-admin | Invite/seed | Admin console |

Role is carried as a **Firebase custom claim** (`role`) and mirrored in the `users/{uid}` document.

## 7. Permissions (summary)

| Capability | Student | Recruiter | Admin |
|---|:--:|:--:|:--:|
| Read own profile / write own profile | ✅ / ✅ | ✅ / ✅ | ✅ / ✅ |
| Read published drives | ✅ | ✅ (own) | ✅ (all) |
| Create drive | ❌ | 🟡 (pending approval) | ✅ |
| Publish/approve drive | ❌ | ❌ | ✅ |
| Apply to drive | ✅ | ❌ | ❌ |
| Read applicant profiles | ❌ | ✅ (own drives) | ✅ |
| Advance application status | ❌ | ✅ (own drives) | ✅ |
| Approve recruiters | ❌ | ❌ | ✅ |
| Publish announcements | ❌ | ❌ | ✅ |
| View analytics/reports | own only | own drives | ✅ all |

Full matrix in [05 — Security Rules Design](./05-security-rules.md).

## 8. Project Scope (v1)

**In scope:** student auth & onboarding; profile; drives; eligibility engine; one-click applications; application status lifecycle & timeline; interviews (schedule/view); offers; notifications & announcements; recruiter onboarding & drive posting; admin management, approvals, analytics, support; SAITM design system.

**Out of scope (v1):** payments/fees, alumni network, resume auto-builder/AI scoring (see Future), third-party ATS integrations, native mobile apps.

## 9. Future Scope 🔵

- AI resume scoring & improvement suggestions (`resumeScore`).
- AI job–candidate matching and recommended drives.
- Aptitude/coding test integration and scheduling.
- Interview feedback & analytics loops.
- Alumni mentoring module.
- Data export & BI connectors; multi-institute (multi-tenant) support.
- Native push via installable PWA / mobile wrappers.

## 10. Constraints

- **Locked tech stack & palette** (see `CLAUDE.md`) — no substitutions.
- **Storage split** — images → Cloudinary; documents → Firebase Storage.
- **Email OTP** is not native to Firebase → implemented via Cloud Functions + custom tokens.
- Firestore query model (no server-side joins) dictates **denormalization** and **composite indexes**.
- College email domain (`saitm.ac.in`) is a hard gate for students.

## 11. Assumptions

- The institution operates Google Workspace (or equivalent) issuing `@saitm.ac.in` addresses.
- An email transport (Firebase "Trigger Email" extension or SMTP/SendGrid/Resend) is available for OTP and notifications.
- Admin accounts are provisioned by a trusted super-admin out of band.
- Recruiters are vetted by the Placement Cell before approval.
- Network connectivity is generally available; brief offline periods degrade gracefully.

## 12. Glossary

| Term | Meaning |
|------|---------|
| TPO | Training & Placement Officer / Placement Cell (Admin role) |
| Drive | A placement/recruitment event by a company |
| Eligibility | The rule set a student must satisfy to apply to a drive |
| Snapshot | Denormalized copy of data embedded in another document at write time |
| Custom claim | A role/permission attribute embedded in the Firebase auth token |
