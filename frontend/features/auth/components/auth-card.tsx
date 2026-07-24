"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOtpAuth } from "@/features/auth/hooks/use-otp-auth";
import { EmailStep } from "@/features/auth/components/email-step";
import { OtpStep } from "@/features/auth/components/otp-step";

interface AuthCardProps {
  onAuthenticated: (ctx: { isNewUser: boolean }) => void;
}

/** Two-step OTP sign-in card (email → code). */
export function AuthCard({ onAuthenticated }: AuthCardProps) {
  const {
    step,
    email,
    submitting,
    cooldown,
    requestOtp,
    resendOtp,
    verifyOtp,
    changeEmail,
  } = useOtpAuth(onAuthenticated);

  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === "otp" ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step === "otp" ? -24 : 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step === "email" ? (
            <EmailStep
              defaultEmail={email}
              submitting={submitting}
              onSubmit={requestOtp}
            />
          ) : (
            <OtpStep
              email={email}
              submitting={submitting}
              cooldown={cooldown}
              onVerify={verifyOtp}
              onResend={resendOtp}
              onChangeEmail={changeEmail}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
