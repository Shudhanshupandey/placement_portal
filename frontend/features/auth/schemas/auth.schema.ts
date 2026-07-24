import { z } from "zod";
import { EMAIL_DOMAIN_ERROR, isAllowedCollegeEmail } from "@/lib/auth/email-domain";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "College email is required")
    .email("Enter a valid email address")
    .transform((v) => v.trim().toLowerCase())
    .refine(isAllowedCollegeEmail, { message: EMAIL_DOMAIN_ERROR }),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Enter the 6-digit code")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
