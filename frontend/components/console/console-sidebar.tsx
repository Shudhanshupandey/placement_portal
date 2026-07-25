"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { ConsoleNavItem, ConsoleNavGroup } from "@/constants/console-nav";

/**
 * Generalized console sidebar — the recruiter/admin counterpart of
 * `components/layout/app-sidebar.tsx`. Parameterized by a nav config and portal
 * label so both consoles share one implementation; the student sidebar is left
 * untouched.
 */

interface ConsoleSidebarProps {
  nav: ConsoleNavItem[];
  groups: ConsoleNavGroup[];
  portalLabel: string;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  onSignOut: () => void;
  variant?: "desktop" | "mobile";
}

function isActive(pathname: string, href: string, homeHref: string) {
  // Only the dashboard "home" matches exactly; deeper items match their subtree.
  if (href === homeHref) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ConsoleSidebar({
  nav,
  groups,
  portalLabel,
  collapsed,
  onToggle,
  onNavigate,
  onSignOut,
  variant = "desktop",
}: ConsoleSidebarProps) {
  const pathname = usePathname();
  const showLabels = variant === "mobile" || !collapsed;
  const homeHref = nav[0]?.href ?? "";

  return (
    <div className="flex h-full flex-col bg-primary-gradient text-primary-foreground">
      {/* Brand */}
      <div className={cn("flex h-16 items-center px-4", showLabels ? "gap-3" : "justify-center px-0")}>
        {showLabels ? (
          <div className="flex min-w-0 flex-col">
            <BrandLogo variant="full-white" className="h-7" />
            <span className="mt-1 pl-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/80">
              {portalLabel}
            </span>
          </div>
        ) : (
          <BrandLogo variant="seal" className="h-9" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {groups.map((group) => {
          const items = nav.filter((i) => i.group === group.key);
          if (items.length === 0) return null;
          return (
            <div key={group.key} className="space-y-1">
              {showLabels && (
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {group.label}
                </p>
              )}
              {items.map((item) => {
                const active = isActive(pathname, item.href, homeHref);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={!showLabels ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      !showLabels && "justify-center px-0",
                      active ? "text-white" : "text-white/70 hover:text-white"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`console-nav-active-${variant}`}
                        className="absolute inset-0 rounded-lg bg-white/15 ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    {active && showLabels && (
                      <span className="absolute -left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold" />
                    )}
                    <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
                    {showLabels && <span className="relative z-10 truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onSignOut}
          title={!showLabels ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            !showLabels && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {showLabels && <span>Logout</span>}
        </button>
        {variant === "desktop" && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white",
              !showLabels && "justify-center px-0"
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-[18px] w-[18px] shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
