"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOTAL_STEPS } from "@/features/onboarding/hooks/use-onboarding";

interface WizardNavProps {
  step: number;
  submitting: boolean;
  onBack: () => void;
  onSkip: () => void;
}

/**
 * Renders under each step's form.
 * The "Continue"/"Finish" button is type="submit" and triggers the step's
 * own validation. Back/Skip are type="button" (no validation).
 */
export function WizardNav({ step, submitting, onBack, onSkip }: WizardNavProps) {
  const isFirst = step === 0;
  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
      <div>
        {!isFirst && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={submitting}
          >
            <ArrowLeft /> Previous
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isFirst && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={submitting}
          >
            Skip for now
          </Button>
        )}
        <Button type="submit" variant={isLast ? "gold" : "default"} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : isLast ? (
            <>
              Finish <Check />
            </>
          ) : (
            <>
              Continue <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
