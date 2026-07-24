import { z } from "zod";

const email = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .transform((v) => v.trim().toLowerCase());

const password = z.string().min(8, "Password must be at least 8 characters");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({ email });

export const recruiterRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required").max(80),
    email: email.refine((v) => !v.endsWith("@saitm.ac.in"), {
      message: "The @saitm.ac.in domain is reserved for students. Use your work email.",
    }),
    companyName: z.string().min(2, "Company name is required").max(120),
    designation: z.string().max(80).optional().or(z.literal("")),
    phone: z
      .string()
      .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number")
      .optional()
      .or(z.literal("")),
    companyWebsite: z.string().max(200).optional().or(z.literal("")),
    password,
    confirmPassword: z.string(),
    agree: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type RecruiterRegisterValues = z.infer<typeof recruiterRegisterSchema>;
