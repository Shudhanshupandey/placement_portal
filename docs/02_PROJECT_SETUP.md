# 02 — Project Setup

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20.x (Functions target Node 20) |
| npm | 10.x |
| Firebase CLI | latest (`npm i -g firebase-tools`) — for backend/emulators |
| A Firebase project | Firestore + Storage + Authentication enabled |
| A Cloudinary account | with an **unsigned** upload preset |

## 1. Install dependencies

```bash
# Frontend
cd Frontend
npm install

# Backend functions (separate package)
cd ../Backend/functions
npm install
```

## 2. Configure environment variables (Frontend)

Copy the example and fill values:

```bash
cd Frontend
cp .env.example .env.local
```

`.env.local` (all `NEXT_PUBLIC_*` are browser-exposed — safe for Firebase web keys):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | optional analytics |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` | must match deploy region (default `asia-south1`) |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | `true` to route SDK to the emulator |
| `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` | student domain gate (`saitm.ac.in`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary media uploads |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary **unsigned** preset |

> All env access is centralized in [`config/env.ts`](../Frontend/config/env.ts). Never read `process.env` directly elsewhere.
> **Fallback behavior:** if Firebase keys are empty, the client initializes with harmless demo values so `next build`/`next start` never crash — but auth/data will not function until real values are provided.

## 3. Run locally

```bash
# Frontend dev server → http://localhost:3000
cd Frontend
npm run dev
```

### With the Firebase Emulator Suite (recommended for local testing)

```bash
cd Backend
firebase emulators:start   # auth 9099, functions 5001, firestore 8080, storage 9199, UI
```

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `Frontend/.env.local`. There is no dev bypass for the OTP — the code is only ever emailed, so configure `SMTP_USER`/`SMTP_PASS` in `backend/functions/.env` before signing in locally (verify with `node backend/functions/test-email.mjs <addr>`).

## 4. Provision an admin (out-of-band)

There is no public admin signup. Create one with the seed script:

```bash
cd Backend/functions
ADMIN_EMAIL=admin@saitm.ac.in ADMIN_PASSWORD='StrongPass#123' node seed-admin.mjs
```

(Uses `GOOGLE_APPLICATION_CREDENTIALS` for a real project, or the emulator env vars.)

## 5. Seed demo drives & announcements (optional, for a populated dashboard)

```bash
cd Backend/functions
node seed-demo.mjs        # + optional STUDENT_UID=<uid> for a personal notification
```

## 6. Available scripts

**Frontend** (`Frontend/package.json`):

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | local dev server |
| `build` | `next build` | production build |
| `start` | `next start` | serve the production build |
| `lint` | `next lint` | ESLint |
| `typecheck` | `tsc --noEmit` | type-check only |

**Backend functions** (`Backend/functions/package.json`): `build` (`tsc`), `build:watch`, `serve`, `deploy`, `logs`.

## 7. Verify the build

```bash
cd Frontend
npm run lint && npm run typecheck && npm run build
```

All three should complete with **0 errors** (verified in the audit).

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `auth/invalid-api-key` at build | Empty env with no fallback — the code already falls back to demo values; ensure `config/env.ts` is intact. |
| Login "sends code" but nothing arrives | SMTP not configured — set `SMTP_USER`/`SMTP_PASS` (Gmail App Password) in `backend/functions/.env` and re-run `test-email.mjs`. Without them, mail is only queued to Firestore and never delivered. |
| Multiple-lockfile warning | Handled via `outputFileTracingRoot` in `next.config.mjs`. |
| `EADDRINUSE` on `next start` | A previous server is still bound — kill it (`netstat -ano | grep :PORT` → `taskkill /F /PID`). |
