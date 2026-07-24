# 18 — Deployment Guide

Two deployables:

| Part | Platform | Source |
|------|----------|--------|
| Frontend (Next.js 15) | **Vercel** | `frontend/` |
| Backend (Cloud Functions, Firestore rules, Storage rules) | **Firebase** | `backend/` |

> **There is no Node/Express server and no Render deployment.** The backend is
> Firebase Cloud Functions (`asia-south1`). "Start command", "PORT" and
> "graceful shutdown" have no equivalent — the platform owns the process
> lifecycle. The liveness probe is the frontend's `/api/health`.

---

## 0. Prerequisites

- Firebase project with **Authentication**, **Cloud Firestore** and **Storage** enabled.
- Firebase plan: **Blaze**. Cloud Functions v2 cannot deploy on Spark.
- Cloudinary account with an **unsigned** upload preset.
- Firebase CLI: `npm i -g firebase-tools && firebase login`.
- Node **20+** (`frontend/.nvmrc` pins 20; the Functions runtime is pinned to 20).

---

## 1. Backend → Firebase

```bash
cd backend

# Confirm the target project (backend/.firebaserc holds the default).
firebase use saitm-placement-portal

# Deploy functions + rules + indexes + storage rules
firebase deploy --only functions,firestore:rules,firestore:indexes,storage
```

`firebase.json` runs `npm --prefix functions run build` (i.e. `tsc`) as a
predeploy step, so a type error stops the deploy before anything ships.

### Runtime configuration

`backend/functions/.env` is read by the Firebase CLI at deploy time. Required:

| Key | Notes |
|-----|-------|
| `FUNCTIONS_REGION` | `asia-south1` — must equal `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` |
| `ALLOWED_EMAIL_DOMAIN` | must mirror `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` |
| `OTP_PEPPER` | long random secret; the fallback is a public constant in source |
| `CORS_ALLOWED_ORIGINS` | every deployed frontend origin, comma-separated |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Gmail App Password (16 chars) |

For production, prefer Secret Manager over the file:

```bash
firebase functions:secrets:set OTP_PEPPER
firebase functions:secrets:set SMTP_PASS
```

> **Never** put `GCLOUD_PROJECT` or `GOOGLE_CLOUD_PROJECT` in
> `backend/functions/.env` — they are reserved by the Functions runtime and the
> deploy is rejected. They belong in `.env.seed`.

### Email delivery

`lib/email.ts` sends over SMTP directly (nodemailer) when `SMTP_USER` and
`SMTP_PASS` are set, and otherwise falls back to writing documents to the
Firestore `mail` collection. That fallback only delivers if the **"Trigger Email
from Firestore"** extension is installed, and it never runs in the emulator.

Gmail free accounts cap around **500 recipients/day**, shared between student
OTPs and recruiter verification mail. Move to a transactional provider
(SendGrid/Resend/SES) before a real placement season.

### Provision the admin

There is no public admin signup.

```bash
cd backend/functions
# bash / git-bash
set -a; . ./.env.seed; set +a
node seed-admin.mjs
```

Requires `GOOGLE_APPLICATION_CREDENTIALS` (service-account JSON, stored outside
the repo), `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Sign in once at `/portal`, change
the password, then blank it in `.env.seed`.

---

## 2. Frontend → Vercel

### Project settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js |
| **Build Command** | `next build` (default) |
| **Output Directory** | `.next` (default — do **not** set `out`; this is not a static export) |
| **Install Command** | `npm ci` |
| **Node.js Version** | 20.x |
| **Region** | `bom1` (Mumbai) — closest to the `asia-south1` functions |

`frontend/vercel.json` already declares the framework, commands and region, so
importing the repo with Root Directory = `frontend` is enough.

### Environment variables

Add every key from `frontend/.env.example` under
**Settings → Environment Variables**, for Production *and* Preview:

| Key | Required | Source |
|-----|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Console → Project settings → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | ” |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | ” |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Console → Storage (verify exact host) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Console → Project settings → Web app |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | ” |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | — | ” (omit to disable Analytics) |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` | ✅ | `asia-south1` |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | ✅ | **`false`** |
| `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` | ✅ | e.g. `saitm.ac.in` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary → Dashboard |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | ✅ | Cloudinary → Settings → Upload (unsigned) |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | — | Console → Cloud Messaging (unused today) |

`NEXT_PUBLIC_*` values are compiled into the client bundle at **build** time —
changing one in Vercel requires a **redeploy**, not just a restart.

---

## 3. Wire the two together

After both sides are deployed:

1. **CORS** — put the Vercel production URL (and custom domain) in
   `CORS_ALLOWED_ORIGINS`, then redeploy functions. Until then every callable
   fails in the browser with a CORS error.
2. **Authorized domains** — Firebase Console → Authentication → Settings →
   Authorized domains → add the Vercel domain, or sign-in is rejected.
3. **Preview deploys** — optionally set `CORS_VERCEL_PREVIEW_PROJECT` to the
   Vercel project slug so per-commit preview URLs are allowed. Never widen this
   to a blanket `*.vercel.app`.

---

## 4. Security headers

`frontend/next.config.mjs` sets HSTS, `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and disables
`X-Powered-By`.

CSP ships as **`Content-Security-Policy-Report-Only`** on purpose: a mis-scoped
policy silently breaks sign-in. To enforce it:

1. Deploy, open the portal, and exercise login → dashboard → upload.
2. Watch DevTools → Console for `[Report Only]` violations and widen the
   directives in `CSP_DIRECTIVES` to cover any legitimate ones.
3. Rename the header key `Content-Security-Policy-Report-Only` →
   `Content-Security-Policy` and redeploy.

---

## 5. Verification

```bash
# Frontend — all three must pass
cd frontend
npm run verify        # typecheck && lint && build

# Backend
cd backend/functions && npm run build
```

CI runs the same commands on every push — see `.github/workflows/ci.yml`.

Post-deploy smoke test:

| Check | Expected |
|-------|----------|
| `GET /api/health` | `200` with `{"status":"ok","configured":{"firebase":true,"cloudinary":true}}` |
| `/student` → enter college email | OTP email arrives within ~30s |
| Wrong OTP ×5 | locked out, "request a new code" |
| `/portal/register` ×4 within an hour | 4th rejected with `resource-exhausted` |
| Student visits `/admin` | redirected to `/unauthorized` |
| Signed-out visit to `/dashboard` | redirected to `/student` |
| Onboarding | writes `students` + `academicDetails` + `professionalDetails` + `documents`, flips `users.verificationStatus='pending'` |
| Recruiter register → verify → pending → admin approves | `approvalStatus` becomes `approved` |
| Profile photo upload | lands in Cloudinary, **not** Firebase Storage |
| Resume upload (PDF ≤10 MB) | lands in Firebase Storage under `students/<uid>/` |
| Resume upload >10 MB | rejected client-side *and* by Storage rules |

---

## 6. Environments

Use Firebase project aliases in `backend/.firebaserc` (`dev`/`staging`/`prod`)
with matching Vercel environments (Preview/Production) and separate env values.

---

## 7. Rollback

- **Frontend:** Vercel → Deployments → previous build → *Promote to Production*.
- **Backend:** redeploy the previous commit —
  `git checkout <sha> -- backend && firebase deploy --only functions`.
  Firestore rules roll back the same way; there are no destructive migrations.

---

## Build config notes

- `next.config.mjs`: `typescript.ignoreBuildErrors: false` (type errors **do**
  fail the build), `eslint.ignoreDuringBuilds: true` (lint runs separately in
  CI), `outputFileTracingRoot` pins the workspace root,
  `images.remotePatterns` allows `res.cloudinary.com`,
  `firebasestorage.googleapis.com` and `lh3.googleusercontent.com`,
  `poweredByHeader: false`, AVIF/WebP output formats.
- Next is pinned to a patched `15.5.x`. **Never run `npm audit fix --force`** —
  npm "fixes" the transitive advisories by downgrading Next to 9.3.3, which
  destroys the App Router. See `19_DEVELOPER_GUIDE.md`.
