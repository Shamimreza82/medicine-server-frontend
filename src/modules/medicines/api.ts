import { http } from '@/shared/api/http';
import type { ApiSuccess } from '@/shared/api/types';

import type {
  BrandDetails,
  BrandResponse,
  GenericDetails,
  GenericResponse,
  IndicationResponse,
  CompanyResponse,
  CompanyDetails,
  IndicationDetails,
  MedicineSearchResult,
  WarningRequest,
  WarningSummary,
  DiseaseSuggestionResponse,
  SystemicNode,
  HerbalBrandDetails,
  HerbalGenericDetails,
  DosageFormResponse,
} from './types';

export async function searchMedicines(query: string, limit = 10) {
  const response = await http.get<ApiSuccess<MedicineSearchResult>>('/medicines/search', {
    params: { q: query, limit },
  });

  return response.data.data ?? { brands: [], generics: [], indications: [], companies: [], herbalBrands: [] };
}

export async function searchBrands(
  query: string,
  limit = 10,
  page = 1,
  filters?: { companyId?: number; genericId?: number; indicationId?: number; form?: string },
) {
  const response = await http.get<ApiSuccess<BrandResponse[]>>('/medicines/brands', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchGenerics(
  query: string,
  limit = 10,
  page = 1,
  filters?: { therapeuticId?: number; letter?: string; indicationId?: number },
) {
  const response = await http.get<ApiSuccess<GenericResponse[]>>('/medicines/generics', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchHerbalBrands(
  query: string,
  limit = 10,
  page = 1,
  filters?: { companyId?: number; genericId?: number },
) {
  const response = await http.get<ApiSuccess<BrandResponse[]>>('/medicines/herbal-brands', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchHerbalGenerics(
  query: string,
  limit = 10,
  page = 1,
) {
  const response = await http.get<ApiSuccess<GenericResponse[]>>('/medicines/herbal-generics', {
    params: { q: query, limit, page },
  });

  return response.data;
}

export async function getClassificationTree() {
  const response = await http.get<ApiSuccess<SystemicNode[]>>('/medicines/classifications');

  return response.data.data ?? [];
}

export async function getDosageForms(query = '', limit = 20, page = 1, filters?: { letter?: string }) {
  const response = await http.get<ApiSuccess<DosageFormResponse[]>>('/medicines/dosage-forms', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchIndications(
  query: string,
  limit = 10,
  page = 1,
  filters?: { letter?: string },
) {
  const response = await http.get<ApiSuccess<IndicationResponse[]>>('/medicines/indications', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchCompanies(query: string, limit = 10, page = 1, filters?: { letter?: string }) {
  const response = await http.get<ApiSuccess<CompanyResponse[]>>('/medicines/companies', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function getPregnancyCategories() {
  const response = await http.get<ApiSuccess<Array<{ id: number; name: string; description: string | null }>>>('/medicines/pregnancy-categories');
  return response.data.data ?? [];
}

export async function getBrandById(brandId: number) {
  const response = await http.get<ApiSuccess<BrandDetails>>(`/medicines/brands/${brandId}`);

  return response.data.data;
}

export async function createBrand(payload: Partial<BrandResponse>) {
  const response = await http.post<ApiSuccess<BrandResponse>>('/medicines/brands', payload);
  return response.data.data;
}

export async function updateBrand(brandId: number, payload: Partial<BrandResponse>) {
  const response = await http.patch<ApiSuccess<BrandResponse>>(`/medicines/brands/${brandId}`, payload);
  return response.data.data;
}

export async function getGenericById(genericId: number) {
  const response = await http.get<ApiSuccess<GenericDetails>>(`/medicines/generics/${genericId}`);

  return response.data.data;
}

export async function createGeneric(payload: Partial<GenericDetails>) {
  const response = await http.post<ApiSuccess<GenericDetails>>('/medicines/generics', payload);
  return response.data.data;
}

export async function updateGeneric(genericId: number, payload: Partial<GenericDetails>) {
  const response = await http.patch<ApiSuccess<GenericDetails>>(`/medicines/generics/${genericId}`, payload);
  return response.data.data;
}

export async function getHerbalBrandById(brandId: number) {
  const response = await http.get<ApiSuccess<HerbalBrandDetails>>(`/medicines/herbal-brands/${brandId}`);

  return response.data.data;
}

export async function getHerbalGenericById(genericId: number) {
  const response = await http.get<ApiSuccess<HerbalGenericDetails>>(`/medicines/herbal-generics/${genericId}`);

  return response.data.data;
}

export async function getCompanyById(companyId: number) {
  const response = await http.get<ApiSuccess<CompanyDetails>>(`/medicines/companies/${companyId}`);

  return response.data.data;
}

export async function createCompany(payload: { name: string; order?: number }) {
  const response = await http.post<ApiSuccess<CompanyResponse>>('/medicines/companies', payload);
  return response.data.data;
}

export async function updateCompany(companyId: number, payload: { name: string; order?: number }) {
  const response = await http.patch<ApiSuccess<CompanyResponse>>(`/medicines/companies/${companyId}`, payload);
  return response.data.data;
}

export async function getIndicationById(indicationId: number) {
  const response = await http.get<ApiSuccess<IndicationDetails>>(`/medicines/indications/${indicationId}`);

  return response.data.data;
}

export async function createIndication(payload: { name: string }) {
  const response = await http.post<ApiSuccess<IndicationResponse>>('/medicines/indications', payload);
  return response.data.data;
}

export async function updateIndication(indicationId: number, payload: { name: string }) {
  const response = await http.patch<ApiSuccess<IndicationResponse>>(`/medicines/indications/${indicationId}`, payload);
  return response.data.data;
}

export async function checkWarnings(payload: WarningRequest) {
  const response = await http.post<ApiSuccess<WarningSummary>>('/medicines/check-warnings', payload);

  return response.data.data as WarningSummary;
}

export async function getDiseaseSuggestions(diseaseId: string) {
  const response = await http.get<ApiSuccess<DiseaseSuggestionResponse>>(`/medicines/diseases/${diseaseId}/suggestions`);

  return response.data.data;
}
