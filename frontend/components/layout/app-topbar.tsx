"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  onSignOut: () => void;
}

export function AppTopbar({ onOpenMobile, onSignOut }: AppTopbarProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const pct = profile?.completionPercentage ?? 0;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${ROUTES.student.placementDrives}?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-heading" />
      </button>

      {/* Search */}
      <form onSubmit={onSearch} className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search drives, companies, roles…"
          className="h-10 w-full rounded-lg border border-border bg-section pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Profile completion pill */}
        <Link
          href={pct >= 100 ? ROUTES.student.profile : ROUTES.onboarding}
          className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:bg-section md:flex"
          title="Profile completion"
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-7 w-7 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#D8AE3E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
              />
            </svg>
          </span>
          <span className="text-xs font-semibold text-heading">{pct}%</span>
        </Link>

        {/* Quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Zap className="text-gold" /> Quick actions <ChevronDown className="opacity-60" />
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
              className="flex items-center gap-2 rounded-full p-0.5 pr-1 transition-colors hover:bg-section focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <Avatar className="h-9 w-9">
                {profile?.photoUrl && <AvatarImage src={profile.photoUrl} alt="" />}
                <AvatarFallback>{initials(profile?.fullName, user?.email ?? undefined)}</AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
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
    </header>
  );
}
