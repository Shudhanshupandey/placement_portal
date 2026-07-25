"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  BadgeCheck,
  Building,
  Briefcase,
  TrendingUp,
  Trophy,
  UserCog,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import {
  KpiCard,
  KpiGrid,
  TrendArea,
  BarList,
  Funnel,
  ActivityFeed,
} from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  MOCK_ADMIN_STATS,
  MOCK_PLACEMENT_TREND,
  MOCK_BRANCH_PLACEMENT,
  MOCK_APPLICATION_FUNNEL,
  MOCK_ACTIVITY_TIMELINE,
  MOCK_RECRUITERS,
} from "@/data/mock";

const STAT_ICON: Record<string, LucideIcon> = {
  students: GraduationCap,
  placed: BadgeCheck,
  companies: Building,
  drives: Briefcase,
  avgPackage: TrendingUp,
  highestPackage: Trophy,
  pendingApprovals: UserCog,
  pendingVerifications: ShieldCheck,
};

function initials(name: string) {
  return name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminDashboardPage() {
  const pending = MOCK_RECRUITERS.filter((r) => r.approvalStatus === "pending").slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-heading sm:text-2xl">
          Placement overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Training &amp; Placement Cell — current cycle at a glance.
        </p>
      </div>

      <KpiGrid>
        {MOCK_ADMIN_STATS.map((tile) => (
          <KpiCard key={tile.key} tile={tile} icon={STAT_ICON[tile.key]} />
        ))}
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Placement rate"
          description="Percentage placed over the last six cycles"
          className="lg:col-span-2"
        >
          <TrendArea data={MOCK_PLACEMENT_TREND} valueSuffix="%" />
        </SectionCard>
        <SectionCard title="Students placed by branch" description="Current cycle">
          <BarList data={MOCK_BRANCH_PLACEMENT} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Placement funnel"
          description="Application → offer, all drives"
          className="lg:col-span-2"
        >
          <Funnel data={MOCK_APPLICATION_FUNNEL} />
        </SectionCard>

        <SectionCard
          title="Pending recruiter approvals"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.admin.recruiters}>
                Review <ArrowRight />
              </Link>
            </Button>
          }
        >
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No approvals pending. All caught up.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((r) => (
                <li key={r.uid} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={r.photoUrl} alt="" />
                    <AvatarFallback>{initials(r.fullName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-heading">{r.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.companyName}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent activity" bodyClassName="p-2 sm:p-3">
        <ActivityFeed items={MOCK_ACTIVITY_TIMELINE} />
      </SectionCard>
    </div>
  );
}
