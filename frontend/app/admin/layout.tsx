"use client";

import { RequireRole } from "@/components/shared/require-role";
import { ConsoleShell } from "@/components/console/console-shell";
import { ADMIN_NAV, ADMIN_NAV_GROUPS } from "@/constants/console-nav";

/**
 * Every /admin route requires the admin role (login lives at /portal). The
 * admin account is always active, so unlike the recruiter console there is no
 * verification/approval gate — just the role guard and the console chrome.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="admin">
      <ConsoleShell nav={ADMIN_NAV} groups={ADMIN_NAV_GROUPS} portalLabel="Admin Console">
        {children}
      </ConsoleShell>
    </RequireRole>
  );
}
