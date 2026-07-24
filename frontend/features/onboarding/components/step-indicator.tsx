"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  steps: { title: string; description: string }[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  const total = steps.length;
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Step {current + 1} of {total}
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-heading">
            {steps[current].title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {steps[current].description}
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary sm:inline">
          {pct}%
        </span>
      </div>

      {/* Desktop stepper */}
      <ol className="hidden items-center gap-2 md:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <React.Fragment key={s.title}>
              <li className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    done && "border-primary bg-primary text-primary-foreground",
                    active && "border-primary bg-primary/10 text-primary",
                    !done && !active && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-heading" : "text-muted-foreground"
                  )}
                >
                  {s.title}
                </span>
              </li>
              {i < total - 1 && (
                <li className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-primary"
                    initial={false}
                    animate={{ width: i < current ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>

      {/* Mobile progress */}
      <div className="md:hidden">
        <Progress value={pct} />
      </div>
    </div>
  );
}
