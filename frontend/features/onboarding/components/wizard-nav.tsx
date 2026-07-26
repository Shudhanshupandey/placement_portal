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
    // Three buttons will not sit on one line at 360px. On mobile the primary
    // action goes full-width on its own row with Previous/Skip beneath it;
    // `flex-col-reverse` keeps Continue first in the DOM for tab order while
    // rendering it on top, where the thumb is.
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {!isFirst && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={submitting}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft /> Previous
          </Button>
        )}
        {!isFirst && (
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={submitting}
            className="flex-1 sm:hidden"
          >
            Skip for now
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
            className="hidden sm:inline-flex"
          >
            Skip for now
          </Button>
        )}
        <Button
          type="submit"
          variant={isLast ? "gold" : "default"}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
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
