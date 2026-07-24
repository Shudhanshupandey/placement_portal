# 19 — Developer Guide

## Quick start

```bash
cd Frontend && npm install && npm run dev      # http://localhost:3000
cd Backend/functions && npm install            # functions deps
```

See [02_PROJECT_SETUP](./02_PROJECT_SETUP.md) for env + emulator + admin seeding.

## Configure Firebase

1. Create a Firebase project; add a **Web app**; copy the config into `Frontend/.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
2. Enable Firestore, Storage, Authentication.
3. Deploy rules/functions from `Backend/` (see [18](./18_DEPLOYMENT_GUIDE.md)) or run the **emulator** for local dev.

## Configure Cloudinary

Create an **unsigned** upload preset; set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Used by `lib/cloudinary/upload.ts` (images only).

## Environment variables

All access is centralized in [`config/env.ts`](../Frontend/config/env.ts). **Never** read `process.env` elsewhere — add new vars there. Only `NEXT_PUBLIC_*` are browser-exposed.

## Run / build / deploy

| Task | Command |
|------|---------|
| Dev | `npm run dev` |
| Lint | `npm run lint` (must be clean) |
| Type-check | `npm run typecheck` |
| Build | `npm run build` |
| Functions build | `cd Backend/functions && npm run build` |
| Deploy | see [18_DEPLOYMENT_GUIDE](./18_DEPLOYMENT_GUIDE.md) |

## How to add a new feature

1. Create `features/<name>/` with `components/ hooks/ services/ lib/ types.ts index.ts`.
2. Put data-access in `services/*.service.ts` (no React), wrap in TanStack Query **hooks**, render in **components**.
3. Export the public API from `index.ts` (barrel). **Never** import a feature's internals from outside.
4. Add a page under `app/(role)/…` that imports the feature and renders it (routing only).
5. Add types via **Zod schema + `z.infer`** so validation and types stay in sync.
6. Add Firestore rules for any new collection **before** shipping the query.

## How to add a Firestore collection

1. Model the **queries first**; key per-user docs by `uid`.
2. Add a rules block in `Backend/firestore.rules` (deny-by-default is already in place).
3. If a query needs sorting on a different field than the filter, add a composite index to `Backend/firestore.indexes.json`.
4. Write via a service using `serverTimestamp()`; strip `undefined`/empty before writing; use `writeBatch` for multi-doc ops.

## How to create a reusable component

- **Primitive** → `components/ui/*`: presentational, `forwardRef`, `className` via `cn()`, `cva` for variants, Radix for interactivity.
- **Shared** → `components/*` when ≥ 2 features use it (promote from a feature).
- **Feature** → `features/<name>/components/*` while only one feature uses it.

## Coding standards

- **TypeScript everywhere**, strict. Prefer types inferred from Zod.
- **Server Components by default**; add `"use client"` only for interactivity/hooks/browser APIs; wrap `useSearchParams` in `<Suspense>`.
- Data flow: **components → hooks (Query) → services → Firebase**. Components never call services directly; services never touch React.
- `lib/` = configured SDK singletons/wrappers; `utils/` = pure functions.
- Remote data belongs to **TanStack Query**, never mirrored into a store.
- Firestore **rules are the security boundary**; guards/middleware are UX.

## Naming & folder rules

kebab-case filenames · PascalCase component exports · `use*` hooks · `*.service.ts` / `*.schema.ts` / `*.types.ts` · route segments kebab-case · dynamic `[camelCase]` · route groups `(kebab)`. A route group and a real folder **cannot share a top-level segment** (why recruiter/admin use real `/recruiter` `/admin` prefixes, with auth pages under the same folder gated by a conditional layout).

## Testing

Not Yet Implemented. Recommended: unit (engines/helpers: `checkEligibility`, `computeCompletion`, formatters), component (RTL with mocked hooks), E2E (Playwright vs emulator for login→onboarding→apply), and **Firestore rules unit tests**.

## Common pitfalls (learned in this codebase)

| Pitfall | Rule |
|---------|------|
| Server Component importing a client-only component without `"use client"` (broke `/_not-found`) | keep `error.tsx`/`global-error.tsx` client; server pages use styled `Link`, not `Button` |
| Stale cache after profile edit | invalidate `['full-profile', uid]` after `onboardingService.save` |
| Tailwind class silently missing (`h-4.5`, `h-13`) | use scale values or arbitrary `[18px]` |
| `EADDRINUSE` when re-testing | kill the stale `next start` first |
| Firebase init crash on empty env | keep the demo fallback in `lib/firebase/client.ts` |
| IDE auto-import writing `"@/node_modules/react-hook-form/dist"` | always import `"react-hook-form"`. The `@/*` alias makes the bad path pass `tsc` but fail the webpack build — typecheck alone will not catch it |

## Dependency safety (do not skip)

> **NEVER run `npm audit fix --force` in `frontend/`.**
> The advisories it reports (postcss `GHSA-qx2v-qp2m-jg93` / `GHSA-6g55-p6wh-862q`, sharp `GHSA-f88m-g3jw-g9cj`) live *inside* the Next 15 tree. npm's "fix" is to install **`next@9.3.3`** — a 6-major-version downgrade that deletes the App Router (`next/navigation`, `Metadata`, typed `Link`) and violates the locked stack in [`CLAUDE.md`](../CLAUDE.md). This has already broken the repo once.

Those advisories are instead patched properly via `overrides` in `frontend/package.json`:

```jsonc
"overrides": { "postcss": "^8.5.22", "sharp": "^0.35.3" }
```

`npm audit` reports **0 vulnerabilities** with these in place, so there is never a reason to reach for `--force`. Rules if you touch deps:

- `next` stays on **15.x** (currently 15.5.21). Never let a tool move it.
- An `overrides` entry must not contradict its direct-dependency range, or npm fails with `EOVERRIDE` — bump the direct dep to match (this is why `postcss` is `^8.5.22`, not `^8.4.49`).
- After any dependency change run the **full gate**: `tsc --noEmit` → `npm run build` → `npm run lint`. Typecheck alone is not sufficient (see the auto-import pitfall above).

## Reference docs

Architecture SDD: [`docs/architecture/`](./architecture/) · Audit: [`docs/audit-report.md`](./audit-report.md) · Binding constraints: [`CLAUDE.md`](../CLAUDE.md).
