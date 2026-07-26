"use client";

import Link from "next/link";
import { Globe, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageShell, PageHeader, StatusPill, type PillTone } from "@/components/dashboard";
import { MOCK_COMPANIES, type MockCompany } from "@/data/mock";

function tierTone(tier: MockCompany["tier"]): PillTone {
  return tier === "Tier 1" ? "gold" : tier === "Tier 2" ? "info" : "neutral";
}

function initials(name: string) {
  return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminCompaniesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Companies"
        description={`${MOCK_COMPANIES.length} recruiting partners engaged with SAITM.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_COMPANIES.map((c) => (
          <article key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <Avatar className="h-11 w-11 rounded-xl">
                <AvatarImage src={c.logoUrl} alt="" />
                <AvatarFallback>{initials(c.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-heading">{c.name}</h2>
                <p className="truncate text-xs text-muted-foreground">{c.sector}</p>
              </div>
              <StatusPill tone={tierTone(c.tier)}>{c.tier}</StatusPill>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-section p-3 text-center">
              <div>
                <p className="text-sm font-bold text-heading">{c.drivesCount}</p>
                <p className="text-[11px] text-muted-foreground">Drives</p>
              </div>
              <div>
                <p className="text-sm font-bold text-heading">{c.studentsHired}</p>
                <p className="text-[11px] text-muted-foreground">Hired</p>
              </div>
              <div>
                <p className="text-sm font-bold text-heading">{c.highestPackageLpa} LPA</p>
                <p className="text-[11px] text-muted-foreground">Highest</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {c.headquarters}
              </span>
              <Link
                href={c.website}
                target="_blank"
                className="inline-flex items-center gap-1 text-info hover:underline"
              >
                <Globe className="h-3.5 w-3.5" /> Website
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}