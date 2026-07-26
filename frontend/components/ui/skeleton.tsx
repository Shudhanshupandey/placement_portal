import { cn } from "@/lib/utils";

/**
 * Loading placeholder.
 *
 * A sheen sweeps across the surface rather than the whole block pulsing: on a
 * page full of skeletons, synchronised opacity pulsing reads as a flicker,
 * while a directional sweep reads as progress. `prefers-reduced-motion` drops
 * both animations (see styles/globals.css) and leaves a static grey block.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-lg bg-border/50",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-white/55 after:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
