"use client";

import Link from "next/link";
import { Award, Pencil, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionCard } from "@/components/shared/section-card";
import { ROUTES } from "@/constants/routes";
import { useFullProfile } from "@/features/profile";

function Chips({ items, tint }: { items?: string[]; tint: string }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">Not added yet.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className={`rounded-md px-2.5 py-1 text-xs font-medium ${tint}`}>
          {i}
        </span>
      ))}
    </div>
  );
}

export default function SkillsPage() {
  const { data: full, isLoading } = useFullProfile();
  const p = full?.professional;

  const empty =
    !p?.skills?.length &&
    !p?.programmingLanguages?.length &&
    !p?.frameworks?.length &&
    !p?.certifications?.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-display-sm font-bold text-heading">Skills &amp; Certifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your technical profile shown to recruiters.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`${ROUTES.onboarding}?step=2`}>
            <Pencil /> Edit
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : empty ? (
        <EmptyState
          icon={Sparkles}
          title="No skills added yet"
          description="Add your skills, languages and certifications to strengthen your profile."
          action={
            <Button asChild size="sm" variant="gold">
              <Link href={`${ROUTES.onboarding}?step=2`}>Add skills</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard title="Skills">
            <Chips items={p?.skills} tint="bg-primary/10 text-primary" />
          </SectionCard>
          <SectionCard title="Programming Languages">
            <Chips items={p?.programmingLanguages} tint="bg-info/10 text-info" />
          </SectionCard>
          <SectionCard title="Frameworks & Technologies">
            <Chips items={[...(p?.frameworks ?? []), ...(p?.technologies ?? [])]} tint="bg-section text-foreground" />
          </SectionCard>
          <SectionCard title="Certifications" action={<Award className="h-4 w-4 text-gold" />}>
            <Chips items={p?.certifications} tint="bg-gold/15 text-gold-ink" />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
