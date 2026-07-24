"use client";

import { Toaster as SonnerToaster } from "sonner";

/** Brand-styled toaster. Mount once at the root layout. */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border bg-card text-foreground shadow-card",
          title: "text-heading font-semibold",
          description: "text-muted-foreground",
          success: "border-success/30",
          error: "border-error/30",
          actionButton: "bg-primary text-primary-foreground",
        },
      }}
    />
  );
}
