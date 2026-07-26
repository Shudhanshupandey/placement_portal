"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Dev only: in production the full Error (message + stack) must not reach
    // the browser console, where it leaks internals to anyone with DevTools.
    // Next already reports the server-side error; `digest` is the safe handle
    // shown to users for correlating with those logs.
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="page-gutter flex min-h-safe-screen flex-col items-center justify-center gap-4 bg-background py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-display-sm font-semibold text-heading">Something went wrong</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, and if it persists,
          contact the TPO office.
        </p>
      </div>
      <Button onClick={reset}>
        <RotateCcw /> Try again
      </Button>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Ref: {error.digest}</p>
      )}
    </main>
  );
}
