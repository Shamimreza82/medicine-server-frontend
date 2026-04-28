'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  checkWarnings,
  getBrandProducts,
  getDiseaseSuggestions,
  getGenericDoseTemplate,
  searchBrands,
  searchGenerics,
  searchMedicines,
} from './api';
import type { WarningRequest } from './types';

export function useMedicineSearch(query: string) {
  return useQuery({
    queryKey: ['medicines', 'search', query],
    queryFn: () => searchMedicines(query),
    enabled: query.trim().length > 0,
  });
}

export function useBrandSearch(query: string) {
  return useQuery({
    queryKey: ['medicines', 'brands', query],
    queryFn: () => searchBrands(query),
    enabled: query.trim().length > 0,
  });
}

export function useGenericSearch(query: string) {
  return useQuery({
    queryKey: ['medicines', 'generics', query],
    queryFn: () => searchGenerics(query),
    enabled: query.trim().length > 0,
  });
}

export function useBrandProducts(brandId: string) {
  return useQuery({
    queryKey: ['medicines', 'brand-details', brandId],
    queryFn: () => getBrandProducts(brandId),
    enabled: brandId.trim().length > 0,
  });
}

export function useGenericDoseTemplate(genericId: string) {
  return useQuery({
    queryKey: ['medicines', 'generic-template', genericId],
    queryFn: () => getGenericDoseTemplate(genericId),
    enabled: genericId.trim().length > 0,
  });
}

export function useDiseaseSuggestions(diseaseId: string, limit = 10) {
  return useQuery({
    queryKey: ['medicines', 'disease-suggestions', diseaseId, limit],
    queryFn: () => getDiseaseSuggestions(diseaseId, limit),
    enabled: diseaseId.trim().length > 0,
  });
}

export function useWarningCheck() {
  return useMutation({
    mutationFn: (payload: WarningRequest) => checkWarnings(payload),
  });
}
