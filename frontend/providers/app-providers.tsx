"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { MockAuthProvider } from "@/providers/mock-auth-provider";
import { DevModeToolbar } from "@/components/dev/dev-mode-toolbar";
import { Toaster } from "@/components/ui/sonner";
import { IS_DEV_MODE } from "@/lib/dev-mode/flag";

/**
 * Composes every client provider. Mounted once in app/layout.tsx.
 *
 * The auth provider is the ONE place dev mode is selected at the UI layer.
 * `IS_DEV_MODE` is a build-time constant, never a value that can change between
 * renders, so this branch is stable for the lifetime of the app — React never
 * sees the provider identity swap. In a production build it folds to
 * `<AuthProvider>` and the mock provider plus the dev toolbar are tree-shaken.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const SelectedAuthProvider = IS_DEV_MODE ? MockAuthProvider : AuthProvider;

  return (
    <QueryProvider>
      {/* `reducedMotion="user"` makes every Framer Motion animation in the app
          honour the OS "reduce motion" setting — transforms and opacity fades
          are skipped rather than merely shortened. The CSS side of the same
          promise is handled by the media query in styles/globals.css. */}
      <MotionConfig reducedMotion="user">
        <SelectedAuthProvider>
          {children}
          <Toaster />
          {IS_DEV_MODE && <DevModeToolbar />}
        </SelectedAuthProvider>
      </MotionConfig>
    </QueryProvider>
  );
}
