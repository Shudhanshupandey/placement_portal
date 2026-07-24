"use client";

import Link from "next/link";
import { FileUser, CheckCircle2, Upload, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useFullProfile } from "@/features/profile";

export default function ResumePage() {
  const { data: full, isLoading } = useFullProfile();
  const resumeUrl = full?.documents.resumeUrl;

  if (isLoading) return <Skeleton className="h-48 w-full max-w-2xl" />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Resume</h1>
        <p className="text-sm text-muted-foreground">
          Your resume is automatically attached when you apply to drives.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        {resumeUrl ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold text-heading">Resume uploaded</p>
              <p className="text-sm text-muted-foreground">Recruiters can view this when you apply.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  View resume <ExternalLink />
                </a>
              </Button>
              <Button asChild variant="gold">
                <Link href={`${ROUTES.onboarding}?step=3`}>
                  <Upload /> Replace
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileUser className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold text-heading">No resume uploaded</p>
              <p className="text-sm text-muted-foreground">
                Upload your resume (PDF) to apply for placement drives.
              </p>
            </div>
            <Button asChild variant="gold">
              <Link href={`${ROUTES.onboarding}?step=3`}>
                <Upload /> Upload resume
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
