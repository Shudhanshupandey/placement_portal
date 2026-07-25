# 21 — Demo / Development Mode

A temporary **mock-authentication layer** that lets anyone explore the whole
portal — every dashboard, populated with realistic sample data — without a
Firebase project, credentials, or a backend.

It is an **additive layer, never a replacement**. The production Firebase
architecture (Authentication, Firestore, Cloud Functions, security rules,
middleware, route guards, role validation) is untouched and becomes active again
the moment the flag is off. Switching between the two is one environment
variable — no code changes.

---

## 1. The switch

Read in exactly one place: [`frontend/lib/dev-mode/flag.ts`](../frontend/lib/dev-mode/flag.ts).

Demo mode is **ON** when any of these hold:

| Condition | Use |
|-----------|-----|
| `NEXT_PUBLIC_DEMO_MODE=true` | The public "live demo" switch — set it on Vercel. |
| `NEXT_PUBLIC_DEV_MODE=true` | Legacy alias, identical effect (`DEMO_MODE` wins if both are set). |
| `NODE_ENV=development` | Implicit — the local `next dev` default. |

Demo mode is **OFF** (real Firebase) when:

| Condition | Result |
|-----------|--------|
| `NEXT_PUBLIC_DEMO_MODE=false` | Forces the real stack **even under `next dev`** — the escape hatch for local work against real credentials. |
| unset, in a production build | Off by default. |

`IS_DEV_MODE` is a build-time constant, so the branch never changes between
renders.

---

## 2. Demo credentials

Seeded in [`frontend/data/mock/mock-accounts.ts`](../frontend/data/mock/mock-accounts.ts).
They authenticate an **in-memory fixture store, never Firebase**, and grant
access to fabricated data only — they are not secrets.

| Role | Email | Secret | Lands on |
|------|-------|--------|----------|
| 🎓 Student | `student@saitm.ac.in` | OTP `123456` | `/dashboard` |
| 🏢 Recruiter | `recruiter@saitm.demo` | Password `Recruiter@123` | `/recruiter` |
| 🛡 Admin | `admin@saitm.demo` | Password `Admin@123` | `/admin` |

Two one-click entry points, both using the same `signInMockAccount()`:

- **Demo Accounts card** on the login pages (`/student`, `/portal`).
- **Floating "Dev Mode" toolbar** (bottom-left), available on every screen.

The seeded accounts are pre-verified and pre-approved, so the buttons redirect
**straight to the dashboard** — no onboarding, approval, or verify-email screens.

---

## 3. How the isolation works

Every service keeps its production file untouched and gains a sibling
`*.mock.service.ts` with an identical interface. A `services/` barrel selects
between them:

```ts
export const jobsService = IS_DEV_MODE ? mockJobsService : firebaseJobsService;
```

Hooks and components import the barrel, so nothing above the data layer knows
which implementation it is talking to.

- **Auth:** [`providers/app-providers.tsx`](../frontend/providers/app-providers.tsx)
  mounts `MockAuthProvider` in demo mode and the real `AuthProvider` otherwise.
  Both write the **same** non-sensitive routing-hint cookie, so the **untouched**
  edge middleware and route guards behave identically either way.
- **What is NOT bypassed:** middleware still runs, `RequireAuth` still gates
  every layout, a student still cannot reach `/admin`, and role separation is
  enforced exactly as in production.
- **Firebase is never contacted** in demo mode — no reads, no writes, no
  callable invocations.

---

## 4. Publish a live demo (Vercel)

1. Vercel → Project → Settings → Environment Variables →
   `NEXT_PUBLIC_DEMO_MODE = true` (Production and/or Preview).
2. Redeploy.

That is the **only** variable a demo needs — no Firebase keys, no Cloudinary
preset, no CORS. Visitors open the login page, pick a role, and explore every
module with sample data.

> A production build running with the flag on logs a loud
> `[dev-mode] Mock authentication is ACTIVE in a production build` warning — a
> demo deploy is legitimate, a real one with this flag on is not.

---

## 5. Switch to real production

1. Set `NEXT_PUBLIC_DEMO_MODE=false` (and remove `NEXT_PUBLIC_DEV_MODE` if set).
2. Add the real Firebase web credentials and the Cloudinary preset
   (see [`.env.example`](../.env.example) and
   [`18_DEPLOYMENT_GUIDE.md`](./18_DEPLOYMENT_GUIDE.md)).
3. Redeploy.

No code changes. The mock provider, mock services and the Demo Accounts card
are gated by `IS_DEV_MODE`; with the flag off they never render and the app runs
entirely on the original Firebase stack.

---

## 6. Files (all gated by `IS_DEV_MODE`)

| Path | Role |
|------|------|
| `frontend/lib/dev-mode/` | flag, mock session, mock DB, mock auth resolution, latency |
| `frontend/providers/mock-auth-provider.tsx` | mock counterpart of `auth-provider.tsx` |
| `frontend/data/mock/` | seeded accounts + sample data for every module |
| `frontend/features/*/services/*.mock.service.ts` | per-feature mock data access |
| `frontend/features/auth/components/demo-accounts-card.tsx` | login-page Demo Accounts card |
| `frontend/components/dev/dev-mode-toolbar.tsx` | floating dev toolbar |

None of these are reachable from the running application when demo mode is off.
