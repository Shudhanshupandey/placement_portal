# 16 — Firestore Collections (Reference)

Complete reference for **implemented** collections. Fields reflect what the code writes. Rules are in `Backend/firestore.rules`. Legend for writers: **fn** = Cloud Functions (Admin SDK), **self** = the owning user, **admin** = admin.

## `users/{uid}` — canonical identity

| Field | Type | Notes |
|-------|------|-------|
| `uid`, `email`, `role` | string | role ∈ `student\|recruiter\|admin` (mirrors claim) |
| `profileCompleted` | boolean | |
| `verificationStatus` | string | students: `unverified\|pending\|verified\|rejected` |
| `approvalStatus` | string? | recruiters: `pending\|approved\|rejected` |
| `isActive` | boolean | recruiters start `false` until approved |
| `displayName`, `photoUrl`, `rejectionReason` | string? | |
| `createdAt`, `updatedAt`, `lastLogin` | timestamp | server |

**Writers:** fn (create), self (limited update — no role/isActive/self-verify), admin.
**Rules:** read own/admin; student update restricted.
**Example**
```json
{ "uid":"abc123","email":"student@saitm.ac.in","role":"student",
  "profileCompleted":true,"verificationStatus":"pending","isActive":true }
```

## `students/{uid}` — student personal profile + onboarding meta

Fields: `uid, email, role:'student'`, `fullName, gender, dateOfBirth, mobileNumber, alternateMobileNumber?, aadhaarNumber?, category, bloodGroup?, address, city, state, pincode, photoUrl?`, `profileCompleted, completionPercentage, sections{personal,academic,professional,documents}`, `notificationPrefs?, recruiterVisible?`, `createdAt, updatedAt`.
**Writers:** self (+ verifyOtp seed). **Rules:** owner CRUD (role immutable), admin read.

## `academicDetails/{uid}`

`enrollmentNumber, universityRollNumber, course, branch, currentYear, currentSemester, section, admissionYear, expectedPassingYear, tenthPercentage, twelfthPercentage, diplomaPercentage, currentCgpa, activeBacklogs, totalBacklogsHistory, academicGap, academicStatus` (all strings). Powers the **eligibility engine**. **Rules:** owner CRUD; admin read.

## `professionalDetails/{uid}`

`skills[], programmingLanguages[], frameworks[], technologies[], certifications[]`, `projects[]{title,description?,link?}`, `internshipExperience, workExperience`, `github, linkedin, portfolio, leetcode, hackerrank, codechef, codeforces`. **Rules:** owner CRUD; admin read.

## `documents/{uid}`

`resumeUrl, passportPhotoUrl, tenthMarksheetUrl, twelfthMarksheetUrl` (single), `semesterMarksheetUrls[], certificateUrls[]`. Docs → Firebase Storage; passport photo → Cloudinary. **Rules:** owner CRUD; admin read.

## `recruiters/{uid}`

`uid, email, fullName, designation, phone, companyName, companyWebsite, emailVerified, approvalStatus, createdAt` (+ `approvedBy, approvedAt, rejectionReason` on review). **Writers:** `registerRecruiter` (create), `approveRecruiter` (admin). **Rules:** read own/admin; write admin.

## `admins/{uid}`

`uid, email, fullName, level (admin\|super_admin), permissions[], createdAt`. **Writers:** `seed-admin.mjs` (Admin SDK). **Rules:** read own/admin; write **denied**.

## `placementDrives/{driveId}` (auto id)

| Field | Type |
|-------|------|
| `companyName, companyLogoUrl?, role, jobType?, packageLabel, location, description?` | string |
| `skills[], openings?` | array/number |
| `eligibility` | map `{courses[],branches[],minYear,minCgpa,maxActiveBacklogs,allowBacklogs,passingYears[],requiredSkills[]}` |
| `status` | `draft\|published\|closed` |
| `lastDate, driveDate, createdAt` | timestamp |

**Writers:** admin/recruiter via Admin SDK / `seed-demo.mjs`. **Rules:** read if signed-in **and** `status=='published'`; client write denied.
**Example**
```json
{ "companyName":"Google","role":"Software Engineer","packageLabel":"45 LPA",
  "location":"Bengaluru","status":"published",
  "eligibility":{"courses":["B.Tech"],"branches":["Computer Science & Engineering","Information Technology"],
    "minCgpa":8.0,"allowBacklogs":false,"requiredSkills":["DSA","System Design"],"passingYears":[2026]} }
```

## `applications/{studentId}_{driveId}` (deterministic id)

| Field | Type |
|-------|------|
| `id, studentId, driveId` | string |
| `companyName, role, companyLogoUrl?, packageLabel, location` | string (drive snapshot) |
| `status` | `pending\|under_review\|shortlisted\|interview_scheduled\|selected\|rejected\|offer_released` |
| `appliedAt, updatedAt` | timestamp |
| `timeline[]` | `{status, atMs, note?}` |
| `applicant` | map `{fullName,email,phone?,course?,branch?,currentYear?,cgpa?,resumeUrl?,skills?,photoUrl?}` |

**Writers:** self (create only, `status=='pending'`); recruiter/admin advance status via Admin SDK. **Rules:** read own (+ authorized later); create by owner; update/delete **denied** to clients.
**Indexes:** none required today (query is `studentId==uid`, sorted client-side). Composite `(driveId,status)` planned for the recruiter pipeline.

## `notifications/{id}` (auto id)

`recipientId (uid or 'all'), type (drive|interview|selection|announcement|application|document|system), title, message, link?, read, createdAt`. **Writers:** fn + self (own). **Rules:** read own/broadcast; create own; update own (mark read). Query: `recipientId in [uid,'all']`, sorted client-side. See [12](./12_NOTIFICATION_SYSTEM.md).

## `otpRequests/{sha256(email)}` — server only

`hashedOtp, expiresAt, attempts, lastSentAt, windowStart, sendCount`. **Writers:** fn only. **Rules:** **no client access**.

## `mail/{id}` — server only (email queue)

`to, message:{subject, html}, createdAt`. Consumed by the "Trigger Email" extension. **Rules:** **no client access**.

## Indexing summary

`Backend/firestore.indexes.json` currently declares **no composite indexes** — all live queries are single-field (auto-indexed) and sorted in JS. Composite indexes will be added with recruiter/admin queries (`applications(driveId,status)`, `placementDrives(status,lastDate)`).

## Not Yet Implemented collections

`interviews`, `offers`, `companies`, dedicated `announcements`, `certificates`, `activityLogs`, `supportTickets`, `settings`, `analytics` — designed in [`architecture/02-database-design.md`](./architecture/02-database-design.md), not created by current code.
