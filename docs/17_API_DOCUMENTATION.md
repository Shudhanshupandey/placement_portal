# 17 — API Documentation

The system has **no REST API**. The browser talks to Firebase directly via the Web SDK (gated by Security Rules), and to **Cloud Functions callables** (`httpsCallable`) for privileged operations. This document covers both the callables and the frontend **service layer** (the app's internal API).

## Cloud Functions (callable, region `asia-south1`)

Invoked from the client via `firebase/functions` `httpsCallable`. Errors are thrown as `HttpsError` and mapped to friendly messages client-side.

### `sendOtp`
- **Auth:** public · **Request:** `{ email: string }` · **Response:** `{ success: true, cooldownSeconds: number }` — the code is never returned to the client, only emailed
- **Errors:** `permission-denied` (non-`@saitm.ac.in`), `resource-exhausted` (cooldown / hourly cap), `unavailable` (email queue failed)

### `verifyOtp`
- **Auth:** public · **Request:** `{ email: string, otp: string }` · **Response:** `{ token: string, isNewUser: boolean }`
- Side effects: get/create user, set `role=student` claim, seed `students/{uid}` + `users/{uid}`.
- **Errors:** `invalid-argument` (bad code), `deadline-exceeded` (expired), `resource-exhausted` (too many attempts), `not-found` (no active code)

### `registerRecruiter`
- **Auth:** public · **Request:** `{ email, password, fullName, companyName, designation?, phone?, companyWebsite? }` · **Response:** `{ success: true }`
- Side effects: create user, set `role=recruiter` claim, `approvalStatus:'pending'`, write `users`/`recruiters`, queue verification email.
- **Errors:** `invalid-argument` (bad input / `@saitm.ac.in`), `already-exists`

### `approveRecruiter` — **admin only**
- **Request:** `{ uid: string, approve: boolean, reason?: string }` · **Response:** `{ success: true, status: 'approved'|'rejected' }`
- **Errors:** `permission-denied` (non-admin), `invalid-argument`

### `reviewStudent` — **admin only**
- **Request:** `{ uid: string, verified: boolean, reason?: string }` · **Response:** `{ success: true, verificationStatus: 'verified'|'rejected' }`
- Side effect: notifies the student.
- **Errors:** `permission-denied`, `invalid-argument`

## Frontend service layer (internal API)

Services are framework-agnostic data-access modules (`features/*/services/*.service.ts`). Components call **hooks**, hooks call **services**, services call Firebase.

| Service | Methods |
|---------|---------|
| `authService` (`features/auth`) | `requestOtp(email)`, `verifyOtp(email, otp)` → `signInWithCustomToken` |
| `recruiterAuthService` | `register(values)`, `login(email,password)`, `resendVerification()` |
| `adminAuthService` / `passwordAuthService` | `login(email,password)` (role-validated) / `sendReset(email)` |
| `onboardingService` | `save(uid, email, data)` — batched write of 4 collections + `users` |
| `profileService` | `getFull(uid)` → `{ student, academic, professional, documents }` |
| `drivesService` | `listPublished()`, `get(id)` |
| `applicationsService` | `apply(uid, full, drive)`, `listMine(uid)` |
| `notificationsService` | `list(uid)`, `markRead(id)`, `markAllRead(ids)` |

## Hooks → query keys

| Hook | Key | Backing |
|------|-----|---------|
| `useFullProfile` | `['full-profile', uid]` | `profileService.getFull` |
| `useDrives` / `useDrive` | `['placement-drives']` / `['placement-drive', id]` | `drivesService` |
| `useMyApplications` | `['applications', uid]` | `applicationsService.listMine` |
| `useApplyToDrive` | mutation → invalidates `applications` + `notifications` | `applicationsService.apply` |
| `useNotifications` | `['notifications', uid]` | `notificationsService.list` |
| `useAuth` | context (not Query) | `AuthProvider` |
| `useOtpAuth` / `useOnboarding` | local state machines | services |

## Client upload "APIs"

| Helper | Target | Signature |
|--------|--------|-----------|
| `uploadImageToCloudinary(file, folder?)` | Cloudinary | → `{ url, publicId }` |
| `uploadDocumentToStorage(uid, file, category, onProgress?)` | Firebase Storage | → `{ url, path, name, size }` |

## Not Yet Implemented

REST route handlers (`app/api/*` is a scaffold), webhook endpoints, a Cloudinary signed-upload signing route, and recruiter/admin data mutations (status transitions, approvals UI).
