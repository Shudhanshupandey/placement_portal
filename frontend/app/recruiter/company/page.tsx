"use client";

import Link from "next/link";
import { Globe, Mail, Phone, Pencil, Briefcase, UserCheck, CalendarDays } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { PageShell, PageHeader, StatusPill } from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import { MOCK_RECRUITERS, companyLogo } from "@/data/mock";

function initials(name: string) {
  return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function RecruiterCompanyPage() {
  const recruiter = MOCK_RECRUITERS[0];
  const logo = companyLogo(recruiter.companyName);

  const stats = [
    { label: "Drives posted", value: recruiter.jobsPosted, icon: Briefcase },
    { label: "Candidates shortlisted", value: recruiter.candidatesShortlisted, icon: UserCheck },
    { label: "Partner since", value: formatDate(recruiter.registeredAtMs), icon: CalendarDays },
  ];

  const details: { label: string; value: React.ReactNode }[] = [
    { label: "Company name", value: recruiter.companyName },
    {
      label: "Website",
      value: (
        <Link href={recruiter.companyWebsite} className="text-info hover:underline" target="_blank">
          {recruiter.companyWebsite.replace(/^https?:\/\//, "")}
        </Link>
      ),
    },
    { label: "Sector", value: "Information Technology & Services" },
    { label: "Company size", value: "201 – 500 employees" },
    { label: "Headquarters", value: "Gurugram, Haryana" },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Company profile"
        description="How your organisation appears to SAITM students."
        action={
          <Button variant="outline">
            <Pencil /> Edit profile
          </Button>
        }
      />

      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16 rounded-2xl">
          <AvatarImage src={logo} alt="" />
          <AvatarFallback>{initials(recruiter.companyName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-heading">{recruiter.companyName}</h2>
            <StatusPill tone="success">Verified partner</StatusPill>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> {recruiter.companyWebsite.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-bold text-heading">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Company details" className="lg:col-span-2">
          <dl className="divide-y divide-border">
            {details.map((d) => (
              <div key={d.label} className="flex flex-wrap gap-2 py-3 first:pt-0 last:pb-0">
                <dt className="w-40 shrink-0 text-sm text-muted-foreground">{d.label}</dt>
                <dd className="text-sm font-medium text-foreground">{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            A campus hiring partner of the SAITM Training &amp; Placement Cell, recruiting across
            engineering and product roles each placement cycle.
          </p>
        </SectionCard>

        <SectionCard title="Primary contact">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={recruiter.photoUrl} alt="" />
              <AvatarFallback>{initials(recruiter.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-heading">{recruiter.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{recruiter.designation}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate text-foreground">{recruiter.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="text-foreground">{recruiter.phone}</span>
            </div>
          </dl>
        </SectionCard>
      </div>
    </PageShell>
  );
}