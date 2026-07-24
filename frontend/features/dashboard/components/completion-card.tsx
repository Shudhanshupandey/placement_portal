"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SECTION_STEP, type MissingItem } from "@/features/profile";

interface CompletionCardProps {
  pct: number;
  missing: MissingItem[];
}

export function CompletionCard({ pct, missing }: CompletionCardProps) {
  const complete = pct >= 100 && missing.length === 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-heading">Profile Completion</h2>
          <p className="text-sm text-muted-foreground">
            {complete
              ? "Your profile is complete — you're ready to apply."
              : "Complete your profile to apply for placement drives."}
          </p>
        </div>
        <span className="shrink-0 text-2xl font-bold text-heading">{pct}%</span>
      </div>

      <Progress value={pct} className="mt-3" />

      {complete ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/8 px-3 py-2.5 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> All essential sections completed.
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Missing sections
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 6).map((m) => (
              <Link
                key={m.key}
                href={`${ROUTES.onboarding}?step=${SECTION_STEP[m.section]}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-section px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <AlertCircle className="h-3.5 w-3.5 text-warning" />
                {m.label} missing
              </Link>
            ))}
          </div>
          <Button asChild variant="gold" size="sm" className="mt-4">
            <Link href={ROUTES.onboarding}>
              Complete profile <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
