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
import { useAuth } from "@/hooks/auth/use-auth";
import { useFullProfile, useUpdateSettings } from "@/features/profile";
import { ROUTES } from "@/constants/routes";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { SwitchField } from "@/components/ui/switch";

const PREF_LABELS = [
  {
    key: "drives",
    label: "New placement drives",
    description: "When the TPO office publishes a new drive you're eligible for.",
  },
  {
    key: "interviews",
    label: "Interview schedules",
    description: "Invites, reschedules and reminders.",
  },
  {
    key: "applications",
    label: "Application status updates",
    description: "Shortlists, rejections and offer releases.",
  },
  {
    key: "announcements",
    label: "Admin announcements",
    description: "Notices from the Placement Cell.",
  },
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
        <h1 className="text-display-sm font-bold text-heading">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account */}
      <SectionCard title="Account">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-heading">College Email</p>
              <p className="break-all text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success-ink">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
            </span>
          </div>
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-heading">Profile</p>
              <p className="text-sm text-muted-foreground">
                Edit your personal, academic &amp; professional details.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
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
          {PREF_LABELS.map(({ key, label, description }) => (
            <SwitchField
              key={key}
              label={label}
              description={description}
              checked={prefs[key]}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
            />
          ))}
        </div>
      </SectionCard>

      {/* Privacy */}
      <SectionCard title="Privacy" action={<Eye className="h-4 w-4 text-muted-foreground" />}>
        <SwitchField
          label="Make my profile visible to recruiters"
          description="Recruiters can find you in candidate search and shortlist you directly."
          checked={visible}
          onCheckedChange={setVisible}
        />
      </SectionCard>

      {/* Connected accounts */}
      <SectionCard title="Connected Accounts" action={<Link2 className="h-4 w-4 text-muted-foreground" />}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="flex items-center gap-2 text-sm text-heading">
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </span>
            <span className="min-w-0 break-all text-sm text-muted-foreground">
              {full?.professional.github || "Not connected"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="flex items-center gap-2 text-sm text-heading">
              <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
            </span>
            <span className="min-w-0 break-all text-sm text-muted-foreground">
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

      {/* Save is the primary action, so on mobile it sits first (thumb reach)
          and full-width; logout stays visually secondary. */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
          <LogOut /> Logout
        </Button>
        <Button
          variant="gold"
          onClick={savePrefs}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
