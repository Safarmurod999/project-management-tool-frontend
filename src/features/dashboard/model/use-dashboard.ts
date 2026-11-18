import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cardApi, type MyCardFilters } from "@/shared/api/card";
import { userApi } from "@/shared/api/user";

/**
 * Shared "dashboard" prefix: any card or status mutation can refresh
 * the current user's cards and stats at once (see app providers).
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  myCards: (filters: MyCardFilters) =>
    ["dashboard", "my-cards", filters] as const,
  stats: (projectId?: string) =>
    ["dashboard", "stats", projectId ?? null] as const,
};

export const useMyCards = (filters: MyCardFilters) =>
  useQuery({
    queryKey: dashboardKeys.myCards(filters),
    queryFn: () => cardApi.getMy(filters),
    // Keep the current page on screen while the next one or a new filter loads
    placeholderData: keepPreviousData,
  });

export const useMyStats = (projectId?: string) =>
  useQuery({
    queryKey: dashboardKeys.stats(projectId),
    queryFn: async () => (await userApi.getMyStats(projectId)).data,
  });
