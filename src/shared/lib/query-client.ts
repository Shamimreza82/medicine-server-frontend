import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes by default
        staleTime: 5 * 60 * 1000,
        // Unused data remains in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests once
        retry: 1,
        // Disable automatic refetching on window focus to save resources
        refetchOnWindowFocus: false,
        // Automatically refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Standard retry logic for mutations
        retry: 0,
      },
    },
  });
}
