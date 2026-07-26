"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single toggle primitive for the portal. Every on/off control routes
 * through this so states, colours, motion and hit area stay identical
 * everywhere.
 *
 * Accessibility notes:
 *  - `role="switch"` + `aria-checked` announces "on/off", not "pressed".
 *  - It's a real <button>, so Space/Enter and the tab order come for free.
 *  - The visible track is 44×24 (sm) / 52×28 (md), but an invisible `::after`
 *    pad extends the *hit* area to the 44×44 WCAG 2.2 target size without
 *    disturbing the layout — a bare 24px-tall track is a genuine miss on touch.
 *  - Focus is drawn with an offset ring so it stays visible on tinted rows.
 */

const trackVariants = cva(
  [
    "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "border-2 border-transparent transition-colors duration-200 ease-premium",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Invisible touch-target expansion, centred on the track.
    "after:absolute after:left-1/2 after:top-1/2 after:h-touch after:min-w-touch after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
  ],
  {
    variants: {
      size: {
        sm: "h-6 w-11",
        md: "h-7 w-[52px]",
      },
      tone: {
        primary: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-border",
        gold: "data-[state=checked]:bg-gold data-[state=unchecked]:bg-border",
        success: "data-[state=checked]:bg-success data-[state=unchecked]:bg-border",
      },
    },
    defaultVariants: { size: "sm", tone: "primary" },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-xs ring-1 ring-heading/5 transition-transform duration-200 ease-premium",
  {
    variants: {
      size: {
        sm: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        md: "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: { size: "sm" },
  }
);

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value">,
    VariantProps<typeof trackVariants> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, size, tone, disabled, onClick, ...props }, ref) => {
    const state = checked ? "checked" : "unchecked";
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={state}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onCheckedChange(!checked);
        }}
        className={cn(trackVariants({ size, tone }), className)}
        {...props}
      >
        <span data-state={state} className={cn(thumbVariants({ size }))} />
      </button>
    );
  }
);
Switch.displayName = "Switch";

// ── Labelled row ─────────────────────────────────────────────────────────────

interface SwitchFieldProps extends Omit<SwitchProps, "aria-label" | "aria-labelledby"> {
  label: string;
  description?: string;
}

/**
 * A switch in a labelled settings row. The whole row is the click target on
 * touch, and the label is wired to the control with `aria-labelledby` rather
 * than nesting it in a <label> (a <label> around a <button> is not associated
 * by assistive tech).
 */
const SwitchField = React.forwardRef<HTMLButtonElement, SwitchFieldProps>(
  ({ label, description, className, disabled, ...props }, ref) => {
    const id = React.useId();
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 py-3",
          disabled && "opacity-60",
          className
        )}
      >
        <span className="min-w-0">
          <span id={`${id}-label`} className="block text-sm font-medium text-foreground">
            {label}
          </span>
          {description && (
            <span id={`${id}-desc`} className="mt-0.5 block text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </span>
        <Switch
          ref={ref}
          disabled={disabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={description ? `${id}-desc` : undefined}
          {...props}
        />
      </div>
    );
  }
);
SwitchField.displayName = "SwitchField";

export { Switch, SwitchField };
