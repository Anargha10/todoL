import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsApi.getAnalytics(),
    staleTime: 60 * 1000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => analyticsApi.getDashboardStats(),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
