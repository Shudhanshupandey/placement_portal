import { z } from "zod";

/**
 * Documents step stores only the resulting file URLs (upload happens on select).
 * Routing (per locked storage rule in CLAUDE.md):
 *   • Photos  → Cloudinary  (passportPhotoUrl)
 *   • Docs    → Firebase Storage (resume, marksheets, certificates)
 */
export const documentsSchema = z.object({
  resumeUrl: z.string().url().optional().or(z.literal("")),
  passportPhotoUrl: z.string().url().optional().or(z.literal("")),
  tenthMarksheetUrl: z.string().url().optional().or(z.literal("")),
  twelfthMarksheetUrl: z.string().url().optional().or(z.literal("")),
  semesterMarksheetUrls: z.array(z.string().url()).max(12).default([]),
  certificateUrls: z.array(z.string().url()).max(20).default([]),
});

export type DocumentsFormValues = z.infer<typeof documentsSchema>;
