"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import { applicationsService } from "@/features/applications/services/applications.service";
import type { FullStudentProfile } from "@/features/profile";
import type { PlacementDrive } from "@/features/placement-drives";

export function useMyApplications() {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: ["applications", uid],
    queryFn: () => applicationsService.listMine(uid as string),
    enabled: !!uid,
  });
}

export function useApplyToDrive() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      full,
      drive,
    }: {
      full: FullStudentProfile;
      drive: PlacementDrive;
    }) => applicationsService.apply(user!.uid, full, drive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications", user?.uid] });
      qc.invalidateQueries({ queryKey: ["notifications", user?.uid] });
    },
    onError: (err) => {
      toast.error("Couldn't submit application", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
}
