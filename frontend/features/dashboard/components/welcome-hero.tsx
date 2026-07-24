"use client";

import { GraduationCap, BookOpen, CalendarRange } from "lucide-react";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function yearLabel(year?: string) {
  const map: Record<string, string> = {
    "1": "1st Year",
    "2": "2nd Year",
    "3": "3rd Year",
    "4": "4th Year",
  };
  return year ? map[year] ?? `Year ${year}` : undefined;
}

interface WelcomeHeroProps {
  name: string;
  course?: string;
  branch?: string;
  year?: string;
  pct: number;
}

export function WelcomeHero({ name, course, branch, year, pct }: WelcomeHeroProps) {
  const chips = [
    course && { icon: BookOpen, text: course },
    branch && { icon: GraduationCap, text: branch },
    yearLabel(year) && { icon: CalendarRange, text: yearLabel(year)! },
  ].filter(Boolean) as { icon: typeof BookOpen; text: string }[];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-gradient p-6 text-primary-foreground shadow-card sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-white/70">{greeting()},</p>
          <h1 className="truncate text-2xl font-bold sm:text-[28px]">{name} 👋</h1>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
                >
                  <Icon className="h-3.5 w-3.5 text-gold" /> {text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Completion ring */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
          <div className="relative h-12 w-12">
            <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#D8AE3E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-xs text-white/70">Profile</p>
            <p className="text-sm font-semibold">Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
