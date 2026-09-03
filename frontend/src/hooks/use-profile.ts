"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/users";
import { getAccessToken } from "@/lib/auth/tokens";

export const profileQueryKey = ["profile"] as const;

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    enabled: typeof window !== "undefined" && Boolean(getAccessToken()),
  });
}
