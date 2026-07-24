"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  CalendarClock,
  Megaphone,
  Bell,
  ArrowRight,
  FileUser,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useFullProfile, getMissingItems } from "@/features/profile";
import { useDrives, DriveCard, formatDate } from "@/features/placement-drives";
import {
  useMyApplications,
  ApplyButton,
  ApplicationStats,
  StatusBadge,
} from "@/features/applications";
import { useNotifications, NotificationItem } from "@/features/notifications";
import { WelcomeHero } from "@/features/dashboard/components/welcome-hero";
import { StatTiles } from "@/features/dashboard/components/stat-tiles";
import { CompletionCard } from "@/features/dashboard/components/completion-card";

const QUICK_ACTIONS = [
  { label: "Browse Drives", href: ROUTES.student.placementDrives, icon: Briefcase },
  { label: "My Applications", href: ROUTES.student.applications, icon: FileText },
  { label: "Update Resume", href: ROUTES.student.resume, icon: FileUser },
  { label: "Complete Profile", href: ROUTES.onboarding, icon: UserCog },
];

export function DashboardHome() {
  const { user, profile } = useAuth();
  const { data: full } = useFullProfile();
  const drivesQ = useDrives();
  const appsQ = useMyApplications();
  const { notifications } = useNotifications();

  const pct = profile?.completionPercentage ?? 0;
  const missing = full ? getMissingItems(full) : [];
  const drives = drivesQ.data ?? [];
  const apps = appsQ.data ?? [];

  const upcomingDrives = drives.slice(0, 3);
  const recentApps = apps.slice(0, 4);
  const interviews = apps.filter((a) => a.status === "interview_scheduled");
  const announcements = notifications.filter((n) => n.type === "announcement").slice(0, 4);
  const activity = notifications.slice(0, 5);

  return (
    <div className="space-y-6">
      <WelcomeHero
        name={(profile?.fullName ?? "Student").split(" ")[0]}
        course={full?.academic.course}
        branch={full?.academic.branch}
        year={full?.academic.currentYear}
        pct={pct}
      />

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
          <Button key={label} asChild variant="outline" size="sm">
            <Link href={href}>
              <Icon /> {label}
            </Link>
          </Button>
        ))}
      </div>

      <StatTiles applications={apps} drivesCount={drives.length} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Upcoming Placement Drives"
            description="New opportunities approved by the TPO office."
            action={
              <Link
                href={ROUTES.student.placementDrives}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
            bodyClassName="space-y-4"
          >
            {drivesQ.isLoading ? (
              <>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </>
            ) : upcomingDrives.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No active drives right now"
                description="When the TPO office approves a placement drive, it will appear here instantly."
              />
            ) : (
              upcomingDrives.map((drive) => (
                <DriveCard key={drive.id} drive={drive} renderApply={(d) => <ApplyButton drive={d} />} />
              ))
            )}
          </SectionCard>

          <SectionCard
            title="Recently Applied"
            description="Companies you've recently applied to."
            action={
              <Link
                href={ROUTES.student.applications}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
            bodyClassName={recentApps.length ? "divide-y divide-border p-0" : undefined}
          >
            {appsQ.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : recentApps.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Apply to a placement drive and it will show up here."
                action={
                  <Button asChild size="sm" variant="gold">
                    <Link href={ROUTES.student.placementDrives}>Browse drives</Link>
                  </Button>
                }
              />
            ) : (
              recentApps.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                    {a.companyName?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-heading">{a.role}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.companyName} · Applied {formatDate(a.appliedAtMs)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <CompletionCard pct={pct} missing={missing} />

          <SectionCard title="Application Statistics">
            <ApplicationStats applications={apps} />
          </SectionCard>

          <SectionCard title="Upcoming Interviews">
            {interviews.length === 0 ? (
              <EmptyState icon={CalendarClock} title="No interviews scheduled" />
            ) : (
              <ul className="space-y-3">
                {interviews.map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10 text-info">
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-heading">{a.role}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.companyName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Announcements + Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Important Announcements"
          action={
            <Link
              href={ROUTES.student.announcements}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
          bodyClassName="p-2"
        >
          {announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements yet" className="border-0 bg-transparent" />
          ) : (
            <div className="space-y-0.5">
              {announcements.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          action={
            <Link
              href={ROUTES.student.notifications}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
          bodyClassName="p-2"
        >
          {activity.length === 0 ? (
            <EmptyState icon={Bell} title="Nothing here yet" className="border-0 bg-transparent" />
          ) : (
            <div className="space-y-0.5">
              {activity.map((n) => (
                <NotificationItem key={n.id} notification={n} compact />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
