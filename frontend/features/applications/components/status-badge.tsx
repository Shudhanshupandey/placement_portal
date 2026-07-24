import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/features/applications/lib/status-meta";
import type { ApplicationStatus } from "@/features/applications/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.badge}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </Badge>
  );
}
