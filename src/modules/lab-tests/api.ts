import { http } from '@/shared/api/http';
import type { ApiSuccess } from '@/shared/api/types';

import type { LabTest, LabTestSearchParams } from './types';

export async function searchLabTests(params: LabTestSearchParams) {
  const response = await http.get<ApiSuccess<LabTest[]>>('/lab-tests/search', { params });

  return {
    data: response.data.data ?? [],
    meta: response.data.meta,
    message: response.data.message,
  };
}
