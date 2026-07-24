"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";

/** Entry point — routes to dashboard, onboarding, or login based on auth state. */
export default function RootPage() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(ROUTES.studentLogin);
    } else if (profile && !profile.profileCompleted) {
      router.replace(ROUTES.onboarding);
    } else {
      router.replace(ROUTES.student.dashboard);
    }
  }, [loading, user, profile, router]);

  return <FullScreenLoader label="Preparing your portal…" />;
}
