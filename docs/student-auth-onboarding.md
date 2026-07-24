# Student Authentication & Onboarding

The first shipped module of the SAITM Placement Portal. Covers college-email OTP
sign-in and a 4-step profile onboarding wizard.

## Architecture at a glance

```
Login (email)  ─▶  sendOtp (Cloud Fn)  ─▶  email with 6-digit code
   │                                          │
   ▼                                          ▼
Enter OTP   ─▶  verifyOtp (Cloud Fn)  ─▶  custom token (role: student)
   │                                          │
   ▼                                          ▼
signInWithCustomToken            students/{uid} seeded (profileCompleted:false)
   │
   ▼
profileCompleted? ── no ─▶ /onboarding (4-step wizard) ─▶ save ─▶ /dashboard
                   └─ yes ─▶ /dashboard
```

**Why Cloud Functions?** Firebase Auth has no native "email OTP" (its passwordless
email method is a magic *link*). So `sendOtp`/`verifyOtp` generate a hashed,
rate-limited 6-digit code and mint a **custom token** on success — the standard
enterprise pattern for email OTP on Firebase.

## Key files

| Concern | Path |
|--------|------|
| OTP UI (email + code steps) | `Frontend/features/auth/` |
| Onboarding wizard + steps | `Frontend/features/onboarding/` |
| Domain rule (`@saitm.ac.in`) | `Frontend/lib/auth/email-domain.ts` |
| Firebase client | `Frontend/lib/firebase/client.ts` |
| Auth state provider | `Frontend/providers/auth-provider.tsx` |
| Cloud Functions | `Backend/functions/src/callable/*` |
| Security rules | `Backend/firestore.rules`, `Backend/storage.rules` |

## Firestore data model (keyed by Firebase UID)

- `students/{uid}` — identity + personal details + `profileCompleted`, `completionPercentage`, `sections`
- `academicDetails/{uid}` — Step 2
- `professionalDetails/{uid}` — Step 3
- `documents/{uid}` — Step 4 (file URLs)
- `otpRequests/{hash}` — server-only OTP records
- `mail/{id}` — outbound email queue (Trigger Email extension)

## Storage routing (per locked rule in CLAUDE.md)

- **Cloudinary** (images): profile photo, passport photo
- **Firebase Storage** (documents): resume, 10th/12th/semester marksheets, certificates

## Local setup

1. **Create a Firebase project** and a Web App. Enable Firestore, Storage, and
   Authentication. (No sign-in provider toggle is needed — we use custom tokens.)
2. **Fill `Frontend/.env.local`** with the web config values (see `.env.example`).
3. **Cloudinary**: create an *unsigned* upload preset; set
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
4. **Email delivery**: install the Firebase **"Trigger Email from Firestore"**
   extension (collection: `mail`), or replace the transport in
   `Backend/functions/src/lib/email.ts` with SendGrid/Resend/SMTP.
5. **Deploy backend**: from `Backend/`
   ```bash
   firebase deploy --only functions,firestore:rules,storage
   ```
6. **Run frontend**: from `Frontend/`
   ```bash
   npm install && npm run dev
   ```

### Testing without email (emulator)

```bash
cd Backend && firebase emulators:start
```
Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `Frontend/.env.local`. The OTP is
never returned to the client — configure SMTP in `backend/functions/.env` so the
code reaches a real inbox, even when running against the emulator.

## Security notes

- `firestore.rules` limit every student to their own `{uid}` documents and block
  role elevation; `otpRequests`/`mail` are server-only.
- OTPs are stored **hashed** (SHA-256 + pepper), expire in 10 min, are rate-limited
  (45s cooldown, 5/hour), and allow max 5 verify attempts.
- Set a strong `OTP_PEPPER` env var on the functions in production.
