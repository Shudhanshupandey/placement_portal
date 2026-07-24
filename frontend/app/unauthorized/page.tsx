import Link from "next/link";
import { ShieldX } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
        <ShieldX className="h-8 w-8" />
      </span>
      <div>
        <p className="text-5xl font-bold text-heading">403</p>
        <h1 className="mt-1 text-lg font-semibold text-heading">Access denied</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          You don&apos;t have permission to view this page with your current role.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href={ROUTES.studentLogin}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-section"
        >
          Student Portal
        </Link>
        <Link
          href={ROUTES.portal}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-light"
        >
          Management Portal
        </Link>
      </div>
    </main>
  );
}
