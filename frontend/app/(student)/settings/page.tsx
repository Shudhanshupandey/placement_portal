"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  Bell,
  Lock,
  Eye,
  Link2,
  LogOut,
  Pencil,
  Github,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth/use-auth";
import { useFullProfile, useUpdateSettings } from "@/features/profile";
import { ROUTES } from "@/constants/routes";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

const PREF_LABELS = [
  { key: "drives", label: "New placement drives" },
  { key: "interviews", label: "Interview schedules" },
  { key: "applications", label: "Application status updates" },
  { key: "announcements", label: "Admin announcements" },
] as const;

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: full } = useFullProfile();
  const updateSettings = useUpdateSettings();
  const router = useRouter();

  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({
    drives: true,
    interviews: true,
    applications: true,
    announcements: true,
  });
  const [visible, setVisible] = React.useState(true);
  const saving = updateSettings.isPending;

  const savePrefs = () => {
    if (!user) return;
    updateSettings.mutate(
      { notificationPrefs: prefs, recruiterVisible: visible },
      {
        onSuccess: () => toast.success("Settings saved"),
        onError: () => toast.error("Couldn't save settings"),
      }
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES.studentLogin);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Account */}
      <SectionCard title="Account">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-heading">College Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-heading">Profile</p>
              <p className="text-sm text-muted-foreground">Edit your personal, academic & professional details.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.onboarding}>
                <Pencil /> Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-heading">Password</p>
            <p className="text-sm text-muted-foreground">
              Your account uses secure email OTP sign-in — there&apos;s no password to manage.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        title="Notification Preferences"
        action={<Bell className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="divide-y divide-border">
          {PREF_LABELS.map(({ key, label }) => (
            <Toggle
              key={key}
              label={label}
              checked={prefs[key]}
              onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
            />
          ))}
        </div>
      </SectionCard>

      {/* Privacy */}
      <SectionCard title="Privacy" action={<Eye className="h-4 w-4 text-muted-foreground" />}>
        <Toggle
          label="Make my profile visible to recruiters"
          checked={visible}
          onChange={setVisible}
        />
      </SectionCard>

      {/* Connected accounts */}
      <SectionCard title="Connected Accounts" action={<Link2 className="h-4 w-4 text-muted-foreground" />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-heading">
              <Github className="h-4 w-4" /> GitHub
            </span>
            <span className="text-sm text-muted-foreground">
              {full?.professional.github || "Not connected"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-heading">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </span>
            <span className="text-sm text-muted-foreground">
              {full?.professional.linkedin || "Not connected"}
            </span>
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-1">
            <Link href={`${ROUTES.onboarding}?step=2`}>
              <Pencil /> Manage links
            </Link>
          </Button>
        </div>
      </SectionCard>

      <div className="flex items-center justify-between">
        <Button variant="destructive" onClick={handleSignOut}>
          <LogOut /> Logout
        </Button>
        <Button variant="gold" onClick={savePrefs} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
