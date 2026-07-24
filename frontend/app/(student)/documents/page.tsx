"use client";

import Link from "next/link";
import { FileText, Pencil, ExternalLink, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { ROUTES } from "@/constants/routes";
import { useFullProfile } from "@/features/profile";

function DocRow({ label, url }: { label: string; url?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-section px-3 py-2.5 text-sm">
      <span className="flex items-center gap-2 text-heading">
        <FileText className="h-4 w-4 text-primary" /> {label}
      </span>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          View <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">Not uploaded</span>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const { data: full, isLoading } = useFullProfile();
  const d = full?.documents;

  const singles = [
    { label: "Resume (PDF)", url: d?.resumeUrl },
    { label: "Passport Photo", url: d?.passportPhotoUrl },
    { label: "10th Marksheet", url: d?.tenthMarksheetUrl },
    { label: "12th Marksheet", url: d?.twelfthMarksheetUrl },
  ];
  const semesters = d?.semesterMarksheetUrls ?? [];
  const certificates = d?.certificateUrls ?? [];
  const nothing = singles.every((s) => !s.url) && !semesters.length && !certificates.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Documents</h1>
          <p className="text-sm text-muted-foreground">All your uploaded documents in one place.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`${ROUTES.onboarding}?step=3`}>
            <Pencil /> Manage
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : nothing ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents uploaded"
          description="Upload your resume, marksheets and certificates to complete your profile."
          action={
            <Button asChild size="sm" variant="gold">
              <Link href={`${ROUTES.onboarding}?step=3`}>Upload documents</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <SectionCard title="Core Documents">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {singles.map((s) => (
                <DocRow key={s.label} label={s.label} url={s.url} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title={`Semester Marksheets (${semesters.length})`}>
            {semesters.length ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {semesters.map((url, i) => (
                  <DocRow key={url} label={`Semester ${i + 1}`} url={url} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No semester marksheets uploaded.</p>
            )}
          </SectionCard>

          <SectionCard title={`Certificates (${certificates.length})`}>
            {certificates.length ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {certificates.map((url, i) => (
                  <DocRow key={url} label={`Certificate ${i + 1}`} url={url} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No certificates uploaded.</p>
            )}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
