"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RequireAuth } from "@/components/shared/require-auth";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import { OnboardingWizard } from "@/features/onboarding";
import type { OnboardingData } from "@/features/onboarding";
import { useFullProfile } from "@/features/profile";
import type { FullStudentProfile } from "@/features/profile";
import { ROUTES } from "@/constants/routes";

function toInitialData(full: FullStudentProfile): Partial<OnboardingData> {
  const s = full.student;
  return {
    personal: s
      ? {
          fullName: s.fullName,
          gender: s.gender,
          dateOfBirth: s.dateOfBirth,
          mobileNumber: s.mobileNumber,
          alternateMobileNumber: s.alternateMobileNumber,
          aadhaarNumber: s.aadhaarNumber,
          category: s.category,
          bloodGroup: s.bloodGroup,
          address: s.address,
          city: s.city,
          state: s.state,
          pincode: s.pincode,
          photoUrl: s.photoUrl,
        }
      : undefined,
    academic: full.academic,
    professional: full.professional,
    documents: full.documents,
  };
}

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: full, isLoading } = useFullProfile();

  const stepParam = Number(searchParams.get("step"));
  const initialStep = Number.isInteger(stepParam) && stepParam >= 0 && stepParam <= 3 ? stepParam : 0;

  if (isLoading || !full) {
    return <FullScreenLoader label="Loading your profile…" />;
  }

  return (
    <OnboardingWizard
      onFinished={() => router.replace(ROUTES.student.dashboard)}
      initialStep={initialStep}
      initialData={toInitialData(full)}
    />
  );
}

export default function OnboardingPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<FullScreenLoader />}>
        <OnboardingInner />
      </Suspense>
    </RequireAuth>
  );
}
