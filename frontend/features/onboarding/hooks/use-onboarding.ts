"use client";

import * as React from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";
import { onboardingService } from "@/features/onboarding/services/onboarding.service";
import type {
  OnboardingData,
  PersonalFormValues,
  AcademicFormValues,
  ProfessionalFormValues,
  DocumentsFormValues,
} from "@/features/onboarding/schemas";

export const TOTAL_STEPS = 4;

const EMPTY: OnboardingData = {
  personal: {} as PersonalFormValues,
  academic: {},
  professional: {},
  documents: {},
};

interface UseOnboardingOptions {
  initialStep?: number;
  /** Pre-load existing profile data (used when editing sections later). */
  initialData?: Partial<OnboardingData>;
}

export function useOnboarding(
  onFinished: (percentage: number) => void,
  options: UseOnboardingOptions = {}
) {
  const { user, refreshProfile } = useAuth();
  const qc = useQueryClient();
  const [step, setStep] = React.useState(options.initialStep ?? 0);
  const [data, setData] = React.useState<OnboardingData>({
    personal: { ...EMPTY.personal, ...(options.initialData?.personal ?? {}) } as PersonalFormValues,
    academic: options.initialData?.academic ?? {},
    professional: options.initialData?.professional ?? {},
    documents: options.initialData?.documents ?? {},
  });
  const [submitting, setSubmitting] = React.useState(false);

  const finish = React.useCallback(
    async (override?: Partial<OnboardingData>) => {
      if (!user) {
        toast.error("Your session expired. Please sign in again.");
        return;
      }
      setSubmitting(true);
      try {
        const finalData: OnboardingData = { ...data, ...override };
        const email = user.email ?? "";
        const { completionPercentage } = await onboardingService.save(
          user.uid,
          email,
          finalData
        );
        await refreshProfile();
        // Refresh the cached full profile so profile/skills/documents pages update.
        await qc.invalidateQueries({ queryKey: ["full-profile", user.uid] });
        toast.success("Profile saved successfully");
        onFinished(completionPercentage);
      } catch (err) {
        toast.error("Couldn't save your profile", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [user, data, refreshProfile, onFinished, qc]
  );

  const submitPersonal = React.useCallback((values: PersonalFormValues) => {
    setData((d) => ({ ...d, personal: values }));
    setStep(1);
  }, []);

  const submitAcademic = React.useCallback((values: AcademicFormValues) => {
    setData((d) => ({ ...d, academic: values }));
    setStep(2);
  }, []);

  const submitProfessional = React.useCallback((values: ProfessionalFormValues) => {
    setData((d) => ({ ...d, professional: values }));
    setStep(3);
  }, []);

  const submitDocuments = React.useCallback(
    (values: DocumentsFormValues) => finish({ documents: values }),
    [finish]
  );

  const skip = React.useCallback(() => {
    setStep((s) => {
      if (s >= TOTAL_STEPS - 1) {
        void finish();
        return s;
      }
      return s + 1;
    });
  }, [finish]);

  const back = React.useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  return {
    step,
    data,
    submitting,
    submitPersonal,
    submitAcademic,
    submitProfessional,
    submitDocuments,
    skip,
    back,
  };
}
