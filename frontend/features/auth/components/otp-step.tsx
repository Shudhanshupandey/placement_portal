"use client";

import * as React from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/features/auth/components/otp-input";

interface OtpStepProps {
  email: string;
  submitting: boolean;
  cooldown: number;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
}

export function OtpStep({
  email,
  submitting,
  cooldown,
  onVerify,
  onResend,
  onChangeEmail,
}: OtpStepProps) {
  const [otp, setOtp] = React.useState("");
  const complete = otp.length === 6;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <MailCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-heading">Enter verification code</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-heading">{email}</span>
        </p>
      </div>

      <OtpInput
        value={otp}
        onChange={setOtp}
        autoFocus
        disabled={submitting}
        onComplete={onVerify}
      />

      <Button
        size="lg"
        className="w-full"
        disabled={!complete || submitting}
        onClick={() => onVerify(otp)}
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" /> Verifying…
          </>
        ) : (
          "Verify & continue"
        )}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={submitting}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" /> Change email
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0 || submitting}
          className="font-medium text-primary transition-colors hover:text-primary-light disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
