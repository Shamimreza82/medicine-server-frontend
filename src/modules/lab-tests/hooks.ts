'use client';

import { useQuery } from '@tanstack/react-query';

import { searchLabTests } from './api';
import type { LabTestSearchParams } from './types';

export function useLabTestsSearch(params: LabTestSearchParams) {
  return useQuery({
    queryKey: ['lab-tests', params],
    queryFn: () => searchLabTests(params),
  });
}
