import { http } from '@/shared/api/http';
import type { ApiSuccess } from '@/shared/api/types';

import type {
  BrandDetails,
  BrandSuggestion,
  DiseaseSuggestionResult,
  GenericDoseTemplate,
  GenericSuggestion,
  MedicineSearchResult,
  WarningRequest,
  WarningSummary,
} from './types';

export async function searchMedicines(query: string, limit = 10) {
  const response = await http.get<ApiSuccess<MedicineSearchResult>>('/medicines/search', {
    params: { q: query, limit },
  });

  return response.data.data ?? { brands: [], generics: [] };
}

export async function searchBrands(query: string, limit = 10) {
  const response = await http.get<ApiSuccess<BrandSuggestion[]>>('/medicines/brands/search', {
    params: { q: query, limit },
  });

  return response.data.data ?? [];
}

export async function searchGenerics(query: string, limit = 10) {
  const response = await http.get<ApiSuccess<GenericSuggestion[]>>('/medicines/generics/search', {
    params: { q: query, limit },
  });

  return response.data.data ?? [];
}

export async function getBrandProducts(brandId: string) {
  const response = await http.get<ApiSuccess<BrandDetails>>(`/medicines/brands/${brandId}/products`);

  return response.data.data as BrandDetails;
}

export async function getGenericDoseTemplate(genericId: string) {
  const response = await http.get<ApiSuccess<GenericDoseTemplate>>(
    `/medicines/generics/${genericId}/dose-templates`,
  );

  return response.data.data as GenericDoseTemplate;
}

export async function getDiseaseSuggestions(diseaseId: string, limit = 10) {
  const response = await http.get<ApiSuccess<DiseaseSuggestionResult>>(
    `/medicines/diseases/${diseaseId}/suggestions`,
    { params: { limit } },
  );

  return response.data.data as DiseaseSuggestionResult;
}

export async function checkWarnings(payload: WarningRequest) {
  const response = await http.post<ApiSuccess<WarningSummary>>('/medicines/check-warnings', payload);

  return response.data.data as WarningSummary;
}
