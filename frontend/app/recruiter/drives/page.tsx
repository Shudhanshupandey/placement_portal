"use client";

import * as React from "react";
import { Plus, MapPin, Users, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader, StatusPill, type PillTone } from "@/components/dashboard";
import { formatDate } from "@/utils/format";
import { MOCK_DRIVES } from "@/data/mock";
import type { PlacementDrive } from "@/features/placement-drives";

function statusTone(status: PlacementDrive["status"]): PillTone {
  return status === "published" ? "success" : status === "closed" ? "neutral" : "warning";
}

function initials(name: string) {
  return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function RecruiterDrivesPage() {
  return (
    <div>
      <PageHeader
        title="Placement drives"
        description="Job postings you have opened for SAITM students."
        action={
          <Button>
            <Plus /> Post a drive
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_DRIVES.map((d) => (
          <article
            key={d.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-11 w-11 rounded-xl">
                <AvatarImage src={d.companyLogoUrl} alt="" />
                <AvatarFallback>{initials(d.companyName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-heading">{d.role}</h2>
                <p className="truncate text-sm text-muted-foreground">{d.companyName}</p>
              </div>
              <StatusPill tone={statusTone(d.status)}>{d.status}</StatusPill>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {d.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {d.openings ?? "—"} openings
              </span>
              {d.lastDateMs && (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" /> Closes {formatDate(d.lastDateMs)}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(d.skills ?? []).slice(0, 4).map((s) => (
                <span key={s} className="rounded-md bg-section px-2 py-0.5 text-xs text-foreground">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-heading">{d.packageLabel}</span>
              <Button variant="outline" size="sm">
                View applicants
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
