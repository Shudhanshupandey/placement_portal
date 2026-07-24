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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-heading">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, and if it persists,
          contact the TPO office.
        </p>
      </div>
      <Button onClick={reset}>
        <RotateCcw /> Try again
      </Button>
    </main>
  );
}
