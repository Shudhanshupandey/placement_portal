"use client";

import { toast } from "sonner";
import { Download, FileText, Loader2, Clock, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHeader, StatusPill, type PillTone } from "@/components/dashboard";
import { formatDate, inr } from "@/utils/format";
import { MOCK_REPORTS, type MockReport, type ReportStatus } from "@/data/mock";

const STATUS: Record<ReportStatus, { tone: PillTone; icon: typeof FileText; label: string }> = {
  ready: { tone: "success", icon: FileText, label: "Ready" },
  generating: { tone: "info", icon: Loader2, label: "Generating" },
  scheduled: { tone: "warning", icon: Clock, label: "Scheduled" },
  failed: { tone: "error", icon: CircleAlert, label: "Failed" },
};

function ReportRow({ r }: { r: MockReport }) {
  const s = STATUS[r.status];
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-heading">{r.title}</h2>
          <StatusPill tone={s.tone}>{s.label}</StatusPill>
          <span className="rounded-md bg-section px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {r.format}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {r.category} · {inr(r.records)} records · {r.sizeLabel} · generated {formatDate(r.generatedAtMs)} by{" "}
          {r.generatedBy}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={r.status !== "ready"}
        onClick={() => toast.success(`Downloading “${r.title}” (demo)`)}
      >
        <Download /> Download
      </Button>
    </article>
  );
}

export default function AdminReportsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Reports"
        description="Placement, company and compliance reports for the current cycle."
      />
      <div className="space-y-3">
        {MOCK_REPORTS.map((r) => (
          <ReportRow key={r.id} r={r} />
        ))}
      </div>
    </PageShell>
  );
}