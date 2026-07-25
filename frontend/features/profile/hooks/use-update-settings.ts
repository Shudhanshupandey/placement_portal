"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";
import { profileService } from "@/features/profile/services";
import type { StudentSettings } from "@/features/profile/types";

/**
 * Persist the student's notification and visibility preferences.
 *
 * The settings page previously called `updateDoc` inline. Routing it through a
 * hook restores the layering CLAUDE.md requires (components → hooks →
 * services) and is what lets dev mode swap the implementation underneath.
 */
export function useUpdateSettings() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (settings: StudentSettings) =>
      profileService.updateSettings(user!.uid, settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["full-profile", user?.uid] });
    },
  });
}
