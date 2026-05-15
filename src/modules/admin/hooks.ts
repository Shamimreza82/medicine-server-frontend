import { useQuery } from '@tanstack/react-query';
import { adminApi } from './api';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
};

export function useDashboardData() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboardData(),
  });
}
