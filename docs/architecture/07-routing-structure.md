# 07 — Routing Structure (Next.js App Router)

Routes are grouped so each audience gets an isolated layout + guard. `app/` contains routing only; pages compose features.

## Route classes

| Class | Guard | Examples |
|---|---|---|
| **Public** | none | `/`, `/login`, `/recruiter/register`, `/forgot-password` |
| **Auth-gated** | signed in | `/onboarding` |
| **Student** | `role=student` + `profileCompleted` | `/dashboard`, `/placement-drives`, … |
| **Recruiter** | `role=recruiter` + `approved` | `/recruiter/*` |
| **Admin** | `role=admin` | `/admin/*` |
| **System** | none | `/unauthorized`, `not-found`, `error` |

## Public routes

| Path | Page | Status |
|---|---|---|
| `/` | Entry → routes by auth/role | ✅ |
| `/(marketing)` | Landing/about/contact | 🟡 |
| `/login` | Student email-OTP sign-in | ✅ |
| `/recruiter/register` | Recruiter registration | 🟡 |
| `/forgot-password`, `/verify-email` | Recruiter/admin password flows | 🟡 |

## Auth-gated

| Path | Page | Status |
|---|---|---|
| `/onboarding` | Profile completion wizard (`?step=N` deep-link) | ✅ |

## Student routes ✅

| Path | Page |
|---|---|
| `/dashboard` | Student home (widgets) |
| `/profile` | Profile view |
| `/placement-drives` | Drive list (`?q=`) |
| `/placement-drives/[driveId]` | Drive detail 🟡 (currently modal) |
| `/companies` | Companies |
| `/applications` | My applications (filter + timeline) |
| `/applications/[applicationId]` | Application detail 🟡 |
| `/interviews` | Interview schedule |
| `/resume`, `/documents`, `/skills` | Career assets |
| `/notifications`, `/announcements` | Comms |
| `/settings`, `/help` | Account |

## Recruiter routes 🟡

| Path | Page |
|---|---|
| `/recruiter/pending` | Awaiting-approval screen |
| `/recruiter/dashboard` | KPIs, active drives |
| `/recruiter/company` | Company profile |
| `/recruiter/jobs`, `/recruiter/jobs/new`, `/recruiter/jobs/[jobId]/edit` | Drive management |
| `/recruiter/candidates` | Search eligible candidates (`?filters`) |
| `/recruiter/candidates/[studentId]` | Applicant profile |
| `/recruiter/shortlist` | Shortlisted candidates |
| `/recruiter/interviews`, `/recruiter/interviews/[interviewId]` | Interviews |
| `/recruiter/offers` | Offers |
| `/recruiter/notifications`, `/recruiter/settings` | Account |

## Admin routes 🟡

| Path | Page |
|---|---|
| `/admin/dashboard` | Overview |
| `/admin/students`, `/admin/students/[studentId]` | Student mgmt |
| `/admin/recruiters`, `/admin/recruiters/[recruiterId]` | Approvals |
| `/admin/companies`, `/admin/companies/[companyId]` | Company mgmt |
| `/admin/placement-drives`, `/admin/placement-drives/new`, `/admin/placement-drives/[driveId]` | Drive mgmt/approval |
| `/admin/applications`, `/admin/interviews`, `/admin/offers` | Pipeline oversight |
| `/admin/reports`, `/admin/analytics` | BI |
| `/admin/announcements` | Broadcasts |
| `/admin/support`, `/admin/activity-logs` | Ops |
| `/admin/settings`, `/admin/user-management` | System |

## Dynamic segments

`[driveId]`, `[applicationId]`, `[studentId]`, `[recruiterId]`, `[companyId]`, `[interviewId]`, `[jobId]`, `[ticketId]` — camelCase params; validated on load; unknown ids render `not-found`.

## System routes

| Path | Purpose | Status |
|---|---|---|
| `not-found.tsx` | Branded 404 | ✅ |
| `error.tsx` / `global-error.tsx` | Error boundaries | ✅ |
| `/unauthorized` | 403 for wrong-role access | 🟡 |
| `loading.tsx` | Route-level skeletons | 🟡 |

## Guarding & redirects

- **Client:** `RequireAuth` (+ `requireComplete`, role/approval variants) redirects; role-aware layouts.
- **Edge (planned):** `middleware.ts` for early redirects using a lightweight session cookie/claim, before the client renders.
- **Redirect map:**
  - unauthenticated → `/login`
  - student incomplete → `/onboarding`
  - recruiter unapproved → `/recruiter/pending`
  - wrong role → `/unauthorized`

## Rendering strategy

- **Server Components by default**; pages that need auth state / interactivity are Client Components under the role layout.
- `useSearchParams` usages are wrapped in `<Suspense>` to avoid static-render deopt.
- Auth/data-bound pages are effectively dynamic (rendered client-side after auth resolves).
