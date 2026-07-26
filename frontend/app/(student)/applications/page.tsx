"use client";

import * as React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { FilterChips } from "@/components/dashboard";
import { ROUTES } from "@/constants/routes";
import {
  useMyApplications,
  ApplicationRow,
  ApplicationStats,
  STATUS_META,
  ALL_STATUSES,
  type ApplicationStatus,
} from "@/features/applications";

type Filter = "all" | ApplicationStatus;

export default function ApplicationsPage() {
  const { data: apps, isLoading } = useMyApplications();
  const [filter, setFilter] = React.useState<Filter>("all");

  const applications = React.useMemo(() => apps ?? [], [apps]);
  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: applications.length };
    for (const s of ALL_STATUSES) map[s] = applications.filter((a) => a.status === s).length;
    return map;
  }, [applications]);

  const visible = filter === "all" ? applications : applications.filter((a) => a.status === filter);
  const filterOptions = React.useMemo(
    () =>
      (["all", ...ALL_STATUSES.filter((s) => counts[s] > 0)] as Filter[]).map((f) => ({
        key: f,
        label: f === "all" ? "All" : STATUS_META[f].label,
        count: counts[f],
      })),
    [counts]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm font-bold text-heading">My Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every application and its status timeline.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't applied to anything yet"
          description="Browse placement drives and apply with a single click."
          action={
            <Button asChild variant="gold" size="sm">
              <Link href={ROUTES.student.placementDrives}>Browse drives</Link>
            </Button>
          }
        />
      ) : (
        <>
          <SectionCard title="Overview">
            <ApplicationStats applications={applications} />
          </SectionCard>

          <FilterChips
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            label="Filter applications by status"
          />

          {visible.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nothing in this stage"
              description="No applications currently have this status."
            />
          ) : (
            <div className="space-y-3">
              {visible.map((app) => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
