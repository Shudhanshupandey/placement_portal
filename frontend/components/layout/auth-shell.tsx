import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary-gradient p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <Link href="/" className="relative inline-flex flex-col gap-2">
          <BrandLogo variant="full-white" priority className="h-11" />
          <span className="pl-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {portalLabel}
          </span>
        </Link>

        <div className="relative max-w-md space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
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
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-gold" />
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
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col gap-1.5 lg:hidden">
            <BrandLogo variant="full-navy" priority className="h-9" />
            <span className="pl-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {portalLabel}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
