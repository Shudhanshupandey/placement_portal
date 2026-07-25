"use client";

import { SectionCard } from "@/components/shared/section-card";
import { PageHeader, ActivityFeed } from "@/components/dashboard";
import { MOCK_ACTIVITY_TIMELINE } from "@/data/mock";

export default function AdminNotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Placement cell activity across students, recruiters and drives."
      />
      <SectionCard title="Recent activity" bodyClassName="p-2 sm:p-3">
        <ActivityFeed items={MOCK_ACTIVITY_TIMELINE} />
      </SectionCard>
    </div>
  );
}
