"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RequireRole } from "@/components/shared/require-role";
import { ConsoleShell } from "@/components/console/console-shell";
import { RECRUITER_NAV, RECRUITER_NAV_GROUPS } from "@/constants/console-nav";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { VerifyEmailNotice, WaitingForApproval } from "@/features/auth";

/**
 * Every /recruiter route requires the recruiter role (login lives at /portal).
 *
 * The production gating is preserved exactly as it was in the old page:
 * unverified email → VerifyEmailNotice, unapproved account → WaitingForApproval,
 * both WITHOUT the console chrome. The dashboard shell renders only for a
 * verified, approved recruiter — which the seeded demo account already is, so in
 * demo mode this falls straight through to the console.
 */
function RecruiterGate({ children }: { children: React.ReactNode }) {
  const { user, status, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onSignOut = async () => {
    await signOut();
    router.replace(ROUTES.portal);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  if (user && !user.emailVerified) {
    return (
      <VerifyEmailNotice
        email={user.email ?? undefined}
        onRefresh={onRefresh}
        onSignOut={onSignOut}
        refreshing={refreshing}
      />
    );
  }

  if (status && status.approvalStatus !== "approved") {
    return (
      <WaitingForApproval
        status={status.approvalStatus}
        email={user?.email ?? undefined}
        reason={status.rejectionReason}
        onRefresh={onRefresh}
        onSignOut={onSignOut}
        refreshing={refreshing}
      />
    );
  }

  return (
    <ConsoleShell
      nav={RECRUITER_NAV}
      groups={RECRUITER_NAV_GROUPS}
      portalLabel="Recruiter Portal"
    >
      {children}
    </ConsoleShell>
  );
}

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="recruiter">
      <RecruiterGate>{children}</RecruiterGate>
    </RequireRole>
  );
}
