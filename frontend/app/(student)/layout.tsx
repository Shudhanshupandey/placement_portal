"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { RequireAuth } from "@/components/shared/require-auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { AppTopbar } from "@/components/layout/app-topbar";
import { RightPanel } from "@/components/layout/right-panel";
import { STUDENT_NAV, NAV_GROUPS } from "@/constants/student-nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    router.replace(ROUTES.studentLogin);
  }, [signOut, router]);

  // The dashboard already surfaces profile strength and recent activity in its
  // own cards, so the rail would just repeat itself there.
  const showRightPanel = pathname !== ROUTES.student.dashboard;

  return (
    <RequireAuth role="student" requireComplete>
      <PortalShell
        nav={STUDENT_NAV}
        groups={NAV_GROUPS}
        portalLabel="Student Portal"
        onSignOut={handleSignOut}
        aside={showRightPanel ? <RightPanel /> : undefined}
        topbar={({ onOpenMobile, mobileOpen }) => (
          <AppTopbar
            onOpenMobile={onOpenMobile}
            mobileOpen={mobileOpen}
            onSignOut={handleSignOut}
          />
        )}
      >
        {children}
      </PortalShell>
    </RequireAuth>
  );
}
