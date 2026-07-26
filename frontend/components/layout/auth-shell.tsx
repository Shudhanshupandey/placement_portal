import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BrandLockup } from "@/components/shared/brand-logo";

const DEFAULT_HIGHLIGHTS = [
  { icon: Briefcase, label: "Live jobs & placement drives" },
  { icon: TrendingUp, label: "Track applications & interviews" },
  { icon: ShieldCheck, label: "Secure college-verified access" },
];

interface AuthShellProps {
  children: React.ReactNode;
  /** Small label shown under the SAITM wordmark (e.g., "Recruiter Portal"). */
  portalLabel?: string;
  headline?: React.ReactNode;
  subline?: string;
  highlights?: { icon: LucideIcon; label: string }[];
}

/** Premium split-screen wrapper shared by every authentication screen. */
export function AuthShell({
  children,
  portalLabel = "Placement Portal",
  headline,
  subline,
  highlights = DEFAULT_HIGHLIGHTS,
}: AuthShellProps) {
  return (
    <div className="grid min-h-safe-screen lg:grid-cols-2">
      {/* Brand panel — desktop only; `on-dark` switches focus rings to gold. */}
      <div className="on-dark relative hidden overflow-hidden bg-primary-gradient p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <Link href="/" className="relative inline-flex self-start rounded-xl">
          <BrandLockup tone="dark" size="lg" subtitle={portalLabel} priority />
        </Link>

        <div className="relative my-10 max-w-md space-y-6">
          <h2 className="text-display-lg font-bold text-white">
            {headline ?? (
              <>
                Your gateway to <span className="text-gold">career opportunities</span>.
              </>
            )}
          </h2>
          <p className="text-white/75">
            {subline ??
              "St. Andrews Institute of Technology & Management's official Training & Placement platform — built for students, recruiters and the TPO office."}
          </p>
          <ul className="space-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} SAITM. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-background px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex rounded-xl lg:hidden">
            <BrandLockup tone="light" size="md" subtitle={portalLabel} priority />
          </Link>
          {children}
          <p className="mt-10 text-center text-xs text-muted-foreground lg:hidden">
            © {new Date().getFullYear()} SAITM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
