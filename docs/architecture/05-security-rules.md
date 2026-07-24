# 05 — Security Rules Design (Firestore & Storage)

Firestore Security Rules are the **authorization boundary** of the system. This document specifies the *policy* (who may do what, and why); the deployable rules for implemented collections live in [`Backend/firestore.rules`](../../Backend/firestore.rules) and [`Backend/storage.rules`](../../Backend/storage.rules).

## Design tenets

1. **Deny by default.** A catch-all `match /{document=**} { allow read, write: if false; }` closes everything not explicitly allowed.
2. **Role from custom claims.** `request.auth.token.role` is authoritative; documents mirror it for convenience only.
3. **Ownership by uid.** Per-user documents are keyed by `uid`; ownership = `request.auth.uid == uid` (or `== resource.data.<ownerField>`).
4. **Status-gated visibility.** Drives are readable only when `status == 'published'` (except owner/admin).
5. **Privileged transitions are server-side.** Role assignment, recruiter approval and application status changes happen in Cloud Functions (Admin SDK bypasses rules); clients cannot perform them.
6. **Validate on write.** Rules assert required fields, enum membership and immutability of sensitive fields (e.g., `role`).

## Reusable helpers (design)

| Helper | Meaning |
|---|---|
| `isSignedIn()` | `request.auth != null` |
| `hasRole(r)` | `request.auth.token.role == r` |
| `isOwner(uid)` | signed in **and** `request.auth.uid == uid` |
| `isAdmin()` | `hasRole('admin')` |
| `isApprovedRecruiter()` | `hasRole('recruiter')` and recruiter doc `approvalStatus == 'approved'` |
| `roleImmutable()` | incoming `role` absent or unchanged |
| `ownsField(f)` | `request.resource.data[f] == request.auth.uid` |

## Permission matrix (role × collection × operation)

Legend: **O** = own, **A** = all, **P** = published-only, **—** = denied, **fn** = server/Cloud Function only.

| Collection | Student | Recruiter | Admin |
|---|---|---|---|
| `users` | read O · write fn | read O · write fn | read A · write fn/A |
| `students` | read O · write O (role immutable) | read via application | read A |
| `academicDetails` / `professionalDetails` / `documents` | read/write O | read via application | read A |
| `recruiters` | — | read/write O (not `approvalStatus`) | read/write A |
| `admins` | — | — | read O · write super-admin |
| `companies` | read A | read A · write O | read/write A |
| `placementDrives` | read P | read O(any status)+P · create/update O(pre-approval) | read/write A · **publish** A |
| `applications` | read O · **create O** (`status='pending'`) · update — | read O-drive · update O-drive | read/write A |
| `interviews` | read O | read/write O-drive | read/write A |
| `offers` | read O · update O (`accepted/declined`) | read/write O-drive | read/write A |
| `notifications` | read O+`all` · create O · update O (`read`) | read O+`all` · create O | read/write A |
| `announcements` | read (by audience) | read (by audience) | write A |
| `activityLogs` | — | — | read A · write fn |
| `supportTickets` | read/write O | read/write O | read/write A |
| `settings` | read A | read A | write A |
| `analytics` | — (or scoped) | read O-scope | read A · write fn |
| `otpRequests` / `mail` | — | — | **fn only** (no client) |

## Per-collection policy notes

- **students / academicDetails / professionalDetails / documents** — full owner CRUD; `role` may never be elevated by the owner (`roleImmutable()`). Recruiters/admins never read these directly; recruiters see the **application snapshot**, admins have read-all for oversight.
- **placementDrives** — student read requires `status == 'published'`; recruiters read their own drives in any status; **publishing** (draft→published) is admin-only; recruiter create is allowed but a drive stays `draft` until admin approval.
- **applications** — create requires `studentId == auth.uid` **and** `status == 'pending'` (prevents self-granting a favorable status). Updates (status transitions) are restricted to the owning recruiter/admin, executed server-side to also append the timeline and emit notifications.
- **notifications** — readable when `recipientId == uid` or `'all'`; a student may create only self-addressed notifications and may mark **only their own** as read (broadcasts are shared and never per-user-mutated); broadcast fan-out is admin/function only.
- **offers** — a student may transition **their own** offer to `accepted`/`declined` but cannot create or alter package/terms.
- **otpRequests / mail** — categorically `false` for all clients; only the Admin SDK (Cloud Functions) touches them.

## Query-safety requirement

Rules evaluate per-document, but **list queries must be constrained so they can only return permitted documents**, or Firestore rejects them. Enforced query shapes:

| Query | Constraint that satisfies rules |
|---|---|
| student drive feed | `where('status','==','published')` |
| my applications | `where('studentId','==', uid)` |
| my notifications | `where('recipientId','in',[uid,'all'])` |
| recruiter pipeline | `where('driveId','==', ownDriveId)` (+ ownership proven by claim/company) |

## Write-validation examples (policy, not code)

- `students` create/update: assert `role == 'student'` (or absent), required personal fields present, `completionPercentage` in `0..100`.
- `applications` create: `studentId == auth.uid`, `status == 'pending'`, `driveId` references an existing published drive.
- `placementDrives` publish: only admins may set `status` to `'published'`; `lastDate <= driveDate`.

## Storage Rules (summary)

- Objects live under `students/{uid}/…`; **read/write only by owner**; admins/authorized readers via signed access.
- Enforce `contentType` (`application/pdf` or `image/*`) and size (≤ 10 MB) on write.
- Photos are **not** stored here (Cloudinary) — Storage is documents-only, matching the locked storage split.

## Testing strategy

- Firebase **Rules unit tests** (`@firebase/rules-unit-testing`) against the emulator for each matrix cell (allow + deny cases).
- Negative tests: role elevation attempts, cross-user reads, unpublished-drive reads, illegal status transitions, OTP/mail access.
- CI gate: rules tests must pass before deploy.
