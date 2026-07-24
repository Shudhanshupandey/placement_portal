"use client";

import { Clock3, XCircle, LogOut, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { ApprovalStatus } from "@/constants/roles";

interface WaitingForApprovalProps {
  status: ApprovalStatus | null;
  email?: string;
  reason?: string;
  onRefresh: () => void;
  onSignOut: () => void;
  refreshing?: boolean;
}

export function WaitingForApproval({
  status,
  email,
  reason,
  onRefresh,
  onSignOut,
  refreshing,
}: WaitingForApprovalProps) {
  const rejected = status === "rejected";

  return (
    <div className="flex min-h-screen items-center justify-center bg-section px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <BrandLogo variant="full-navy" priority className="mx-auto mb-6 h-9" />
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            rejected ? "bg-error/10 text-error" : "bg-warning/15 text-[#B45309]"
          }`}
        >
          {rejected ? <XCircle className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}
        </div>

        <h1 className="mt-4 text-xl font-bold text-heading">
          {rejected ? "Account not approved" : "Waiting for approval"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {rejected
            ? "Your recruiter account was not approved by the SAITM Placement Cell."
            : "Your recruiter account is under review by the SAITM Placement Cell. You'll be notified by email once it's approved."}
        </p>

        {email && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-section px-3 py-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> {email}
          </p>
        )}

        {rejected && reason && (
          <div className="mt-4 rounded-lg border border-error/20 bg-error/5 p-3 text-left text-sm text-foreground">
            <span className="font-semibold text-heading">Reason: </span>
            {reason}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {!rejected && (
            <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} /> Check status
            </Button>
          )}
          <Button variant="ghost" onClick={onSignOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
