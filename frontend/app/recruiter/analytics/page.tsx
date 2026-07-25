"use client";

import { SectionCard } from "@/components/shared/section-card";
import {
  PageHeader,
  KpiCard,
  KpiGrid,
  Funnel,
  TrendArea,
  Donut,
  BarList,
} from "@/components/dashboard";
import {
  MOCK_RECRUITER_STATS,
  MOCK_RECRUITER_PIPELINE,
  MOCK_MONTHLY_APPLICATIONS,
} from "@/data/mock";

/** Applicants by drive — derived from the recruiter's pipeline for the demo. */
const APPLICANTS_BY_DRIVE = [
  { label: "Software Engineering Intern", value: 96 },
  { label: "Frontend Developer", value: 52 },
];

export default function RecruiterAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Performance of your postings across the current placement cycle."
      />

      <KpiGrid>
        {MOCK_RECRUITER_STATS.map((tile) => (
          <KpiCard key={tile.key} tile={tile} />
        ))}
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Applications received"
          description="Monthly volume across your drives"
          className="lg:col-span-2"
        >
          <TrendArea data={MOCK_MONTHLY_APPLICATIONS} />
        </SectionCard>

        <SectionCard title="Offer acceptance">
          <Donut value={86} label="Acceptance rate" sublabel="6 of 7 offers accepted" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Selection pipeline" description="Application → offer">
          <Funnel data={MOCK_RECRUITER_PIPELINE} />
        </SectionCard>

        <SectionCard title="Applicants by drive">
          <BarList data={APPLICANTS_BY_DRIVE} />
        </SectionCard>
      </div>
    </div>
  );
}
