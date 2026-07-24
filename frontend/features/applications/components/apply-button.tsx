"use client";

import { Button } from "@/components/ui/button";
import { isDeadlinePassed, type PlacementDrive } from "@/features/placement-drives";
import { useMyApplications } from "@/features/applications/hooks/use-applications";
import { ApplyDialog } from "@/features/applications/components/apply-dialog";
import { StatusBadge } from "@/features/applications/components/status-badge";

export function ApplyButton({ drive }: { drive: PlacementDrive }) {
  const { data: apps } = useMyApplications();
  const existing = apps?.find((a) => a.driveId === drive.id);

  if (existing) {
    return <StatusBadge status={existing.status} />;
  }
  if (isDeadlinePassed(drive.lastDateMs)) {
    return (
      <Button size="sm" variant="outline" disabled>
        Closed
      </Button>
    );
  }
  return (
    <ApplyDialog drive={drive}>
      <Button size="sm" variant="gold">
        Apply now
      </Button>
    </ApplyDialog>
  );
}
