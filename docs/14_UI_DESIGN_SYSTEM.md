# 14 — UI Design System

Locked to SAITM branding. Tokens are **literal-hex Tailwind theme values** (exact on-brand, opacity-modifier friendly), defined in [`tailwind.config.ts`](../Frontend/tailwind.config.ts); base layer in [`styles/globals.css`](../Frontend/styles/globals.css).

## Color tokens (actual)

| Tailwind token | Hex | Usage |
|----------------|-----|-------|
| `primary` (Navy) | `#18305F` | sidebar, headings, primary buttons, icons |
| `primary-light` | `#23488A` | gradient end, hover |
| `gold` (Secondary) | `#D8AE3E` | CTAs, active items, badges, progress |
| `gold-light` | `#E7C15C` | gradient end |
| `background` | `#F8F7F4` | app background |
| `section` | `#F5F6F8` | muted surfaces |
| `card` / `card-foreground` | `#FFFFFF` / `#374151` | surfaces / body text |
| `heading` | `#172554` | headings |
| `foreground` | `#374151` | body |
| `muted-foreground` | `#6B7280` | secondary text |
| `border` / `input` / `ring` | `#E5E7EB` / `#E5E7EB` / `#18305F` | lines / fields / focus |
| `success` `warning` `error/destructive` `info` | `#22C55E` `#F59E0B` `#EF4444` `#3B82F6` | status |

Gradients (utility classes in `globals.css`): `.bg-primary-gradient` (`#18305F→#23488A`), `.bg-gold-gradient` (`#D8AE3E→#E7C15C`). **Rule:** reference tokens (`bg-primary`, `text-heading`, `border-border`), never raw hex in JSX.

## Status colors (reserved)

Application statuses use reserved colors, **always with an icon + label** (see [11](./11_APPLICATION_FLOW.md)). Defined in `features/applications/lib/status-meta.ts`.

## Typography

- **Font:** Inter via `next/font/google` (`--font-sans`), applied in `app/layout.tsx`; system fallback.
- Scale (Tailwind): hero `text-2xl/28px` · h1 `text-xl` · h2 `text-lg` · body `text-sm` · meta `text-xs`. Weights 400/500/600/700. Headings `text-heading`, tight tracking.

## Spacing, radius, shadows

- 4px base scale; card padding `p-5`/`p-6`; section gaps `gap-6`; page container `max-w-6xl`.
- Radius: `sm .375` / `md .5` / `lg .75` / `xl 1` / `2xl 1.25` rem (`--radius: 0.75rem`).
- Shadows (config): `soft`, `card`, `gold` (navy/gold-tinted). Cards use `rounded-2xl border border-border bg-card shadow-card` with hover lift.

## Motion

Framer Motion, subtle/purposeful: auth & wizard step transitions (~0.25s ease-out), sidebar collapse spring, active-nav slide via `layoutId`, dialog/dropdown fade+zoom.

## State patterns (implemented components)

| State | Pattern | Component |
|-------|---------|-----------|
| Loading | skeleton blocks / spinners | `Skeleton`, `FullScreenLoader` |
| Empty | icon + title + desc + CTA | `EmptyState` |
| Error | branded fallback + retry | `app/error.tsx`, `global-error.tsx` |
| Success | toast + optimistic UI | `sonner` (`Toaster`) |
| Disabled | reduced opacity + explain *why* | e.g., ineligible reasons in `ApplyDialog` |

## Accessibility

WCAG-AA token contrast; `:focus-visible` ring in `globals.css`; ARIA on OTP input, switches, dialogs (Radix); labels tied to controls (RHF `FormLabel`/`FormControl`); keyboard paths for menus/dialogs.

## Responsiveness

Breakpoints: mobile → `sm` → `md` → `lg` (sidebar appears) → `xl` (right panel) → `2xl`. Mobile drawer nav; wide content scrolls within its own container; the page body never scrolls horizontally.

## Theming

Light theme only (locked SAITM identity). Dark mode is intentionally **Not Yet Implemented** to preserve brand consistency (`darkMode: ["class"]` is configured but unused).
