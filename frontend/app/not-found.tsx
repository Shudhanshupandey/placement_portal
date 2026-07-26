import Link from "next/link";
import { Compass } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="page-gutter flex min-h-safe-screen flex-col items-center justify-center gap-4 bg-background py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <div>
        <p className="text-display-lg font-bold text-heading">404</p>
        <h1 className="mt-1 text-lg font-semibold text-heading">Page not found</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href={ROUTES.student.dashboard}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-light"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
