"use client";

import { SectionCard } from "@/components/shared/section-card";
import {
  PageShell,
  PageHeader,
  KpiCard,
  KpiGrid,
  TrendArea,
  BarList,
  Funnel,
} from "@/components/dashboard";
import {
  MOCK_ADMIN_STATS,
  MOCK_PLACEMENT_TREND,
  MOCK_BRANCH_PLACEMENT,
  MOCK_PACKAGE_DISTRIBUTION,
  MOCK_MONTHLY_APPLICATIONS,
  MOCK_APPLICATION_FUNNEL,
  MOCK_TOP_RECRUITERS,
} from "@/data/mock";

export default function AdminAnalyticsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Analytics"
        description="Placement performance across branches, packages and recruiters."
      />

      <KpiGrid>
        {MOCK_ADMIN_STATS.slice(0, 4).map((tile) => (
          <KpiCard key={tile.key} tile={tile} />
        ))}
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Placement rate" description="Last six cycles" className="lg:col-span-2">
          <TrendArea data={MOCK_PLACEMENT_TREND} valueSuffix="%" />
        </SectionCard>
        <SectionCard title="Applications received" description="Current cycle, monthly">
          <TrendArea data={MOCK_MONTHLY_APPLICATIONS} height={140} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Students placed by branch">
          <BarList data={MOCK_BRANCH_PLACEMENT} />
        </SectionCard>
        <SectionCard title="Offers by package band">
          <BarList data={MOCK_PACKAGE_DISTRIBUTION} />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Placement funnel" description="Application → offer">
          <Funnel data={MOCK_APPLICATION_FUNNEL} />
        </SectionCard>
        <SectionCard title="Top recruiters" description="Students hired this cycle">
          <BarList data={MOCK_TOP_RECRUITERS} />
        </SectionCard>
      </div>
    </PageShell>
  );
}