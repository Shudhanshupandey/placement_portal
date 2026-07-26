"use client";

import * as React from "react";
import { Menu, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name?: string, email?: string) {
  if (name) return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (email?.[0] ?? "U").toUpperCase();
}

interface ConsoleTopbarProps {
  /** Contextual label shown at the top-left (e.g. the current page title). */
  title: string;
  subtitle?: string;
  displayName?: string;
  onOpenMobile: () => void;
  mobileOpen: boolean;
  onSignOut: () => void;
}

export function ConsoleTopbar({
  title,
  subtitle,
  displayName,
  onOpenMobile,
  mobileOpen,
  onSignOut,
}: ConsoleTopbarProps) {
  const { user, role } = useAuth();
  const name = displayName ?? user?.displayName ?? undefined;

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

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold text-heading">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {role && (
          <span className="hidden rounded-full border border-border bg-section px-3 py-1 text-xs font-semibold capitalize text-heading sm:inline">
            {role}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex h-touch items-center gap-1.5 rounded-full px-0.5 transition-colors hover:bg-section focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <Avatar className="h-9 w-9">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt="" />}
                <AvatarFallback>{initials(name, user?.email ?? undefined)}</AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar className="h-10 w-10">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt="" />}
                <AvatarFallback>{initials(name, user?.email ?? undefined)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-heading">{name ?? "Signed in"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
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
