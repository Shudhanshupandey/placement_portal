import { Building2, Users, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { RecruiterRegisterForm } from "@/features/auth";

/** Recruiter self-registration (part of the Management Portal). */
export default function PortalRegisterPage() {
  return (
    <AuthShell
      portalLabel="Management Portal"
      headline={
        <>
          Hire top talent from <span className="text-gold">SAITM</span>.
        </>
      }
      subline="Register to post jobs, discover eligible candidates, and manage your campus recruitment in one place."
      highlights={[
        { icon: Building2, label: "Post drives & job openings" },
        { icon: Users, label: "Search & shortlist candidates" },
        { icon: ShieldCheck, label: "Verified, admin-approved access" },
      ]}
    >
      <RecruiterRegisterForm />
    </AuthShell>
  );
}
