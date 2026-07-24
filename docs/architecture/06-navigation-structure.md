# 06 — Navigation Structure

Each role uses the **same shell** (collapsible sidebar + topbar + optional right utility panel) parameterized by a role-specific navigation config. The shell components are shared (`components/layout/app-sidebar`, `app-topbar`, `right-panel`); only the nav items and guards differ.

## Shell anatomy

```
┌──────────────────────────────────────────────────────────┐
│  Topbar: [☰] Search …            [completion] 🔔  ▾avatar │
├───────────┬──────────────────────────────────────────────┤
│ Sidebar   │  Breadcrumb: Home / Section / Page            │
│ (grouped, │  ┌────────────────────────┐  ┌─────────────┐ │
│ collapsible│ │  Main content area      │  │ Right panel │ │
│ active     │ │                         │  │ (xl only)   │ │
│ highlight) │ └────────────────────────┘  └─────────────┘ │
└───────────┴──────────────────────────────────────────────┘
```

### Topbar (all roles)
- **Search** — global search routed to the role's primary list (students → drives; recruiter → candidates; admin → students).
- **Notification bell** — unread badge + dropdown preview (recent 6) + "view all". ✅
- **Profile completion %** (student) / **approval status** (recruiter) pill.
- **Quick actions** menu — role-specific shortcuts.
- **Avatar menu** — profile, settings, logout. ✅
- **Dark/Light** toggle — optional; omitted in v1 to preserve brand consistency.

### Sidebar (all roles)
- Grouped nav (Overview / domain / Account), **collapsible** (persisted), animated active highlight, mobile drawer. ✅
- Icons via lucide-react; active item uses a gold accent + sliding indicator.

### Breadcrumb
- Derived from the route segment path; last crumb is the current page (non-link). 🟡

### Right utility panel (xl+)
- Contextual: profile strength + recent activity (student); pending approvals (admin); today's interviews (recruiter). Hidden on the primary dashboard to avoid duplication. ✅ (student)

---

## Student navigation ✅

| Group | Items |
|---|---|
| Overview | Dashboard · My Profile |
| Placements | Placement Drives · Companies · My Applications · Interview Schedule · Resume · Documents · Skills & Certifications |
| Account | Notifications · Announcements · Settings · Help & Support |
| Footer | Logout · Collapse |

**Quick actions:** Browse Drives · My Applications · Update Resume · Complete Profile.

## Recruiter navigation 🟡

| Group | Items |
|---|---|
| Overview | Dashboard · Company Profile |
| Hiring | Job Posts / Drives · Post a Job · Candidate Search · Shortlists · Interviews · Offers |
| Account | Notifications · Settings · Help |

**Quick actions:** Post a Job · Search Candidates · Schedule Interview.
**Gate:** unapproved recruiters see only an "Awaiting approval" screen.

## Admin / TPO navigation 🟡

| Group | Items |
|---|---|
| Overview | Dashboard · Analytics · Reports |
| People | Students · Recruiters · Companies · User Management |
| Placements | Placement Drives · Applications · Interviews · Offers |
| Comms | Announcements · Notifications |
| System | Support Tickets · Activity Logs · Settings |

**Quick actions:** Create Drive · Approve Recruiters · New Announcement · Export Report.

---

## Notifications surface
- Bell dropdown (recent) → full `/notifications` page (filter/mark-read).
- Types carry an icon + tint (drive, interview, selection, announcement, application, document, system).
- Unread count = personal unread only; broadcasts shown but not counted. ✅
- Push (FCM) mirrors critical in-app notifications. 🟡

## Settings surface
- Student: profile edit (→ wizard), notification preferences, privacy, connected links, logout. ✅ partial
- Recruiter: company profile, team, notification preferences. 🟡
- Admin: placement windows, eligibility defaults, feature flags, roles. 🟡

## Search behavior
- Debounced input; submits to the role's list route with `?q=`; that page filters client-side (v1) and can move to server-side/Algolia later. 🔵
