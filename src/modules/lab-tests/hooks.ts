'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { 
  searchLabTests, 
  createLabTest, 
  updateLabTest, 
  deleteLabTest,
  bulkUploadLabTests,
  exportLabTestsCsv 
} from './api';
import type { LabTest, LabTestSearchParams } from './types';

export function useLabTestsSearch(params: LabTestSearchParams) {
  return useQuery({
    queryKey: ['lab-tests', params],
    queryFn: () => searchLabTests(params),
    placeholderData: keepPreviousData,
  });
}

export function useExportLabTests() {
  return useMutation({
    mutationFn: () => exportLabTestsCsv(),
  });
}


export function useBulkUploadLabTests() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => bulkUploadLabTests(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-tests'] });
    },
  });
}


export function useCreateLabTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<LabTest>) => createLabTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-tests'] });
    },
  });
}

export function useUpdateLabTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabTest> }) => updateLabTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-tests'] });
    },
  });
}

export function useDeleteLabTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteLabTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-tests'] });
    },
  });
}

