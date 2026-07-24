"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { VerifyEmailNotice, WaitingForApproval } from "@/features/auth";

export default function RecruiterHomePage() {
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

  // 1) Email not verified yet.
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

  // 2) Awaiting (or denied) admin approval.
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

  // 3) Approved — workspace placeholder (hiring modules land in Phase 5).
  return (
    <div className="flex min-h-screen items-center justify-center bg-section px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
          <Briefcase className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-heading">You&apos;re approved 🎉</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome, {user?.email}. Your recruiter account is active. The hiring workspace
          (post jobs, search candidates, schedule interviews) arrives in the next phase.
        </p>
        <Button variant="ghost" className="mt-6" onClick={onSignOut}>
          <LogOut /> Sign out
        </Button>
      </div>
    </div>
  );
}
