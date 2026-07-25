"use client";

import { useQuery } from "@tanstack/react-query";
import { drivesService } from "@/features/placement-drives/services";

export function useDrives() {
  return useQuery({
    queryKey: ["placement-drives"],
    queryFn: () => drivesService.listPublished(),
    staleTime: 60 * 1000,
  });
}

export function useDrive(id: string | undefined) {
  return useQuery({
    queryKey: ["placement-drive", id],
    queryFn: () => drivesService.get(id as string),
    enabled: !!id,
  });
}
