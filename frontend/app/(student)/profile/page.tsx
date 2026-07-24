"use client";

import Link from "next/link";
import { Pencil, Mail, Phone, MapPin, Github, Linkedin, Globe, FileText, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/shared/section-card";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/auth/use-auth";
import { useFullProfile } from "@/features/profile";

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-heading">{value || "—"}</p>
    </div>
  );
}

function EditLink({ step }: { step: number }) {
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={`${ROUTES.onboarding}?step=${step}`}>
        <Pencil /> Edit
      </Link>
    </Button>
  );
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { data: full, isLoading } = useFullProfile();

  if (isLoading || !full) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const s = full.student;
  const a = full.academic;
  const p = full.professional;
  const d = full.documents;
  const initials = (s?.fullName ?? user?.email ?? "S")
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20">
          {s?.photoUrl && <AvatarImage src={s.photoUrl} alt="" />}
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-heading">{s?.fullName ?? "Your Profile"}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {s?.email ?? user?.email}
            </span>
            {s?.mobileNumber && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {s.mobileNumber}
              </span>
            )}
            {a.course && (
              <span className="inline-flex items-center gap-1.5">
                {a.course} · {a.branch}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-heading">{profile?.completionPercentage ?? 0}%</p>
          <p className="text-xs text-muted-foreground">complete</p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href={ROUTES.onboarding}>
              <Pencil /> Edit profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Personal */}
      <SectionCard title="Personal Details" action={<EditLink step={0} />}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Full Name" value={s?.fullName} />
          <Field label="Gender" value={s?.gender} />
          <Field label="Date of Birth" value={s?.dateOfBirth} />
          <Field label="Category" value={s?.category?.toUpperCase()} />
          <Field label="Blood Group" value={s?.bloodGroup} />
          <Field label="Mobile" value={s?.mobileNumber} />
          <div className="col-span-2 flex items-start gap-1.5 sm:col-span-3">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <Field
              label="Address"
              value={[s?.address, s?.city, s?.state, s?.pincode].filter(Boolean).join(", ")}
            />
          </div>
        </div>
      </SectionCard>

      {/* Academic */}
      <SectionCard title="Academic Details" action={<EditLink step={1} />}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Enrollment No." value={a.enrollmentNumber} />
          <Field label="University Roll No." value={a.universityRollNumber} />
          <Field label="Course" value={a.course} />
          <Field label="Branch" value={a.branch} />
          <Field label="Current Year" value={a.currentYear} />
          <Field label="Semester" value={a.currentSemester} />
          <Field label="CGPA" value={a.currentCgpa} />
          <Field label="10th %" value={a.tenthPercentage} />
          <Field label="12th %" value={a.twelfthPercentage} />
          <Field label="Active Backlogs" value={a.activeBacklogs} />
          <Field label="Passing Year" value={a.expectedPassingYear} />
        </div>
      </SectionCard>

      {/* Professional */}
      <SectionCard title="Professional Details" action={<EditLink step={2} />}>
        <div className="space-y-4">
          {p.skills?.length ? (
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((sk) => (
                  <span key={sk} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {p.projects?.length ? (
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Projects</p>
              <ul className="space-y-1.5">
                {p.projects.map((pr, i) => (
                  <li key={i} className="text-sm text-heading">
                    <span className="font-medium">{pr.title}</span>
                    {pr.description ? <span className="text-muted-foreground"> — {pr.description}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm">
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {p.linkedin && (
              <a href={p.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {p.portfolio && (
              <a href={p.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <Globe className="h-4 w-4" /> Portfolio
              </a>
            )}
          </div>
          {!p.skills?.length && !p.projects?.length && !p.github && !p.linkedin && (
            <p className="text-sm text-muted-foreground">No professional details added yet.</p>
          )}
        </div>
      </SectionCard>

      {/* Documents */}
      <SectionCard title="Documents" action={<EditLink step={3} />}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { label: "Resume", url: d.resumeUrl },
            { label: "Passport Photo", url: d.passportPhotoUrl },
            { label: "10th Marksheet", url: d.tenthMarksheetUrl },
            { label: "12th Marksheet", url: d.twelfthMarksheetUrl },
          ].map(({ label, url }) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-section px-3 py-2.5 text-sm">
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
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
