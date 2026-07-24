import { LifeBuoy, Mail, BookOpen, MessageCircleQuestion } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

const FAQS = [
  {
    q: "Why can't I apply to a placement drive?",
    a: "You must complete your profile (personal details, resume, skills, CGPA, course & branch) and meet the drive's eligibility criteria. The apply dialog explains exactly what's missing or why you're not eligible.",
  },
  {
    q: "How is my application submitted?",
    a: "When eligible, applications are submitted with one click using your saved profile — there's no long form to fill.",
  },
  {
    q: "Where do I see my application status?",
    a: "Open My Applications. Each application has a full status timeline from Pending to Offer Released.",
  },
  {
    q: "I used the wrong email. What now?",
    a: "Only your official @saitm.ac.in college email can be used. Contact the TPO office if there's an issue with your college email.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LifeBuoy className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-heading">Help &amp; Support</h1>
          <p className="text-sm text-muted-foreground">Answers to common questions, and how to reach us.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Mail className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-heading">Contact the TPO Office</p>
            <p className="text-sm text-muted-foreground">tpo@saitm.ac.in</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <BookOpen className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-heading">Placement Guidelines</p>
            <p className="text-sm text-muted-foreground">Review eligibility & conduct policies with the TPO.</p>
          </div>
        </div>
      </div>

      <SectionCard title="Frequently Asked Questions" action={<MessageCircleQuestion className="h-4 w-4 text-muted-foreground" />}>
        <div className="divide-y divide-border">
          {FAQS.map((f) => (
            <div key={f.q} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-heading">{f.q}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
