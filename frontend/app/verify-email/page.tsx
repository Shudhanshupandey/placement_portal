import Link from "next/link";
import { MailCheck } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-section px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MailCheck className="h-8 w-8" />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-heading">Verify your email</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We&apos;ve sent a verification link to your email. Open it to confirm your address,
          then sign in. Recruiter accounts also require admin approval.
        </p>
      </div>
      <Link
        href={ROUTES.portal}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-light"
      >
        Continue to sign in
      </Link>
    </main>
  );
}
