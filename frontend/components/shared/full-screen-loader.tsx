import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

export function FullScreenLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <Loader2
          className="absolute h-16 w-16 animate-spin text-primary/15"
          strokeWidth={1.5}
        />
        <BrandLogo variant="seal" priority className="h-11" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
