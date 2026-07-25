import { Building2, ShieldCheck, BarChart3 } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { ManagementLoginForm, DemoAccountsCard } from "@/features/auth";
import { IS_DEV_MODE } from "@/lib/dev-mode/flag";

/**
 * Management Portal — the single sign-in surface for recruiters and admins.
 * A Recruiter | Admin selector decides which credentials are accepted; the
 * role is revalidated server-side (custom claims + Firestore rules).
 */
export default function PortalLoginPage() {
  return (
    <AuthShell
      portalLabel="Management Portal"
      headline={
        <>
          Run campus placements with <span className="text-gold">confidence</span>.
        </>
      }
      subline="One secure console for recruiters and the SAITM Placement Cell — hiring, approvals, drives and analytics."
      highlights={[
        { icon: Building2, label: "Recruiters — post drives & shortlist talent" },
        { icon: ShieldCheck, label: "Admins — verify students & approve recruiters" },
        { icon: BarChart3, label: "Role-validated, audited access" },
      ]}
    >
      <ManagementLoginForm />
      {IS_DEV_MODE && <DemoAccountsCard />}
    </AuthShell>
  );
}
