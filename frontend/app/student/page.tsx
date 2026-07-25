"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { AuthCard, DemoAccountsCard } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import { writeRouteHint } from "@/lib/auth/route-hint";
import { IS_DEV_MODE } from "@/lib/dev-mode/flag";

/**
 * Student Portal — email OTP sign-in (@saitm.ac.in only). Students never see
 * recruiter or admin options here; the management portal lives at /portal.
 */
export default function StudentLoginPage() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();

  // Once authenticated, route by onboarding status.
  React.useEffect(() => {
    if (loading || !user) return;
    if (profile && !profile.profileCompleted) {
      router.replace(ROUTES.onboarding);
    } else {
      router.replace(ROUTES.student.dashboard);
    }
  }, [loading, user, profile, router]);

  const handleAuthenticated = React.useCallback(
    ({ isNewUser }: { isNewUser: boolean }) => {
      // Provisional routing hint so middleware doesn't bounce this navigation
      // (AuthProvider overwrites it with the authoritative value on resolve).
      writeRouteHint({
        role: "student",
        profileCompleted: !isNewUser,
        verificationStatus: "unverified",
        approvalStatus: null,
      });
      router.replace(isNewUser ? ROUTES.onboarding : ROUTES.student.dashboard);
    },
    [router]
  );

  return (
    <AuthShell portalLabel="Student Portal">
      <AuthCard onAuthenticated={handleAuthenticated} />
      {IS_DEV_MODE && <DemoAccountsCard />}
    </AuthShell>
  );
}
