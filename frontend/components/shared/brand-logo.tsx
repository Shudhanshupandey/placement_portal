import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official SAITM brand marks. Every logo file lives in `public/logos`; this is the
 * single place that maps a semantic variant to the correct asset so callers never
 * hard-code file names or pick the wrong colour treatment for their background.
 *
 * Choosing a variant:
 *  - `full-navy`  → navy wordmark on LIGHT backgrounds (cards, light headers)
 *  - `full-white` → white wordmark on DARK backgrounds (navy sidebar / brand panels)
 *  - `full-gold`  → gold wordmark on DARK backgrounds (premium accents)
 *  - `seal`       → circular crest only (favicons, collapsed rails, loaders, avatars)
 */
export type BrandLogoVariant = "full-navy" | "full-white" | "full-gold" | "seal";

const DEFAULT_ALT = "St. Andrews Institute of Technology & Management";

const VARIANTS: Record<
  BrandLogoVariant,
  { src: string; width: number; height: number; alt: string }
> = {
  "full-navy": {
    src: "/logos/main-logo-No-bg_huojel.png",
    width: 1713,
    height: 497,
    alt: DEFAULT_ALT,
  },
  "full-white": {
    src: "/logos/footer-logo-white-txt.png",
    width: 1272,
    height: 330,
    alt: DEFAULT_ALT,
  },
  "full-gold": {
    src: "/logos/footer-logo-gold.png",
    width: 2025,
    height: 528,
    alt: DEFAULT_ALT,
  },
  seal: {
    src: "/logos/circle-logo-no-bg_ulsott.png",
    width: 832,
    height: 952,
    alt: "SAITM crest",
  },
};

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  /** Size the logo with height utilities + `w-auto` (e.g. "h-10 w-auto"). */
  className?: string;
  /** Override the accessible name (defaults per variant). Pass "" for decorative. */
  alt?: string;
  /** Set for above-the-fold marks (auth panels, app shell) to skip lazy-loading. */
  priority?: boolean;
}

/** Renders the correct SAITM logo asset for the given variant. */
export function BrandLogo({
  variant = "full-navy",
  className,
  alt,
  priority = false,
}: BrandLogoProps) {
  const cfg = VARIANTS[variant];
  return (
    <Image
      src={cfg.src}
      width={cfg.width}
      height={cfg.height}
      alt={alt ?? cfg.alt}
      priority={priority}
      className={cn("w-auto select-none", className)}
    />
  );
}
