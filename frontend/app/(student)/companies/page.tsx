"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes";
import { useDrives } from "@/features/placement-drives";

export default function CompaniesPage() {
  const { data: drives, isLoading } = useDrives();

  const companies = React.useMemo(() => {
    const map = new Map<string, { name: string; logo?: string; roles: number }>();
    for (const d of drives ?? []) {
      const existing = map.get(d.companyName);
      if (existing) existing.roles += 1;
      else map.set(d.companyName, { name: d.companyName, logo: d.companyLogoUrl, roles: 1 });
    }
    return Array.from(map.values());
  }, [drives]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm font-bold text-heading">Companies</h1>
        <p className="text-sm text-muted-foreground">Companies currently recruiting at SAITM.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Companies appear here once the TPO office publishes their drives."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div key={c.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                  {c.name[0]?.toUpperCase() ?? <Building2 className="h-5 w-5" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-heading">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.roles} open {c.roles === 1 ? "role" : "roles"}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.student.placementDrives}>
                  <Briefcase /> View drives
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
