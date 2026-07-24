"use client";

import * as React from "react";
import {
  MapPin,
  IndianRupee,
  CalendarDays,
  Clock,
  Users,
  Building2,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { PlacementDrive } from "@/features/placement-drives/types";
import {
  deadlineLabel,
  eligibilitySummary,
  formatDate,
} from "@/features/placement-drives/lib/drive-format";

interface DriveCardProps {
  drive: PlacementDrive;
  renderApply?: (drive: PlacementDrive) => React.ReactNode;
}

function Logo({ drive, size = 48 }: { drive: PlacementDrive; size?: number }) {
  const [failed, setFailed] = React.useState(false);
  if (drive.companyLogoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={drive.companyLogoUrl}
        alt={drive.companyName}
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-xl border border-border bg-card object-contain p-1.5"
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-xl bg-primary/10 font-bold text-primary"
    >
      {drive.companyName?.[0]?.toUpperCase() ?? <Building2 className="h-5 w-5" />}
    </span>
  );
}

export function DriveCard({ drive, renderApply }: DriveCardProps) {
  const [open, setOpen] = React.useState(false);
  const deadline = deadlineLabel(drive.lastDateMs);
  const elig = eligibilitySummary(drive.eligibility);

  return (
    <>
      <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
        <div className="flex items-start gap-3">
          <Logo drive={drive} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-heading">{drive.role}</h3>
                <p className="truncate text-sm text-muted-foreground">{drive.companyName}</p>
              </div>
              {drive.jobType && (
                <Badge variant="secondary" className="shrink-0">
                  {drive.jobType}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
            <IndianRupee className="h-4 w-4 text-gold" />
            {drive.packageLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {drive.location}
          </span>
          {typeof drive.openings === "number" && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" /> {drive.openings} openings
            </span>
          )}
        </div>

        {/* Eligibility chips */}
        {elig.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {elig.slice(0, 4).map((e) => (
              <span
                key={e}
                className="rounded-md bg-section px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {e}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              deadline.closed
                ? "text-muted-foreground"
                : deadline.urgent
                  ? "text-error"
                  : "text-muted-foreground"
            )}
          >
            <Clock className="h-3.5 w-3.5" /> {deadline.text}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
              View details
            </Button>
            {renderApply?.(drive)}
          </div>
        </div>
      </div>

      {/* Details dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Logo drive={drive} size={44} />
              <div>
                <DialogTitle>{drive.role}</DialogTitle>
                <p className="text-sm text-muted-foreground">{drive.companyName}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-section p-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Package</p>
                <p className="font-semibold text-heading">{drive.packageLabel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-heading">{drive.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last date</p>
                <p className="font-semibold text-heading">{formatDate(drive.lastDateMs)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Drive date</p>
                <p className="font-semibold text-heading">{formatDate(drive.driveDateMs)}</p>
              </div>
            </div>

            {drive.description && (
              <div>
                <p className="mb-1 text-sm font-semibold text-heading">About the role</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{drive.description}</p>
              </div>
            )}

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-heading">
                <GraduationCap className="h-4 w-4 text-primary" /> Eligibility
              </p>
              <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {elig.map((e) => (
                  <li key={e} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {e}
                  </li>
                ))}
                {drive.eligibility.requiredSkills?.length ? (
                  <li className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Skills:{" "}
                    {drive.eligibility.requiredSkills.join(", ")}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          <DialogFooter>{renderApply?.(drive)}</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
