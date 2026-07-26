import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * SAITM brand marks.
 *
 * ── Why this file has two very different components ──────────────────────────
 * The official artwork in `public/logos` is a ~3.9:1 banner carrying three lines
 * of fine serif text plus gold flourishes. That lockup is designed for a wide
 * letterhead, and it falls apart in app chrome: rendered at the 28–36px height a
 * sidebar or topbar allows, the wordmark is ~110px wide with a ~5px cap-height —
 * an illegible smudge, and `footer-logo-white-txt.png` is a ghosted outline that
 * all but vanishes on navy.
 *
 * So the app uses a proper lockup instead:
 *
 *  • `BrandMark`   — the circular crest on its own. A badge reads correctly at
 *                    small sizes, and its gold rim separates it from both light
 *                    and dark surfaces, so one asset covers every background.
 *  • `BrandLockup` — crest + a LIVE typographic wordmark set in the app's own
 *                    typeface. Text stays razor-sharp at any size, scales with
 *                    the layout, and takes its colour from `tone`, which is what
 *                    makes "white on dark / navy on light" automatic.
 *  • `BrandLogo`   — the original raster banner, kept for the few surfaces with
 *                    real width to give it (the auth brand panel, print headers).
 *
 * Accessible naming: the crest is decorative whenever a text wordmark sits next
 * to it, and the full institute name is exposed once, on the lockup's root.
 */

const INSTITUTE_NAME = "St. Andrews Institute of Technology & Management";

// ── Crest ────────────────────────────────────────────────────────────────────

/**
 * Intrinsic size passed to `next/image` per visual size. Kept close to the real
 * render size (rather than the asset's native 832×952) so Next generates a small
 * srcset — the source PNG is ~650KB and must never ship at full resolution for a
 * 36px mark.
 */
const MARK_SIZES = {
  xs: { box: "h-7 w-7", px: 56 },
  sm: { box: "h-9 w-9", px: 72 },
  md: { box: "h-11 w-11", px: 88 },
  lg: { box: "h-14 w-14", px: 112 },
  xl: { box: "h-20 w-20", px: 160 },
} as const;

export type BrandMarkSize = keyof typeof MARK_SIZES;

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
  /** Pass "" (default) for decorative use beside a text wordmark. */
  alt?: string;
  priority?: boolean;
}

/** The SAITM crest. Safe on light and dark surfaces alike. */
export function BrandMark({
  size = "sm",
  className,
  alt = "",
  priority = false,
}: BrandMarkProps) {
  const { box, px } = MARK_SIZES[size];
  return (
    <Image
      src="/logos/circle-logo-no-bg_ulsott.png"
      width={px}
      height={px}
      alt={alt}
      aria-hidden={alt === "" || undefined}
      priority={priority}
      className={cn("shrink-0 select-none object-contain", box, className)}
    />
  );
}

// ── Lockup (crest + typographic wordmark) ────────────────────────────────────

const LOCKUP_SIZES = {
  sm: { mark: "xs", wordmark: "text-[15px]", sub: "text-[9px]", gap: "gap-2" },
  md: { mark: "sm", wordmark: "text-lg", sub: "text-[10px]", gap: "gap-2.5" },
  lg: { mark: "md", wordmark: "text-2xl", sub: "text-[11px]", gap: "gap-3" },
} as const;

export type BrandLockupSize = keyof typeof LOCKUP_SIZES;

interface BrandLockupProps {
  /** `dark` = for navy/photographic backgrounds; `light` = for white/paper. */
  tone?: "light" | "dark";
  size?: BrandLockupSize;
  /** Small caps line under the wordmark, e.g. "Student Portal". */
  subtitle?: string;
  /** Hide the wordmark and render the crest alone (collapsed sidebar rail). */
  markOnly?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * The primary brand lockup for app chrome. Renders the crest beside a live
 * "SAITM" wordmark, with an optional portal subtitle.
 */
export function BrandLockup({
  tone = "light",
  size = "md",
  subtitle,
  markOnly = false,
  className,
  priority = false,
}: BrandLockupProps) {
  const cfg = LOCKUP_SIZES[size];
  const dark = tone === "dark";

  return (
    <span
      className={cn("flex min-w-0 items-center", cfg.gap, className)}
      // One accessible name for the whole lockup; the crest and the split
      // wordmark/subtitle are decorative parts of it.
      role="img"
      aria-label={subtitle ? `${INSTITUTE_NAME} — ${subtitle}` : INSTITUTE_NAME}
    >
      <BrandMark
        size={cfg.mark}
        priority={priority}
        className={dark ? "drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]" : undefined}
      />
      {!markOnly && (
        <span className="flex min-w-0 flex-col leading-none" aria-hidden="true">
          <span
            className={cn(
              "font-bold tracking-[-0.01em]",
              cfg.wordmark,
              dark ? "text-white" : "text-heading"
            )}
          >
            SAITM
          </span>
          {subtitle && (
            <span
              className={cn(
                "mt-1 truncate font-semibold uppercase tracking-[0.16em]",
                cfg.sub,
                dark ? "text-gold" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

// ── Raster banner (wide surfaces only) ───────────────────────────────────────

/**
 * The official wide artwork. Only use where the layout can give it 240px+ of
 * width — below that the wordmark stops being readable and `BrandLockup` is the
 * correct choice.
 *
 *  - `full-navy`  → navy wordmark on LIGHT backgrounds
 *  - `full-white` → white wordmark on DARK backgrounds
 *  - `full-gold`  → gold wordmark on DARK backgrounds
 *  - `seal`       → crest only (prefer `BrandMark`)
 */
export type BrandLogoVariant = "full-navy" | "full-white" | "full-gold" | "seal";

const VARIANTS: Record<
  BrandLogoVariant,
  { src: string; width: number; height: number; alt: string }
> = {
  "full-navy": {
    src: "/logos/main-logo-No-bg_huojel.png",
    width: 856,
    height: 248,
    alt: INSTITUTE_NAME,
  },
  "full-white": {
    src: "/logos/footer-logo-white-txt.png",
    width: 848,
    height: 220,
    alt: INSTITUTE_NAME,
  },
  "full-gold": {
    src: "/logos/footer-logo-gold.png",
    width: 810,
    height: 211,
    alt: INSTITUTE_NAME,
  },
  seal: {
    src: "/logos/circle-logo-no-bg_ulsott.png",
    width: 160,
    height: 183,
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

/** Renders the wide SAITM artwork for the given variant. */
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
      aria-hidden={alt === "" || undefined}
      priority={priority}
      className={cn("w-auto select-none object-contain", className)}
    />
  );
}
