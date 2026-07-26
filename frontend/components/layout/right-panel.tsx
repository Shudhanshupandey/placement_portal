"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Bell } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { Progress } from "@/components/ui/progress";
import { useNotifications, NotificationItem } from "@/features/notifications";

export function RightPanel() {
  const { profile } = useAuth();
  const { notifications } = useNotifications();
  const pct = profile?.completionPercentage ?? 0;
  const recent = notifications.slice(0, 4);

  return (
    <aside
      aria-label="Profile summary and recent activity"
      className="hidden w-80 shrink-0 border-l border-border bg-card/40 xl:block"
    >
      <div className="sticky top-[var(--topbar-h)] space-y-5 p-5">
        {/* Completion nudge */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="text-sm font-semibold text-heading">Profile Strength</p>
          </div>
          <div className="mt-2 flex items-end gap-1.5">
            <span className="text-3xl font-bold text-heading">{pct}%</span>
            <span className="pb-1 text-xs text-muted-foreground">complete</span>
          </div>
          <Progress value={pct} className="mt-2.5" />
          {pct < 100 && (
            <Link
              href={ROUTES.onboarding}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Finish your profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-border bg-card p-2 shadow-soft">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold text-heading">Recent Activity</p>
            <Link href={ROUTES.student.notifications} className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Bell className="h-6 w-6 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">Nothing new right now.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recent.map((n) => (
                <NotificationItem key={n.id} notification={n} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
