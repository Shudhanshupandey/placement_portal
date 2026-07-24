import { z } from "zod";

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export const personalSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(80, "Name is too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name may only contain letters"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
    .refine((v) => {
      const dob = new Date(v);
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
      return age >= 15 && age <= 60;
    }, "Age must be between 15 and 60"),
  mobileNumber: z
    .string()
    .regex(INDIAN_MOBILE, "Enter a valid 10-digit mobile number"),
  alternateMobileNumber: z
    .string()
    .regex(INDIAN_MOBILE, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
    .optional()
    .or(z.literal("")),
  category: z.enum(["general", "obc", "sc", "st", "ews"], {
    required_error: "Please select a category",
  }),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Address is required").max(200),
  city: z.string().min(2, "City is required").max(60),
  state: z.string().min(2, "Please select your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export type PersonalFormValues = z.infer<typeof personalSchema>;
