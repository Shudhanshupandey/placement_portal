"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileUser,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useFullProfile, getApplyReadiness, SECTION_STEP } from "@/features/profile";
import type { PlacementDrive } from "@/features/placement-drives";
import { checkEligibility } from "@/features/applications/lib/eligibility";
import { useApplyToDrive } from "@/features/applications/hooks/use-applications";

interface ApplyDialogProps {
  drive: PlacementDrive;
  children: React.ReactNode; // trigger
}

export function ApplyDialog({ drive, children }: ApplyDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const { data: full, isLoading } = useFullProfile();
  const apply = useApplyToDrive();

  const readiness = full ? getApplyReadiness(full) : null;
  const eligibility = full ? checkEligibility(full, drive) : null;

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) setApplied(false);
  };

  const submit = () => {
    if (!full) return;
    apply.mutate(
      { full, drive },
      { onSuccess: () => setApplied(true) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {/* SUCCESS */}
        {applied ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
              <PartyPopper className="h-7 w-7" />
            </span>
            <DialogTitle className="mt-4">Applied successfully</DialogTitle>
            <DialogDescription className="mt-1">
              Your application to <b>{drive.companyName}</b> for <b>{drive.role}</b> has
              been submitted. Track its status in My Applications.
            </DialogDescription>
            <div className="mt-6 flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => router.push(ROUTES.student.applications)}>
                View applications <ArrowRight />
              </Button>
            </div>
          </div>
        ) : isLoading || !full || !readiness || !eligibility ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !readiness.ready ? (
          /* GATE — profile incomplete */
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-[#B45309]">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <DialogTitle>Complete your profile before applying</DialogTitle>
              </div>
              <DialogDescription>
                A few required details are missing. Complete them to apply for placement
                drives — it takes less than a minute.
              </DialogDescription>
            </DialogHeader>
            <ul className="space-y-2">
              {readiness.criticalMissing.map((m) => (
                <li
                  key={m.key}
                  className="flex items-center justify-between rounded-lg border border-border bg-section px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-heading">
                    <AlertCircle className="h-4 w-4 text-error" /> {m.label}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`${ROUTES.onboarding}?step=${SECTION_STEP[m.section]}`)
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Add now
                  </button>
                </li>
              ))}
            </ul>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => router.push(ROUTES.onboarding)}>
                Complete profile <ArrowRight />
              </Button>
            </DialogFooter>
          </>
        ) : !eligibility.eligible ? (
          /* NOT ELIGIBLE — explain why */
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/10 text-error">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <DialogTitle>You are not eligible for this drive</DialogTitle>
              </div>
              <DialogDescription>
                {drive.companyName} · {drive.role}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-xl border border-error/20 bg-error/5 p-4">
              <p className="text-sm font-semibold text-heading">Reason(s)</p>
              <ul className="space-y-1.5">
                {eligibility.reasons.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          /* CONFIRM — eligible, one-click */
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <DialogTitle>Confirm your application</DialogTitle>
              </div>
              <DialogDescription>
                You&apos;re eligible for <b>{drive.role}</b> at <b>{drive.companyName}</b>.
                We&apos;ll submit using your saved profile — no form to fill.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 rounded-xl bg-section p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-heading">
                <Sparkles className="h-4 w-4 text-gold" /> Application summary
              </p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Name</span>
                <span className="text-right font-medium text-heading">{full.student?.fullName}</span>
                <span>Course · Branch</span>
                <span className="text-right font-medium text-heading">
                  {full.academic.course} · {full.academic.branch}
                </span>
                <span>CGPA</span>
                <span className="text-right font-medium text-heading">{full.academic.currentCgpa}</span>
                <span>Resume</span>
                <span className="text-right font-medium text-heading">
                  {full.documents.resumeUrl ? (
                    <span className="inline-flex items-center gap-1 text-success">
                      <FileUser className="h-3.5 w-3.5" /> Attached
                    </span>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={apply.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="gold" onClick={submit} disabled={apply.isPending}>
                {apply.isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Confirm &amp; Apply <ArrowRight />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
