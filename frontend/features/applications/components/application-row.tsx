"use client";

import { MapPin, IndianRupee, CalendarDays, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/applications/components/status-badge";
import { StatusTimeline } from "@/features/applications/components/status-timeline";
import type { Application } from "@/features/applications/types";

function fmt(ms: number) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationRow({ app }: { app: Application }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
          {app.companyName?.[0]?.toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-heading">{app.role}</p>
          <p className="truncate text-sm text-muted-foreground">{app.companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground sm:justify-end">
        <span className="inline-flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5" /> {app.packageLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {app.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> {fmt(app.appliedAtMs)}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <StatusBadge status={app.status} />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4" /> Timeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {app.role} · {app.companyName}
              </DialogTitle>
            </DialogHeader>
            <div className="pt-2">
              <StatusTimeline timeline={app.timeline} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
