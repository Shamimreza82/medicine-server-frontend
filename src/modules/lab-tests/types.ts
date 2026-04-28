import type { ApiMeta } from '@/shared/api/types';

export interface LabTest {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  category: string | null;
  description: string | null;
  specimen: string | null;
  preparation: string | null;
  normalRange: string | null;
  unit: string | null;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabTestSearchParams {
  q?: string;
  category?: string;
  specimen?: string;
  limit?: number;
  page?: number;
}

export interface LabTestSearchResponse {
  data: LabTest[];
  meta?: ApiMeta;
}
