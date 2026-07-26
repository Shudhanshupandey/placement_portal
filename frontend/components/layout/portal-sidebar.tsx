"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, PanelLeftClose, PanelLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/shared/brand-logo";

/**
 * The one sidebar implementation for every portal — student, recruiter and
 * admin. It used to exist twice (`app-sidebar` + `console-sidebar`) with the
 * two copies drifting apart; both consoles now render this, parameterised by a
 * nav config, so a fix lands everywhere at once.
 */

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
}

export interface SidebarNavGroup {
  key: string;
  label: string;
}

interface PortalSidebarProps {
  nav: SidebarNavItem[];
  groups: SidebarNavGroup[];
  /** Small caps line under the wordmark, e.g. "Student Portal". */
  portalLabel: string;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  onSignOut: () => void;
  /** `mobile` always shows labels (it renders inside the drawer). */
  variant?: "desktop" | "mobile";
}

function isActive(pathname: string, href: string, homeHref: string) {
  // Only the portal "home" matches exactly; deeper items own their subtree.
  if (href === homeHref) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalSidebar({
  nav,
  groups,
  portalLabel,
  collapsed,
  onToggle,
  onNavigate,
  onSignOut,
  variant = "desktop",
}: PortalSidebarProps) {
  const pathname = usePathname();
  const showLabels = variant === "mobile" || !collapsed;
  const homeHref = nav[0]?.href ?? "";

  return (
    <div className="on-dark flex h-full flex-col bg-primary-gradient text-primary-foreground">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          showLabels ? "px-4" : "justify-center px-2"
        )}
      >
        <BrandLockup
          tone="dark"
          size="md"
          subtitle={showLabels ? portalLabel : undefined}
          markOnly={!showLabels}
          priority
        />
      </div>

      {/* Nav */}
      <nav
        aria-label={`${portalLabel} navigation`}
        className={cn(
          "flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-4",
          // The default light scrollbar thumb is invisible on navy.
          "[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb:hover]:bg-white/30"
        )}
      >
        {groups.map((group) => {
          const items = nav.filter((i) => i.group === group.key);
          if (items.length === 0) return null;
          return (
            <div key={group.key} className="space-y-1">
              {showLabels ? (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                  {group.label}
                </p>
              ) : (
                // Keep the grouping audible when labels are hidden, and draw a
                // hairline so the collapsed rail still reads as sections.
                <div className="mx-auto mb-2 h-px w-6 bg-white/15" role="presentation" />
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
                      "group relative flex min-h-touch items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      !showLabels && "justify-center px-0",
                      active ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`portal-nav-active-${variant}`}
                        className="absolute inset-0 rounded-lg bg-white/15 ring-1 ring-inset ring-white/10"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                    {showLabels && <span className="relative z-10 truncate">{item.label}</span>}
                    {!showLabels && <span className="sr-only">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-1 border-t border-white/10 p-3 pb-safe">
        <button
          type="button"
          onClick={onSignOut}
          title={!showLabels ? "Logout" : undefined}
          className={cn(
            "flex min-h-touch w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white",
            !showLabels && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {showLabels ? <span>Logout</span> : <span className="sr-only">Logout</span>}
        </button>

        {variant === "desktop" && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex min-h-touch w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/55 transition-colors hover:bg-white/10 hover:text-white",
              !showLabels && "justify-center px-0"
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
