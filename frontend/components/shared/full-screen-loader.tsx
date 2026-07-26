import { Loader2 } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-logo";

export function FullScreenLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-safe-screen flex-col items-center justify-center gap-4 bg-background px-6"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <Loader2
          className="absolute h-16 w-16 animate-spin text-primary/15"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <BrandMark size="md" priority />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
