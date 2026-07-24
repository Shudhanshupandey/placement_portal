"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { WaitingForApproval } from "@/features/auth";

export default function RecruiterPendingPage() {
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
    if (status?.approvalStatus === "approved") router.replace(ROUTES.recruiter.home);
  };

  return (
    <WaitingForApproval
      status={status?.approvalStatus ?? "pending"}
      email={user?.email ?? undefined}
      reason={status?.rejectionReason}
      onRefresh={onRefresh}
      onSignOut={onSignOut}
      refreshing={refreshing}
    />
  );
}
