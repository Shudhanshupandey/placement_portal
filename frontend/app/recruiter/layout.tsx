import { RequireRole } from "@/components/shared/require-role";

/**
 * Every /recruiter route requires the recruiter role (login lives at /portal).
 * Approval/verification gating is handled by the pages themselves and middleware.
 */
export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole role="recruiter">{children}</RequireRole>;
}
