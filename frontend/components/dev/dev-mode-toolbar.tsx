"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FlaskConical,
  GraduationCap,
  Building2,
  ShieldCheck,
  LogOut,
  RotateCcw,
  X,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/use-auth";
import { homeForRole } from "@/constants/routes";
import type { Role } from "@/constants/roles";
import { DEV_MODE_REASON, mockDb, signInMockAccount, signOutMock } from "@/lib/dev-mode";
import { DEV_OTP, MOCK_ACCOUNTS, type MockAccount } from "@/data/mock";

/**
 * Floating development toolbar — the seeded credentials and a one-click way
 * into each portal.
 *
 * Rendered only when `IS_DEV_MODE` is true (gated in `app-providers.tsx`), so
 * it never reaches a production bundle. It is also the honest thing to do:
 * anyone looking at a screen full of fabricated data can see at a glance that
 * they are not looking at real placement records.
 */

const ROLE_ICON: Record<Role, typeof GraduationCap> = {
  student: GraduationCap,
  recruiter: Building2,
  admin: ShieldCheck,
};

const ROLE_LABEL: Record<Role, string> = {
  student: "Student Portal",
  recruiter: "Recruiter Portal",
  admin: "Admin Portal",
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard blocked (insecure origin) — the value is visible anyway.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="rounded p-1 text-muted-foreground transition-colors hover:bg-section hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function AccountRow({
  account,
  onSignIn,
}: {
  account: MockAccount;
  onSignIn: (account: MockAccount) => void;
}) {
  const Icon = ROLE_ICON[account.role];
  const secretLabel = account.role === "student" ? "OTP" : "Password";
  const secret = account.role === "student" ? DEV_OTP : (account.password ?? "");

  return (
    <li className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-heading">{ROLE_LABEL[account.role]}</p>
          <p className="truncate text-xs text-muted-foreground">{account.statusLabel}</p>

          <dl className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <dt className="w-16 shrink-0 text-muted-foreground">Email</dt>
              <dd className="truncate font-medium text-foreground">{account.email}</dd>
              <CopyButton value={account.email} label="email" />
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="w-16 shrink-0 text-muted-foreground">{secretLabel}</dt>
              <dd className="truncate font-medium text-foreground">{secret}</dd>
              <CopyButton value={secret} label={secretLabel.toLowerCase()} />
            </div>
          </dl>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => onSignIn(account)}
      >
        Sign in as {account.role}
      </Button>
    </li>
  );
}

export function DevModeToolbar() {
  const [open, setOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  const signInAs = React.useCallback(
    (account: MockAccount) => {
      // Establishes the session synchronously, which also writes the routing-hint
      // cookie through the provider — so the middleware sees it on this navigation.
      signInMockAccount(account);
      setOpen(false);
      router.replace(homeForRole(account.role));
    },
    [router]
  );

  const signOutAndReset = React.useCallback(() => {
    signOutMock();
    setOpen(false);
    router.replace("/");
  }, [router]);

  const resetData = React.useCallback(() => {
    mockDb.reset();
    signOutMock();
    window.location.href = "/";
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            aria-label="Development mode"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="mb-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <header className="flex items-start justify-between gap-2 bg-primary-gradient px-4 py-3 text-primary-foreground">
              <div>
                <p className="text-sm font-bold">Development Mode</p>
                <p className="text-xs opacity-80">
                  Mock auth &amp; sample data · {DEV_MODE_REASON}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Hide the development toolbar for this session"
                className="rounded p-1 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {user && (
                <p className="mb-3 rounded-lg bg-section px-3 py-2 text-xs text-muted-foreground">
                  Signed in as <span className="font-semibold text-heading">{user.email}</span>
                  {role ? ` · ${role}` : null}
                </p>
              )}

              <ul className="space-y-2">
                {MOCK_ACCOUNTS.map((account) => (
                  <AccountRow key={account.uid} account={account} onSignIn={signInAs} />
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={resetData}
                  title="Discard local changes and restore the original sample data"
                >
                  <RotateCcw /> Reset data
                </Button>
                {user && (
                  <Button size="sm" variant="ghost" className="flex-1" onClick={signOutAndReset}>
                    <LogOut /> Sign out
                  </Button>
                )}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Firebase is untouched. Set <code className="font-semibold">NEXT_PUBLIC_DEV_MODE=false</code>{" "}
                and add real credentials to switch back to production auth.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2.5 text-sm font-bold text-gold-foreground shadow-gold",
          "transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <FlaskConical className="h-4 w-4" />
        Dev Mode
      </button>
    </div>
  );
}
