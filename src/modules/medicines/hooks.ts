'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  getDosageForms,
  createGeneric,
  updateGeneric,
  getPregnancyCategories,
  createBrand,
  updateBrand,
  createIndication,
  updateIndication,
  createCompany,
  updateCompany,
} from './api';
import type { BrandResponse, GenericDetails, WarningRequest } from './types';

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
  filters?: { companyId?: number; genericId?: number; indicationId?: number; form?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['medicines', 'brands', query, limit, page, filters],
    queryFn: () => searchBrands(query, limit, page, filters),
    enabled: enabled && (query.trim().length > 0 || !!filters?.companyId || !!filters?.genericId || !!filters?.indicationId || !!filters?.form || enabled === true),
  });
}

export function useGenericSearch(
  query: string,
  limit = 10,
  page = 1,
  filters?: { therapeuticId?: number; letter?: string; indicationId?: number },
) {
  return useQuery({
    queryKey: ['medicines', 'generics', query, limit, page, filters],
    queryFn: () => searchGenerics(query, limit, page, filters),
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

export function useDosageForms(query = '', limit = 20, page = 1, filters?: { letter?: string }) {
  return useQuery({
    queryKey: ['medicines', 'dosage-forms', query, limit, page, filters],
    queryFn: () => getDosageForms(query, limit, page, filters),
  });
}

export function useIndicationSearch(
  query: string, 
  limit = 10, 
  page = 1,
  filters?: { letter?: string }
) {
  return useQuery({
    queryKey: ['medicines', 'indications', query, limit, page, filters],
    queryFn: () => searchIndications(query, limit, page, filters),
  });
}

export function useCompanySearch(
  query: string, 
  limit = 10, 
  page = 1,
  filters?: { letter?: string }
) {
  return useQuery({
    queryKey: ['medicines', 'companies', query, limit, page, filters],
    queryFn: () => searchCompanies(query, limit, page, filters),
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

export function usePregnancyCategories() {
  return useQuery({
    queryKey: ['medicines', 'pregnancy-categories'],
    queryFn: getPregnancyCategories,
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

export function useCreateGeneric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GenericDetails>) => createGeneric(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'generics'] });
    },
  });
}

export function useUpdateGeneric() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GenericDetails> }) => updateGeneric(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'generics'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'generic-details', variables.id] });
    },
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BrandResponse>) => createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'brands'] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BrandResponse> }) => updateBrand(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'brands'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'brand-details', variables.id] });
    },
  });
}

export function useCreateIndication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => createIndication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'indications'] });
    },
  });
}

export function useUpdateIndication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string } }) => updateIndication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'indications'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'indication-details', variables.id] });
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; order?: number }) => createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; order?: number } }) => updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medicines', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['medicines', 'company-details', variables.id] });
    },
  });
}
