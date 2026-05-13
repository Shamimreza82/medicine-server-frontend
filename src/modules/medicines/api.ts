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
} from './types';

export async function searchMedicines(query: string, limit = 10) {
  const response = await http.get<ApiSuccess<MedicineSearchResult>>('/medicines/search', {
    params: { q: query, limit },
  });

  return response.data.data ?? { brands: [], generics: [], indications: [], companies: [] };
}

export async function searchBrands(
  query: string,
  limit = 10,
  page = 1,
  filters?: { companyId?: number; genericId?: number; indicationId?: number },
) {
  const response = await http.get<ApiSuccess<BrandResponse[]>>('/medicines/brands', {
    params: { q: query, limit, page, ...filters },
  });

  return response.data;
}

export async function searchGenerics(query: string, limit = 10, page = 1) {
  const response = await http.get<ApiSuccess<GenericResponse[]>>('/medicines/generics', {
    params: { q: query, limit, page },
  });

  return response.data;
}

export async function searchIndications(query: string, limit = 10, page = 1) {
  const response = await http.get<ApiSuccess<IndicationResponse[]>>('/medicines/indications', {
    params: { q: query, limit, page },
  });

  return response.data;
}

export async function searchCompanies(query: string, limit = 10, page = 1) {
  const response = await http.get<ApiSuccess<CompanyResponse[]>>('/medicines/companies', {
    params: { q: query, limit, page },
  });

  return response.data;
}

export async function getBrandById(brandId: number) {
  const response = await http.get<ApiSuccess<BrandDetails>>(`/medicines/brands/${brandId}`);

  return response.data.data;
}

export async function getGenericById(genericId: number) {
  const response = await http.get<ApiSuccess<GenericDetails>>(`/medicines/generics/${genericId}`);

  return response.data.data;
}

export async function getCompanyById(companyId: number) {
  const response = await http.get<ApiSuccess<CompanyDetails>>(`/medicines/companies/${companyId}`);

  return response.data.data;
}

export async function getIndicationById(indicationId: number) {
  const response = await http.get<ApiSuccess<IndicationDetails>>(`/medicines/indications/${indicationId}`);

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
