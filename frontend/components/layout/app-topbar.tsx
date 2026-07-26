"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ChevronDown,
  Zap,
  Briefcase,
  FileText,
  FileUser,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { STUDENT_NAV } from "@/constants/student-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/features/notifications";

function initials(name?: string, email?: string) {
  if (name) return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (email?.[0] ?? "S").toUpperCase();
}

const QUICK_ACTIONS = [
  { label: "Browse Placement Drives", href: ROUTES.student.placementDrives, icon: Briefcase },
  { label: "My Applications", href: ROUTES.student.applications, icon: FileText },
  { label: "Update Resume", href: ROUTES.student.resume, icon: FileUser },
  { label: "Complete Profile", href: ROUTES.onboarding, icon: UserCog },
];

interface AppTopbarProps {
  onOpenMobile: () => void;
  mobileOpen: boolean;
  onSignOut: () => void;
}

export function AppTopbar({ onOpenMobile, mobileOpen, onSignOut }: AppTopbarProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pct = profile?.completionPercentage ?? 0;

  // Phones have no room for the sidebar, so the topbar carries the "where am I"
  // signal instead — without it the mobile header is an anonymous icon strip.
  const pageTitle = React.useMemo(() => {
    const match = STUDENT_NAV.filter(
      (i) => pathname === i.href || pathname.startsWith(`${i.href}/`)
    ).sort((a, b) => b.href.length - a.href.length)[0];
    return match?.label ?? "Student Portal";
  }, [pathname]);

  const runSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`${ROUTES.student.placementDrives}?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  return (
    <header className="page-gutter sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/90 backdrop-blur-md sm:gap-3">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-haspopup="dialog"
        className="-ml-2 inline-flex h-touch w-touch shrink-0 items-center justify-center rounded-lg text-heading transition-colors hover:bg-section lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Mobile: page title. Desktop: search. */}
      <h1 className="min-w-0 flex-1 truncate text-base font-bold text-heading sm:hidden">
        {pageTitle}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(q);
        }}
        className="relative hidden max-w-sm flex-1 sm:block"
        role="search"
      >
        <label htmlFor="portal-search" className="sr-only">
          Search drives, companies and roles
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="portal-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search drives, companies, roles…"
          className="h-11 w-full rounded-lg border border-border bg-section pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/25"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Mobile search — a full-width input never fits beside the title, so it
            opens as a sheet rather than being dropped from the phone UI. */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="inline-flex h-touch w-touch items-center justify-center rounded-lg text-heading transition-colors hover:bg-section sm:hidden"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Profile completion pill */}
        <Link
          href={pct >= 100 ? ROUTES.student.profile : ROUTES.onboarding}
          className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:bg-section md:flex"
        >
          <span className="relative flex h-7 w-7 items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 36 36" className="h-7 w-7 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" className="stroke-border" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className="stroke-gold"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
              />
            </svg>
          </span>
          <span className="text-xs font-semibold text-heading">{pct}%</span>
          <span className="sr-only">profile complete — open your profile</span>
        </Link>

        {/* Quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden lg:inline-flex">
              <Zap className="text-gold" aria-hidden="true" /> Quick actions
              <ChevronDown className="opacity-60" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem key={label} asChild>
                <Link href={href}>
                  <Icon /> {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationBell />

        {/* Avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex h-touch items-center gap-1.5 rounded-full px-0.5 transition-colors hover:bg-section focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <Avatar className="h-9 w-9">
                {profile?.photoUrl && <AvatarImage src={profile.photoUrl} alt="" />}
                <AvatarFallback>{initials(profile?.fullName, user?.email ?? undefined)}</AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar className="h-10 w-10">
                {profile?.photoUrl && <AvatarImage src={profile.photoUrl} alt="" />}
                <AvatarFallback>{initials(profile?.fullName, user?.email ?? undefined)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-heading">
                  {profile?.fullName ?? "Student"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.student.profile}>
                <UserCog /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.student.settings}>
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={onSignOut}>
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile search sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent
          side="top"
          title="Search"
          description="Search placement drives, companies and roles"
          showClose={false}
          className="p-3 sm:hidden"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(q);
            }}
            className="flex items-center gap-2"
            role="search"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- the sheet exists
                // only to take this input; not focusing it would cost an extra tap.
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search drives, companies, roles…"
                aria-label="Search drives, companies and roles"
                className="h-11 w-full rounded-lg border border-border bg-section pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <Button type="submit" size="sm" className="h-11 shrink-0">
              Search
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </header>
  );
}
