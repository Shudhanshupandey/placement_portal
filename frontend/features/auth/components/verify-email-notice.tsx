"use client";

import * as React from "react";
import { toast } from "sonner";
import { MailWarning, RefreshCw, Send, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recruiterAuthService } from "@/features/auth/services/recruiter-auth.service";

interface VerifyEmailNoticeProps {
  email?: string;
  onRefresh: () => void;
  onSignOut: () => void;
  refreshing?: boolean;
}

export function VerifyEmailNotice({
  email,
  onRefresh,
  onSignOut,
  refreshing,
}: VerifyEmailNoticeProps) {
  const [sending, setSending] = React.useState(false);

  const resend = async () => {
    setSending(true);
    try {
      await recruiterAuthService.resendVerification();
      toast.success("Verification email sent", {
        description: email ? `Check ${email}.` : undefined,
      });
    } catch {
      toast.error("Couldn't send verification email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-section px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10 text-info">
          <MailWarning className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-heading">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a verification link{email ? ` to ${email}` : ""}. Please verify to
          continue. Your account also needs admin approval.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={resend} disabled={sending}>
            <Send className={sending ? "animate-pulse" : ""} /> Resend verification email
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onRefresh} disabled={refreshing}>
              <RefreshCw className={refreshing ? "animate-spin" : ""} /> I&apos;ve verified
            </Button>
            <Button variant="ghost" onClick={onSignOut}>
              <LogOut /> Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
