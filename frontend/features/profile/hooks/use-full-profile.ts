"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";
import { profileService } from "@/features/profile/services";

export function useFullProfile() {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: ["full-profile", uid],
    queryFn: () => profileService.getFull(uid as string),
    enabled: !!uid,
    staleTime: 2 * 60 * 1000,
  });
}
