"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { StepIndicator } from "@/features/onboarding/components/step-indicator";
import { PersonalStep } from "@/features/onboarding/components/steps/personal-step";

/**
 * Only one step is on screen at a time, so shipping all four in the initial
 * chunk makes every student download three forms (and their validation
 * schemas, uploaders and tag inputs) they may skip entirely. Step 0 stays
 * eager — it renders immediately; the rest are fetched on navigation.
 */
const StepFallback = () => (
  <div className="min-h-[22rem] animate-pulse space-y-4" aria-busy="true">
    <div className="h-4 w-1/3 rounded bg-section" />
    <div className="h-11 rounded-lg bg-section" />
    <div className="h-11 rounded-lg bg-section" />
    <div className="h-11 rounded-lg bg-section" />
  </div>
);

const AcademicStep = dynamic(
  () =>
    import("@/features/onboarding/components/steps/academic-step").then(
      (m) => m.AcademicStep
    ),
  { loading: StepFallback }
);
const ProfessionalStep = dynamic(
  () =>
    import("@/features/onboarding/components/steps/professional-step").then(
      (m) => m.ProfessionalStep
    ),
  { loading: StepFallback }
);
const DocumentsStep = dynamic(
  () =>
    import("@/features/onboarding/components/steps/documents-step").then(
      (m) => m.DocumentsStep
    ),
  { loading: StepFallback }
);

const STEPS = [
  { title: "Personal Details", description: "Tell us who you are. This step is required." },
  { title: "Academic Details", description: "Your course and academic record. You can skip this." },
  { title: "Professional Details", description: "Skills, projects and profiles. You can skip this." },
  { title: "Documents", description: "Upload your resume and certificates. You can skip this." },
];

import type { OnboardingData } from "@/features/onboarding/schemas";

interface OnboardingWizardProps {
  onFinished: (percentage: number) => void;
  initialStep?: number;
  initialData?: Partial<OnboardingData>;
}

export function OnboardingWizard({
  onFinished,
  initialStep,
  initialData,
}: OnboardingWizardProps) {
  const { user } = useAuth();
  const {
    step,
    data,
    submitting,
    submitPersonal,
    submitAcademic,
    submitProfessional,
    submitDocuments,
    skip,
    back,
  } = useOnboarding(onFinished, { initialStep, initialData });

  const shared = { submitting, step, onBack: back, onSkip: skip };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-primary-foreground shadow-soft">
          <GraduationCap className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Welcome to SAITM Placement Portal</p>
          <h1 className="text-lg font-bold text-heading">Complete your profile</h1>
        </div>
      </div>

      <div className="card-surface p-6 sm:p-8">
        <StepIndicator steps={STEPS} current={step} />

        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 0 && (
                <PersonalStep
                  {...shared}
                  defaultValues={data.personal}
                  email={user?.email ?? ""}
                  onSubmit={submitPersonal}
                />
              )}
              {step === 1 && (
                <AcademicStep
                  {...shared}
                  defaultValues={data.academic}
                  onSubmit={submitAcademic}
                />
              )}
              {step === 2 && (
                <ProfessionalStep
                  {...shared}
                  defaultValues={data.professional}
                  onSubmit={submitProfessional}
                />
              )}
              {step === 3 && (
                <DocumentsStep
                  {...shared}
                  defaultValues={data.documents}
                  onSubmit={submitDocuments}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
