"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES, loginForRole } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";

interface RequireAuthProps {
  children: React.ReactNode;
  /** Enforce a specific role; mismatches redirect to /unauthorized. */
  role?: Role;
  /** Students: redirect to onboarding until the profile is complete. */
  requireComplete?: boolean;
  /** Recruiters: redirect to /recruiter/pending until approved. */
  requireApproved?: boolean;
}

/** Client-side gate for authenticated routes (role + completion + approval aware). */
export function RequireAuth({
  children,
  role,
  requireComplete = false,
  requireApproved = false,
}: RequireAuthProps) {
  const { user, loading, role: currentRole, status, profile } = useAuth();
  const router = useRouter();

  const roleMismatch = !!role && !!currentRole && currentRole !== role;
  const profileCompleted =
    status?.profileCompleted ?? profile?.profileCompleted ?? false;
  const needsOnboarding =
    requireComplete && !!user && !roleMismatch && !profileCompleted;
  const needsApproval =
    requireApproved && !!user && !roleMismatch && status?.approvalStatus !== "approved";

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(loginForRole(role ?? "student"));
      return;
    }
    if (roleMismatch) {
      router.replace(ROUTES.unauthorized);
      return;
    }
    if (needsOnboarding) {
      router.replace(ROUTES.onboarding);
      return;
    }
    if (needsApproval) {
      router.replace(ROUTES.recruiter.pending);
    }
  }, [loading, user, roleMismatch, needsOnboarding, needsApproval, role, router]);

  if (loading || !user || roleMismatch || needsOnboarding || needsApproval) {
    return <FullScreenLoader />;
  }
  return <>{children}</>;
}
