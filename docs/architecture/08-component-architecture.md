# 08 — Component Architecture

Components are organized by **reuse scope**, not by page. A component lives in a feature until a second feature needs it, then it is promoted to `components/`.

```
Feature component (features/*/components) ──promote──▶ Shared component (components/*) ──▶ UI primitive (components/ui)
```

## Layers

| Layer | Location | Owns | Examples |
|---|---|---|---|
| **UI primitives** | `components/ui` | shadcn/ui atoms; stateless, brand-tokenized | Button, Input, Label, Card, Dialog, DropdownMenu, Select, RadioGroup, Progress, Badge, Avatar, Textarea, Skeleton, Separator, Sonner |
| **Shared components** | `components/*` | cross-feature molecules/organisms | layout (Sidebar, Topbar, RightPanel), forms, tables, charts, cards, dialogs, modals, dashboard widgets, shared (EmptyState, SectionCard, FullScreenLoader, RequireAuth) |
| **Feature components** | `features/*/components` | domain UI, may hold data hooks | DriveCard, ApplyDialog, StatusTimeline, ApplicationStats, NotificationBell, OnboardingWizard |
| **Compositions** | `features/dashboard`, pages | assemble features into a screen | DashboardHome |

Legend: ✅ built · 🟡 planned.

## Primitive contracts (component API discipline)

- **Presentational & controlled.** Primitives take data via props; no data-fetching.
- **`forwardRef` + `className` passthrough** with `cn()` merge, so callers can extend styling.
- **`cva` variants** for visual variants (e.g., Button `default|gold|outline|secondary|ghost|destructive|link`).
- **Accessibility built in.** Correct roles, `aria-*`, focus-visible rings, keyboard support (Radix under the hood for interactive primitives).

## Reusable component catalog

### Buttons ✅
Variants (default/gold CTA/outline/secondary/ghost/destructive/link), sizes (sm/default/lg/icon), `asChild` for links, loading state via spinner + disabled.

### Inputs & Forms ✅
`Input`, `Textarea`, `Select`, `RadioGroup`, `Label`, plus React-Hook-Form wrappers (`Form`, `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage`). Field-level Zod validation, `aria-invalid`, error text. Specialized: `TagInput`, `PhotoUpload` (Cloudinary), `FileUpload`/`MultiFileUpload` (Firebase Storage, progress).

### Cards ✅ / 🟡
`Card` primitive + `SectionCard` (titled surface). Domain cards: `DriveCard` ✅, `ApplicationRow` ✅, `CompanyCard` 🟡, `CandidateCard` 🟡, `ProfileCard` 🟡, `StatTile` ✅, `KpiCard` 🟡.

### Tables 🟡
`DataTable` (headless, column defs, sort, pagination, row actions, sticky header) for admin/recruiter lists (students, applicants, drives). Responsive: collapses to stacked cards on mobile.

### Charts ✅ / 🟡
Brand-tokenized, accessible (legend + labels, never color-alone). `ApplicationStats` donut ✅; planned `BarChart`, `LineChart`, `DonutChart`, `Sparkline`, `KpiRow` for analytics — status colors are reserved and always paired with a label/icon (see [09](./09-ui-design-system.md)).

### Dialogs & Modals ✅
`Dialog` primitive; domain dialogs: `ApplyDialog` (gate→eligibility→confirm→success) ✅, `DriveDetailsDialog` ✅, `ConfirmDialog` 🟡, `ScheduleInterviewDialog` 🟡.

### Navigation & Chrome ✅ / 🟡
`AppSidebar` (collapsible, grouped, animated active), `AppTopbar` (search, bell, quick actions, avatar), `RightPanel`, `Breadcrumbs` 🟡, `NotificationBell` ✅, `NotificationItem` ✅.

### Feedback & States ✅
`Toaster` (sonner), `Skeleton`, `EmptyState`, error boundaries, `Badge`/`StatusBadge`, `Progress`, `StatusTimeline`.

### Dashboard widgets ✅ / 🟡
`WelcomeHero`, `CompletionCard`, `StatTiles`, `ApplicationStats` ✅; `UpcomingInterviews`, `AnnouncementsWidget`, `ActivityFeed`, `PlacementFunnel`, `PackageDistribution` 🟡.

## Composition rules

1. **Import features via their barrel** (`@/features/jobs`) — never internal paths.
2. **Dumb components stay dumb** — data comes from hooks in feature components or pages.
3. **One source of truth for status/branding** — `STATUS_META`, palette tokens; no ad-hoc colors.
4. **Skeleton parity** — every data widget ships a matching `Skeleton` for its loading state.
5. **Empty/error parity** — every list has an `EmptyState` and inherits the route `error.tsx` boundary.

## Testing

- **Unit:** primitives and pure helpers (eligibility, completion, formatters).
- **Component:** feature components with mocked hooks (RTL).
- **Integration/E2E:** critical flows (login→onboarding→apply) via Playwright against the emulator.
