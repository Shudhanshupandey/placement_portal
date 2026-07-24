# 18 — Deployment Guide

Two deployables: **Frontend → Vercel**, **Backend → Firebase**.

## 0. Prerequisites

- A Firebase project (Firestore, Storage, Authentication enabled).
- A Cloudinary account with an **unsigned** upload preset.
- Firebase CLI (`npm i -g firebase-tools`), authenticated (`firebase login`).
- `Backend/.firebaserc` → set your project id (replace `your-firebase-project-id`).

## 1. Backend (Firebase)

```bash
cd Backend

# one-time: point at your project
firebase use <your-project-id>

# deploy functions + rules + indexes + storage
firebase deploy --only functions,firestore:rules,firestore:indexes,storage
```

- **Functions region** is `asia-south1` (must match `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION`).
- Set a production **OTP pepper**: `firebase functions:config` / environment `OTP_PEPPER` (and `ALLOWED_EMAIL_DOMAIN`, `FUNCTIONS_REGION` if overriding).
- **Email delivery:** install the Firebase **"Trigger Email from Firestore"** extension (collection `mail`), or replace `Backend/functions/src/lib/email.ts` with SendGrid/Resend/SMTP.
- **Provision an admin:** `ADMIN_EMAIL=… ADMIN_PASSWORD=… node seed-admin.mjs` (with `GOOGLE_APPLICATION_CREDENTIALS`).
- Optional demo data: `node seed-demo.mjs`.

## 2. Frontend (Vercel)

1. Import the repo in Vercel; set **Root Directory = `Frontend`**.
2. Framework preset: **Next.js** (build `next build`, output handled automatically).
3. Add environment variables (Project → Settings → Environment Variables) — the same keys as `.env.local`:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_*` | from Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` | `asia-south1` |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | `false` |
| `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` | `saitm.ac.in` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `_UPLOAD_PRESET` | from Cloudinary |

4. Deploy. Vercel runs `next build` (verified green: 28 routes + edge middleware).

## 3. Firebase Authentication settings

- Add your Vercel domain to **Authorized domains**.
- For recruiter email verification / password reset, configure the **email action handler** domain.

## 4. Post-deploy checklist

- [ ] Student OTP login works end-to-end (code actually received by email).
- [ ] Onboarding writes `students/academicDetails/professionalDetails/documents` + flips `users.verificationStatus='pending'`.
- [ ] Drives visible (run `seed-demo.mjs` or create via Admin SDK); apply flow gates + submits.
- [ ] Recruiter register → verify → pending; admin `approveRecruiter` → approved.
- [ ] Admin login rejects non-admins.
- [ ] Middleware redirects protected routes when signed out.
- [ ] Storage uploads (resume) and Cloudinary uploads (photo) succeed.

## 5. Environments

Use Firebase project aliases in `.firebaserc` (`dev`/`staging`/`prod`) and matching Vercel environments (Preview/Production) with separate env values.

## Build config notes

- `next.config.mjs`: `eslint.ignoreDuringBuilds: true` (lint runs separately in CI), `typescript.ignoreBuildErrors: false` (type errors **do** fail the build), `outputFileTracingRoot` pins the workspace root, `images.remotePatterns` allows `res.cloudinary.com` and `firebasestorage.googleapis.com`.
- Next is pinned to a patched `15.5.x`.

## CI recommendation (Not Yet Implemented)

Add a pipeline running `npm run lint && npm run typecheck && npm run build` for the frontend, `tsc` for functions, and (future) Firestore **rules unit tests** before deploy. `git init` the repo first (currently not version-controlled).
