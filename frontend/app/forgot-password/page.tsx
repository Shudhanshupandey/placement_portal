import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/features/auth";

/** Password reset for management accounts (recruiters/admins). Students use OTP. */
export default function ForgotPasswordPage() {
  return (
    <AuthShell portalLabel="Management Portal">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
