import { z } from "zod";

const urlish = z
  .string()
  .max(200)
  .optional()
  .or(z.literal(""))
  .refine(
    (v) => !v || /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v),
    "Enter a valid URL"
  );

const handle = z.string().max(200).optional().or(z.literal(""));

export const projectSchema = z.object({
  title: z.string().min(2, "Project title is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  link: urlish,
});

export const professionalSchema = z.object({
  skills: z.array(z.string().min(1)).max(50).default([]),
  programmingLanguages: z.array(z.string().min(1)).max(30).default([]),
  frameworks: z.array(z.string().min(1)).max(30).default([]),
  technologies: z.array(z.string().min(1)).max(30).default([]),
  certifications: z.array(z.string().min(1)).max(30).default([]),
  projects: z.array(projectSchema).max(20).default([]),
  internshipExperience: z.string().max(1000).optional().or(z.literal("")),
  workExperience: z.string().max(1000).optional().or(z.literal("")),
  github: urlish,
  linkedin: urlish,
  portfolio: urlish,
  leetcode: handle,
  hackerrank: handle,
  codechef: handle,
  codeforces: handle,
});

export type ProjectValue = z.infer<typeof projectSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalSchema>;
