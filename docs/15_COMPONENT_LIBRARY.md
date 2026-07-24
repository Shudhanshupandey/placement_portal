# 15 — Component Library

Every reusable component that exists, by layer. Import primitives from `@/components/ui/*`, shared from `@/components/*`, and feature components via their **feature barrel** (`@/features/<name>`).

## UI primitives (`components/ui/`) — 17

shadcn-style, built on Radix where interactive. All accept `className` (merged via `cn()`), use `forwardRef`, and are brand-tokenized.

| Component | Exports | Radix dep | Key props / notes |
|-----------|---------|-----------|-------------------|
| `button` | `Button`, `buttonVariants` | react-slot | `variant` (default·gold·outline·secondary·ghost·destructive·link), `size` (sm·default·lg·icon), `asChild` |
| `input` | `Input` | — | native input; `aria-[invalid]` styling |
| `password-input` | `PasswordInput` | — | show/hide toggle, lock icon |
| `textarea` | `Textarea` | — | |
| `label` | `Label` | react-label | |
| `card` | `Card`,`CardHeader`,`CardTitle`,`CardDescription`,`CardContent`,`CardFooter` | — | surface primitives |
| `badge` | `Badge`, `badgeVariants` | — | `variant` (default·gold·secondary·success·warning·error·info·outline) |
| `progress` | `Progress` | react-progress | `value`, `indicatorClassName` (gold gradient) |
| `select` | `Select`,`SelectTrigger`,`SelectContent`,`SelectItem`,`SelectValue`,`SelectGroup` | react-select | |
| `radio-group` | `RadioGroup`,`RadioGroupItem` | react-radio-group | |
| `avatar` | `Avatar`,`AvatarImage`,`AvatarFallback` | react-avatar | |
| `dialog` | `Dialog`,`DialogTrigger`,`DialogContent`,`DialogHeader`,`DialogFooter`,`DialogTitle`,`DialogDescription`,`DialogClose` | react-dialog | overlay blur, close button |
| `dropdown-menu` | `DropdownMenu`,`…Trigger`,`…Content`,`…Item`,`…Label`,`…Separator`,`…Group`,`…CheckboxItem` | react-dropdown-menu | `Item` supports `destructive`, `inset` |
| `form` | `Form`,`FormField`,`FormItem`,`FormLabel`,`FormControl`,`FormDescription`,`FormMessage`,`useFormField` | react-slot | RHF wrappers; `FormLabel` has `required` |
| `skeleton` | `Skeleton` | — | loading placeholder |
| `separator` | `Separator` | — | ⚠️ currently unused (see audit) |
| `sonner` | `Toaster` | — | brand-styled toaster (mounted in `AppProviders`) |

## Layout components (`components/layout/`)

| Component | Purpose | Key props / hooks |
|-----------|---------|-------------------|
| `AppSidebar` | collapsible grouped sidebar, animated active item, mobile variant | `collapsed`, `onToggle`, `onNavigate`, `onSignOut`, `variant`; uses `usePathname`, `STUDENT_NAV` |
| `AppTopbar` | search, notification bell, quick actions, completion ring, avatar menu | `onOpenMobile`, `onSignOut`; uses `useAuth`, `NotificationBell` |
| `RightPanel` | `xl+` contextual panel (profile strength + recent activity) | uses `useAuth`, `useNotifications` |
| `AuthShell` | branded split-screen wrapper for all auth pages | `portalLabel`, `headline`, `subline`, `highlights` |

## Shared components (`components/shared/`)

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `RequireAuth` | client auth/role/completion/approval gate | `role?`, `requireComplete?`, `requireApproved?` |
| `RequireRole` | role gate (wraps `RequireAuth`) | `role`, `requireApproved?` |
| `FullScreenLoader` | full-page spinner | `label?` |
| `EmptyState` | icon + title + description + optional action | `icon`, `title`, `description?`, `action?` |
| `SectionCard` | titled surface used across the dashboard | `title`, `description?`, `action?`, `bodyClassName?` |

## Feature components (selected)

| Feature | Components | Notes |
|---------|-----------|-------|
| `auth` | `AuthCard`, `EmailStep`, `OtpStep`, `OtpInput`, `RecruiterLoginForm`, `RecruiterRegisterForm`, `AdminLoginForm`, `ForgotPasswordForm`, `WaitingForApproval`, `VerifyEmailNotice` | 6-box OTP with paste; RHF+Zod forms |
| `onboarding` | `OnboardingWizard`, `StepIndicator`, `WizardNav`, step forms, `TagInput`, `PhotoUpload`, `FileUpload`/`MultiFileUpload` | photo→Cloudinary, docs→Storage w/ progress |
| `placement-drives` | `DriveCard` (+ details dialog) | `renderApply` prop injects `ApplyButton` |
| `applications` | `ApplyButton`, `ApplyDialog`, `ApplicationRow`, `ApplicationStats`, `StatusBadge`, `StatusTimeline` | donut is hand-built SVG |
| `notifications` | `NotificationBell`, `NotificationItem` | |
| `dashboard` | `DashboardHome`, `WelcomeHero`, `StatTiles`, `CompletionCard` | composition of other features |

## Component contract

1. Presentational primitives take data via props; no data fetching.
2. `forwardRef` + `className` passthrough merged with `cn()`.
3. `cva` for visual variants (Button, Badge).
4. Accessibility built in (Radix roles/ARIA, focus-visible).
5. Feature components may use hooks; **import features via barrels only**.

## Not Yet Implemented (designed, common enterprise components)

`DataTable` (sortable/paginated) · `Breadcrumbs` · `ConfirmDialog` · chart components beyond the applications donut · `Tabs` primitive (applications page uses button filters instead) · `Tooltip`.
