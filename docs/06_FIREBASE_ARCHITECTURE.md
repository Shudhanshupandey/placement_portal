# 06 — Firebase Architecture

## Services in use

| Service | Used | Notes |
|---------|------|-------|
| Authentication | ✅ | custom-claim roles; student OTP via custom token; recruiter/admin email+password |
| Cloud Firestore | ✅ | primary datastore; Rules = authz boundary |
| Cloud Storage | ✅ | documents only (resume, marksheets, certificates) |
| Cloud Functions v2 | ✅ | 5 callables (region `asia-south1`) |
| Cloud Messaging (FCM) | 🟥 | Not Yet Implemented |
| Trigger Email extension | ⚙️ | consumes the `mail` collection (must be installed to deliver email) |

## Client initialization

[`lib/firebase/client.ts`](../Frontend/lib/firebase/client.ts) creates a **single app instance** (idempotent across HMR/RSC):

```ts
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, region);
```

- Empty env → **harmless demo fallback** config so build/SSR never throw `auth/invalid-api-key`.
- When `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` (browser only), it connects Auth/Firestore/Storage/Functions emulators exactly once.
- **No duplicate instances** (verified in the audit).

## Cloud Functions (v2, `asia-south1`)

Source: `Backend/functions/src`. Exported from `index.ts`.

| Function | Type | Auth | Purpose |
|----------|------|------|---------|
| `sendOtp` | callable | public | validate `@saitm.ac.in`, rate-limit, store hashed OTP, queue email |
| `verifyOtp` | callable | public | verify OTP → get/create user, set `role=student` claim, seed `students/{uid}` + `users/{uid}`, mint **custom token** |
| `registerRecruiter` | callable | public | create recruiter (server-side), set `role=recruiter` claim, `approvalStatus:pending`, send verify link |
| `approveRecruiter` | callable | **admin only** | set recruiter `approvalStatus` + `isActive`, notify |
| `reviewStudent` | callable | **admin only** | set student `verificationStatus` verified/rejected + notify |

Helpers: `lib/admin.ts` (Admin SDK init, `ALLOWED_EMAIL_DOMAINS`, `isEmulator`), `lib/otp.ts` (generate/hash/rate-limit config), `lib/email.ts` (send + templates), `lib/mailer.ts` (SMTP transport), `lib/https-options.ts` (region + CORS allowlist shared by every callable).

## Authentication design

- **Roles are custom claims** (`request.auth.token.role`). Set server-side only (functions / Admin SDK). The `users/{uid}.role` field mirrors the claim for convenience.
- **Student OTP** flow (no native Firebase email OTP): `sendOtp` → `verifyOtp` → `signInWithCustomToken`. OTPs are SHA-256 hashed with a server pepper, 10-min TTL, 45s resend cooldown, ≤5 sends/hour, ≤5 verify attempts.
- **Recruiter/Admin**: `signInWithEmailAndPassword`, then the client refreshes the token (`getIdTokenResult(true)`) and validates the role claim; wrong role → immediate sign-out.

## Firestore Security Rules (boundary)

File: `Backend/firestore.rules`. Helpers: `isSignedIn()`, `isOwner(uid)`, `hasRole(r)`, `isAdmin()`. Highlights:

- `users/{uid}` — read own/admin; **student self-update cannot** change `role`, toggle `isActive`, or set `verificationStatus` beyond `unverified|pending` (no self-verify).
- `students|academicDetails|professionalDetails|documents/{uid}` — full owner CRUD.
- `placementDrives` — read if signed-in **and** `status=='published'`; writes denied to clients (Admin SDK / recruiter+admin later).
- `applications/{id}` — create by owner with `status=='pending'`; **update/delete denied** to clients (server advances status).
- `notifications` — read own or broadcast (`'all'`); create own; update own (mark read).
- `otpRequests` / `mail` — **no client access** (functions only).
- Catch-all: deny.

## Storage Rules

File: `Backend/storage.rules`. Objects live under `students/{uid}/…`; **owner-only** read/write; enforce `contentType` (`application/pdf` or `image/*`) and size (≤ 10 MB). Photos are not stored here (Cloudinary).

## Cloudinary (media)

`lib/cloudinary/upload.ts` performs an **unsigned** upload to `https://api.cloudinary.com/v1_1/{cloud}/image/upload` with the configured preset; returns `secure_url`. Used for profile photo (onboarding) and passport photo. Requires `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

## Emulator suite

`Backend/firebase.json` configures auth(9099), functions(5001), firestore(8080), storage(9199) + UI. The OTP has no dev bypass in any mode — it is only ever delivered by email, so SMTP must be configured to sign in locally.

## Error handling

- Callable errors are mapped to friendly messages client-side (`auth.service`, `recruiter-auth.service`, `admin-auth.service`).
- `AuthProvider` wraps Firestore reads in try/catch and never crashes on offline/permission errors (falls back to empty status).
- Route-level `error.tsx` / `global-error.tsx` catch runtime errors with a branded fallback.
