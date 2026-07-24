"use client";

import * as React from "react";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";

type Step = "email" | "otp";

export function useOtpAuth(onAuthenticated: (ctx: { isNewUser: boolean }) => void) {
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  // Countdown timer for the resend button.
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const startCooldown = React.useCallback((seconds: number) => {
    setCooldown(Math.max(seconds, 30));
  }, []);

  const requestOtp = React.useCallback(
    async (nextEmail: string) => {
      setSubmitting(true);
      try {
        const res = await authService.requestOtp(nextEmail);
        setEmail(nextEmail);
        setStep("otp");
        startCooldown(res.cooldownSeconds || 45);
        toast.success("Verification code sent", {
          description: `We emailed a 6-digit code to ${nextEmail}.`,
        });
      } catch (err) {
        toast.error("Couldn't send code", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [startCooldown]
  );

  const resendOtp = React.useCallback(async () => {
    if (cooldown > 0 || !email) return;
    await requestOtp(email);
  }, [cooldown, email, requestOtp]);

  const verifyOtp = React.useCallback(
    async (otp: string) => {
      setSubmitting(true);
      try {
        const { isNewUser } = await authService.verifyOtp(email, otp);
        toast.success("Signed in successfully");
        onAuthenticated({ isNewUser });
      } catch (err) {
        toast.error("Verification failed", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [email, onAuthenticated]
  );

  const changeEmail = React.useCallback(() => {
    setStep("email");
    setCooldown(0);
  }, []);

  return {
    step,
    email,
    submitting,
    cooldown,
    requestOtp,
    resendOtp,
    verifyOtp,
    changeEmail,
  };
}
