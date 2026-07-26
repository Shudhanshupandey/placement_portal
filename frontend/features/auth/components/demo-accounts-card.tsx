"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, ShieldCheck, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeForRole } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { signInMockAccount } from "@/lib/dev-mode";
import { DEV_OTP, MOCK_ACCOUNTS, type MockAccount } from "@/data/mock";

/**
 * Demo Accounts card — surfaces the seeded demo credentials directly on the
 * login page and signs the visitor into any role with one click.
 *
 * This is a THIN presentational layer over the existing mock-auth layer: it
 * reuses {@link MOCK_ACCOUNTS} and {@link signInMockAccount} verbatim, adding no
 * authentication logic of its own. The floating dev toolbar still exists; this
 * simply puts the same one-click sign-in where a first-time visitor looks for
 * it — inside the login form.
 *
 * The caller gates rendering behind `IS_DEV_MODE`, so with demo mode off this
 * component, its imports and every seeded credential are eliminated by
 * dead-code elimination and never reach the production bundle.
 */

const ROLE_ICON: Record<Role, typeof GraduationCap> = {
  student: GraduationCap,
  recruiter: Building2,
  admin: ShieldCheck,
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  recruiter: "Recruiter",
  admin: "Admin",
};

function AccountRow({
  account,
  onSignIn,
  busy,
}: {
  account: MockAccount;
  onSignIn: (account: MockAccount) => void;
  busy: boolean;
}) {
  const Icon = ROLE_ICON[account.role];
  const secretLabel = account.role === "student" ? "OTP" : "Password";
  const secret = account.role === "student" ? DEV_OTP : (account.password ?? "");

  return (
    <li className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-heading">{ROLE_LABEL[account.role]}</p>
      </div>

      <dl className="mt-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <dt className="w-16 shrink-0 text-muted-foreground">Email</dt>
          <dd className="truncate font-medium text-foreground">{account.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-16 shrink-0 text-muted-foreground">{secretLabel}</dt>
          <dd className="truncate font-mono font-medium text-foreground">{secret}</dd>
        </div>
      </dl>

      <Button
        size="sm"
        variant="brand"
        className="mt-3 w-full"
        disabled={busy}
        onClick={() => onSignIn(account)}
      >
        Login as {ROLE_LABEL[account.role]}
      </Button>
    </li>
  );
}

export function DemoAccountsCard() {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  const signInAs = React.useCallback(
    (account: MockAccount) => {
      setBusy(true);
      // Establishes the session synchronously and writes the routing-hint cookie
      // through the mock provider, so the middleware sees it on this navigation.
      signInMockAccount(account);
      router.replace(homeForRole(account.role));
    },
    [router]
  );

  return (
    <section
      aria-label="Demo accounts"
      className="mt-6 overflow-hidden rounded-2xl border border-border bg-section shadow-soft"
    >
      <header className="flex items-start gap-2.5 border-b border-border bg-card px-4 py-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <FlaskConical className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-heading">Demo Accounts</p>
          <p className="text-xs text-muted-foreground">
            Use these demo accounts to explore the Placement Portal.
          </p>
        </div>
      </header>

      <ul className="space-y-2.5 p-3.5">
        {MOCK_ACCOUNTS.map((account) => (
          <AccountRow key={account.uid} account={account} onSignIn={signInAs} busy={busy} />
        ))}
      </ul>

      <p className="border-t border-border px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
        Sample data only — Firebase is not contacted. Disabling demo mode restores
        the real sign-in automatically.
      </p>
    </section>
  );
}
