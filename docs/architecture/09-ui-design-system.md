# 09 — UI Design System (SAITM)

The design system is **locked** to SAITM branding (see `CLAUDE.md`). Tokens are implemented as literal-hex Tailwind theme values (exact on-brand, opacity-modifier friendly) plus a few CSS variables.

## Color tokens

| Token | Hex | Usage |
|---|---|---|
| **Primary — Navy** | `#18305F` | navbar, sidebar, headings, primary buttons, icons |
| **Primary light** | `#23488A` | gradient end, hover |
| **Secondary — Gold** | `#D8AE3E` | CTAs, active items, highlights, badges, progress |
| **Gold light** | `#E7C15C` | gradient end |
| Background | `#F8F7F4` | app background |
| Section | `#F5F6F8` | section blocks / muted surfaces |
| Card | `#FFFFFF` | surfaces |
| Heading text | `#172554` | headings |
| Foreground text | `#374151` | body |
| Muted text | `#6B7280` | secondary |
| Border / Input | `#E5E7EB` | lines, fields |
| Ring | `#18305F` | focus |
| Success | `#22C55E` | success |
| Warning | `#F59E0B` | warning |
| Error / Destructive | `#EF4444` | error |
| Info | `#3B82F6` | info |
| Primary gradient | `#18305F → #23488A` | hero/navy surfaces |
| Gold gradient | `#D8AE3E → #E7C15C` | gold CTAs/accents |

**Rule:** never introduce an off-palette color; reference semantic tokens (`bg-primary`, `text-heading`, `border-border`, `bg-gold-gradient`), never raw hex in JSX.

## Status color mapping (reserved)

Application statuses use reserved status colors, **always paired with an icon + label** (never color-alone), with a legend in charts:

| Status | Color | Badge |
|---|---|---|
| Pending | `#6B7280` | secondary |
| Under Review | `#3B82F6` | info |
| Shortlisted | `#D8AE3E` | gold |
| Interview Scheduled | `#18305F` | primary |
| Selected | `#22C55E` | success |
| Offer Released | `#059669` | success |
| Rejected | `#EF4444` | error |

## Typography

- **Family:** Inter (`--font-sans`), system fallback. Headings tight tracking, semibold+.
- **Scale (Tailwind):** display `text-2xl/28px` · h1 `text-xl` · h2 `text-lg` · body `text-sm` · meta `text-xs`.
- **Weights:** 400 body, 500 medium (labels/nav), 600 semibold (headings), 700 bold (numbers/hero).
- Headings use `text-heading`; body `text-foreground`; secondary `text-muted-foreground`.

## Spacing & layout

- 4px base scale (Tailwind default). Card padding `p-5`/`p-6`; section gaps `gap-6`; page container `max-w-6xl`.
- Generous, consistent rhythm ("premium spacing"); avoid dense grids.

## Radius, shadows, elevation

| Token | Value |
|---|---|
| Radius sm/md/lg/xl/2xl | 0.375 / 0.5 / 0.75 / 1 / 1.25 rem |
| Shadow `soft` | subtle 2-layer navy-tinted |
| Shadow `card` | elevated 2-layer |
| Shadow `gold` | gold glow for CTAs |

Cards: `rounded-2xl border border-border bg-card shadow-card`. Hover lifts (`-translate-y-0.5`, shadow upgrade).

## Iconography

- **lucide-react** only; 16–20px in UI, 24–28px for feature/empty states; `1.5–2px` stroke feel. Icons inherit token colors.

## Motion (Framer Motion)

- **Purposeful, subtle.** Step transitions (wizard, auth) 0.25s ease-out; sidebar collapse spring; active-nav slide via `layoutId`; dialog/dropdown fade+zoom.
- Respect `prefers-reduced-motion` 🟡.

## Component styling standards

- **Buttons** — see [08](./08-component-architecture.md); gold gradient for primary CTAs, navy for standard primary.
- **Forms** — 44px control height, clear labels with required markers, inline error text in `text-error`, focus ring `ring-ring/25`.
- **Tables** — zebra-free, hairline borders, sticky header, right-aligned numerics, row hover `bg-section`.
- **Badges** — pill, tinted background + readable foreground per status.
- **Alerts/Toasts** — sonner, top-center, bordered card with status tint.

## State patterns

| State | Pattern |
|---|---|
| **Loading** | `Skeleton` blocks matching final layout; spinners only for actions |
| **Empty** | `EmptyState` (icon + title + description + optional CTA) |
| **Error** | inline error card or route `error.tsx`; friendly copy + retry |
| **Success** | toast + optimistic UI where safe |
| **Disabled** | reduced opacity + `not-allowed`; explain *why* (e.g., ineligible reasons) rather than silently disabling |

## Accessibility

- WCAG AA contrast for text on tokens; focus-visible rings everywhere; semantic landmarks; ARIA on interactive widgets; keyboard paths for menus, dialogs, OTP input; labels tied to controls.

## Responsiveness

- Breakpoints: mobile → `sm` → `md` → `lg` (sidebar appears) → `xl` (right panel) → `2xl`.
- Wide content (tables, charts) scrolls within its own container; the page never scrolls horizontally.
- Mobile: drawer nav, stacked cards instead of wide tables.
