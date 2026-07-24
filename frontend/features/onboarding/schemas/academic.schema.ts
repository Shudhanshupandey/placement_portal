import { z } from "zod";

/** Optional numeric string within [min, max]. Empty string is allowed (skipped). */
const optionalNumberInRange = (min: number, max: number, label: string) =>
  z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || v === "" || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max),
      `Enter a value between ${min} and ${max}${label ? ` for ${label}` : ""}`
    );

const optionalIntNonNeg = z
  .string()
  .optional()
  .refine(
    (v) => v === undefined || v === "" || (/^\d+$/.test(v) && Number(v) >= 0),
    "Enter a valid whole number"
  );

const opt = z.string().max(120).optional().or(z.literal(""));

export const academicSchema = z.object({
  enrollmentNumber: opt,
  universityRollNumber: opt,
  course: z.string().optional().or(z.literal("")),
  branch: z.string().optional().or(z.literal("")),
  currentYear: z.string().optional().or(z.literal("")),
  currentSemester: z.string().optional().or(z.literal("")),
  section: z.string().max(4).optional().or(z.literal("")),
  admissionYear: z.string().optional().or(z.literal("")),
  expectedPassingYear: z.string().optional().or(z.literal("")),
  tenthPercentage: optionalNumberInRange(0, 100, "10th %"),
  twelfthPercentage: optionalNumberInRange(0, 100, "12th %"),
  diplomaPercentage: optionalNumberInRange(0, 100, "Diploma %"),
  currentCgpa: optionalNumberInRange(0, 10, "CGPA"),
  activeBacklogs: optionalIntNonNeg,
  totalBacklogsHistory: optionalIntNonNeg,
  academicGap: z.enum(["yes", "no"]).optional().or(z.literal("")),
  academicStatus: z
    .enum(["regular", "backlog", "detained", "passed"])
    .optional()
    .or(z.literal("")),
});

export type AcademicFormValues = z.infer<typeof academicSchema>;
