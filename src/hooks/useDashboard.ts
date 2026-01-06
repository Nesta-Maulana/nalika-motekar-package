'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, ActivityParams } from '../lib/api/dashboard';
import { useAuthStore } from '../stores';

export const DASHBOARD_QUERY_KEYS = {
  stats: ['dashboard', 'stats'],
  activities: (params: ActivityParams) => ['dashboard', 'activities', params],
  activitySummary: (params: { tenant_id?: string; token_type?: 'central' | 'tenant'; from?: string }) =>
    ['dashboard', 'activities', 'summary', params],
} as const;

export function useDashboardStats() {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats,
    queryFn: () => dashboardApi.getStats(),
    enabled: isHydrated && !!user,
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useActivities(params: ActivityParams = {}) {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activities(params),
    queryFn: () => dashboardApi.getActivities(params),
    enabled: isHydrated && !!user,
    staleTime: 1000 * 30,
  });
}

export function useActivitySummary(params: {
  tenant_id?: string;
  token_type?: 'central' | 'tenant';
  from?: string;
} = {}) {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activitySummary(params),
    queryFn: () => dashboardApi.getActivitySummary(params),
    enabled: isHydrated && !!user,
    staleTime: 1000 * 60 * 1,
  });
}

export default useDashboardStats;
