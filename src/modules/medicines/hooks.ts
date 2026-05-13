'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  checkWarnings,
  getBrandById,
  getClassificationTree,
  getCompanyById,
  getDiseaseSuggestions,
  getGenericById,
  getIndicationById,
  searchBrands,
  searchCompanies,
  searchGenerics,
  searchIndications,
  searchMedicines,
  searchHerbalBrands,
  searchHerbalGenerics,
  getHerbalBrandById,
  getHerbalGenericById,
} from './api';
import type { WarningRequest } from './types';

export function useMedicineSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: ['medicines', 'search', query, limit],
    queryFn: () => searchMedicines(query, limit),
    enabled: query.trim().length > 0,
  });
}

export function useBrandSearch(
  query: string,
  limit = 10,
  page = 1,
  filters?: { companyId?: number; genericId?: number; indicationId?: number },
) {
  return useQuery({
    queryKey: ['medicines', 'brands', query, limit, page, filters],
    queryFn: () => searchBrands(query, limit, page, filters),
    enabled: query.trim().length > 0 || !!filters?.companyId || !!filters?.genericId || !!filters?.indicationId,
  });
}

export function useGenericSearch(query: string, limit = 10, page = 1, filters?: { therapeuticId?: number }) {
  return useQuery({
    queryKey: ['medicines', 'generics', query, limit, page, filters],
    queryFn: () => searchGenerics(query, limit, page, filters),
    enabled: query.trim().length > 0 || !!filters?.therapeuticId,
  });
}

export function useHerbalBrandSearch(
  query: string,
  limit = 10,
  page = 1,
  filters?: { companyId?: number; genericId?: number },
) {
  return useQuery({
    queryKey: ['medicines', 'herbal-brands', query, limit, page, filters],
    queryFn: () => searchHerbalBrands(query, limit, page, filters),
    enabled: query.trim().length > 0 || !!filters?.companyId || !!filters?.genericId,
  });
}

export function useHerbalGenericSearch(query: string, limit = 10, page = 1) {
  return useQuery({
    queryKey: ['medicines', 'herbal-generics', query, limit, page],
    queryFn: () => searchHerbalGenerics(query, limit, page),
    enabled: query.trim().length > 0,
  });
}

export function useClassificationTree() {
  return useQuery({
    queryKey: ['medicines', 'classifications'],
    queryFn: getClassificationTree,
  });
}

export function useIndicationSearch(query: string, limit = 10, page = 1) {
  return useQuery({
    queryKey: ['medicines', 'indications', query, limit, page],
    queryFn: () => searchIndications(query, limit, page),
    enabled: query.trim().length > 0,
  });
}

export function useCompanySearch(query: string, limit = 10, page = 1) {
  return useQuery({
    queryKey: ['medicines', 'companies', query, limit, page],
    queryFn: () => searchCompanies(query, limit, page),
    enabled: query.trim().length > 0,
  });
}

export function useBrandDetails(brandId: number) {
  return useQuery({
    queryKey: ['medicines', 'brand-details', brandId],
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId,
  });
}

export function useGenericDetails(genericId: number) {
  return useQuery({
    queryKey: ['medicines', 'generic-details', genericId],
    queryFn: () => getGenericById(genericId),
    enabled: !!genericId,
  });
}

export function useHerbalBrandDetails(brandId: number) {
  return useQuery({
    queryKey: ['medicines', 'herbal-brand-details', brandId],
    queryFn: () => getHerbalBrandById(brandId),
    enabled: !!brandId,
  });
}

export function useHerbalGenericDetails(genericId: number) {
  return useQuery({
    queryKey: ['medicines', 'herbal-generic-details', genericId],
    queryFn: () => getHerbalGenericById(genericId),
    enabled: !!genericId,
  });
}

export function useCompanyDetails(companyId: number) {
  return useQuery({
    queryKey: ['medicines', 'company-details', companyId],
    queryFn: () => getCompanyById(companyId),
    enabled: !!companyId,
  });
}

export function useIndicationDetails(indicationId: number) {
  return useQuery({
    queryKey: ['medicines', 'indication-details', indicationId],
    queryFn: () => getIndicationById(indicationId),
    enabled: !!indicationId,
  });
}

export function useWarningCheck() {
  return useMutation({
    mutationFn: (payload: WarningRequest) => checkWarnings(payload),
  });
}

export function useDiseaseSuggestions(diseaseId: string) {
  return useQuery({
    queryKey: ['medicines', 'disease-suggestions', diseaseId],
    queryFn: () => getDiseaseSuggestions(diseaseId),
    enabled: !!diseaseId,
  });
}
