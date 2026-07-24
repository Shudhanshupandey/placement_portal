"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
  invalid?: boolean;
}

/** Accessible 6-box OTP input with paste + keyboard navigation. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  autoFocus,
  onComplete,
  invalid,
}: OtpInputProps) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = React.useMemo(() => value.padEnd(length, " ").slice(0, length).split(""), [value, length]);

  React.useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setChar = (index: number, char: string) => {
    const clean = char.replace(/\D/g, "");
    const next = value.split("");
    next[index] = clean;
    const joined = next.join("").replace(/\s/g, "").slice(0, length);
    onChange(joined);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
    if (joined.length === length) onComplete?.(joined);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.split("");
      if (next[index]) {
        next[index] = "";
        onChange(next.join("").replace(/\s/g, ""));
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        next[index - 1] = "";
        onChange(next.join("").replace(/\s/g, ""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    refs.current[focusIndex]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" role="group" aria-label="One-time passcode">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid ? "true" : "false"}
          value={digits[i].trim()}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-input bg-card text-center text-xl font-semibold text-heading shadow-sm transition-all",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/25",
            "disabled:opacity-60",
            invalid && "border-error ring-2 ring-error/20",
            digits[i].trim() && "border-primary/60"
          )}
        />
      ))}
    </div>
  );
}
