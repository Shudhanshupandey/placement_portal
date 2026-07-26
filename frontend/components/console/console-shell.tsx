"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { PortalShell } from "@/components/layout/portal-shell";
import { ConsoleTopbar } from "@/components/console/console-topbar";
import type { ConsoleNavItem, ConsoleNavGroup } from "@/constants/console-nav";

/**
 * Chrome for the recruiter and admin consoles. The frame itself (sidebar,
 * drawer, collapse persistence, skip link) lives in `PortalShell`, which the
 * student portal shares; this only adds the console-specific topbar and the
 * contextual page title derived from the nav config.
 */

interface ConsoleShellProps {
  nav: ConsoleNavItem[];
  groups: ConsoleNavGroup[];
  portalLabel: string;
  displayName?: string;
  children: React.ReactNode;
}

export function ConsoleShell({
  nav,
  groups,
  portalLabel,
  displayName,
  children,
}: ConsoleShellProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    router.replace(ROUTES.portal);
  }, [signOut, router]);

  // Contextual title from the deepest matching nav item.
  const active = React.useMemo(() => {
    const matches = nav
      .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
      .sort((a, b) => b.href.length - a.href.length);
    return matches[0];
  }, [nav, pathname]);

  return (
    <PortalShell
      nav={nav}
      groups={groups}
      portalLabel={portalLabel}
      onSignOut={handleSignOut}
      topbar={({ onOpenMobile, mobileOpen }) => (
        <ConsoleTopbar
          title={active?.label ?? portalLabel}
          subtitle={portalLabel}
          displayName={displayName}
          onOpenMobile={onOpenMobile}
          mobileOpen={mobileOpen}
          onSignOut={handleSignOut}
        />
      )}
    >
      {children}
    </PortalShell>
  );
}
