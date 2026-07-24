"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ShieldCheck } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  FileUpload,
  MultiFileUpload,
  type Uploader,
} from "@/features/onboarding/components/file-upload";
import { WizardNav } from "@/features/onboarding/components/wizard-nav";
import { uploadDocumentToStorage } from "@/lib/storage/upload";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload";
import {
  documentsSchema,
  type DocumentsFormValues,
} from "@/features/onboarding/schemas/documents.schema";

interface DocumentsStepProps {
  defaultValues: Partial<DocumentsFormValues>;
  submitting: boolean;
  step: number;
  onSubmit: (values: DocumentsFormValues) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function DocumentsStep({
  defaultValues,
  submitting,
  step,
  onSubmit,
  onBack,
  onSkip,
}: DocumentsStepProps) {
  const { user } = useAuth();
  const uid = user?.uid ?? "anonymous";

  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      resumeUrl: "",
      passportPhotoUrl: "",
      tenthMarksheetUrl: "",
      twelfthMarksheetUrl: "",
      semesterMarksheetUrls: [],
      certificateUrls: [],
      ...defaultValues,
    },
  });

  // Documents (PDF/marksheets/certificates) → Firebase Storage
  const docUploader = React.useCallback<(category: string) => Uploader>(
    (category) => async (file, onProgress) => {
      const res = await uploadDocumentToStorage(uid, file, category, onProgress);
      return res.url;
    },
    [uid]
  );

  // Passport photo (image) → Cloudinary, per locked storage rule
  const photoUploader = React.useCallback<Uploader>(
    async (file) => {
      const res = await uploadImageToCloudinary(file, `saitm/students/${uid}/passport`);
      return res.url;
    },
    [uid]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5">
          <div className="flex items-start gap-2 rounded-xl bg-section p-3.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Documents are stored securely on Firebase Storage; your passport photo
              is optimized via Cloudinary. All uploads are optional — you can add them
              later from Profile Settings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FileUpload
                  label="Resume (PDF)"
                  description="PDF · up to 10 MB"
                  accept="application/pdf"
                  value={field.value}
                  onChange={field.onChange}
                  uploader={docUploader("resume")}
                />
              )}
            />
            <FormField
              control={form.control}
              name="passportPhotoUrl"
              render={({ field }) => (
                <FileUpload
                  label="Passport Size Photo"
                  description="JPG/PNG · optimized on Cloudinary"
                  accept="image/*"
                  value={field.value}
                  onChange={field.onChange}
                  uploader={photoUploader}
                />
              )}
            />
            <FormField
              control={form.control}
              name="tenthMarksheetUrl"
              render={({ field }) => (
                <FileUpload
                  label="10th Marksheet"
                  value={field.value}
                  onChange={field.onChange}
                  uploader={docUploader("marksheets/tenth")}
                />
              )}
            />
            <FormField
              control={form.control}
              name="twelfthMarksheetUrl"
              render={({ field }) => (
                <FileUpload
                  label="12th Marksheet"
                  value={field.value}
                  onChange={field.onChange}
                  uploader={docUploader("marksheets/twelfth")}
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="semesterMarksheetUrls"
            render={({ field }) => (
              <MultiFileUpload
                label="Semester Marksheets"
                description="Add each semester's marksheet (up to 12)."
                value={field.value ?? []}
                onChange={field.onChange}
                uploader={docUploader("marksheets/semester")}
              />
            )}
          />

          <FormField
            control={form.control}
            name="certificateUrls"
            render={({ field }) => (
              <MultiFileUpload
                label="Certificates"
                description="Course, internship or achievement certificates."
                value={field.value ?? []}
                onChange={field.onChange}
                uploader={docUploader("certificates")}
                max={20}
              />
            )}
          />

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> Accepted formats: PDF, JPG, PNG, WEBP.
          </p>
        </div>

        <WizardNav step={step} submitting={submitting} onBack={onBack} onSkip={onSkip} />
      </form>
    </Form>
  );
}
