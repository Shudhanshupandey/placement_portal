"use client";

import { CalendarClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useMyApplications, ApplicationRow } from "@/features/applications";

export default function InterviewsPage() {
  const { data: apps, isLoading } = useMyApplications();
  const interviews = (apps ?? []).filter((a) => a.status === "interview_scheduled");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Interview Schedule</h1>
        <p className="text-sm text-muted-foreground">Drives where you&apos;ve been shortlisted for an interview.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="When a recruiter schedules your interview, it will appear here."
        />
      ) : (
        <div className="space-y-3">
          {interviews.map((a) => (
            <ApplicationRow key={a.id} app={a} />
          ))}
        </div>
      )}
    </div>
  );
}
