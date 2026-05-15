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

export async function createLabTest(data: Partial<LabTest>) {
  const response = await http.post<ApiSuccess<LabTest>>('/lab-tests', data);
  return response.data;
}

export async function updateLabTest(id: string, data: Partial<LabTest>) {
  const response = await http.patch<ApiSuccess<LabTest>>(`/lab-tests/${id}`, data);
  return response.data;
}

export async function deleteLabTest(id: string) {
  const response = await http.delete<ApiSuccess<null>>(`/lab-tests/${id}`);
  return response.data;
}

export async function bulkUploadLabTests(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await http.post<ApiSuccess<{ successCount: number; skippedCount: number }>>(
    '/lab-tests/bulk-upload', 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export async function exportLabTestsCsv() {
  const response = await http.get('/lab-tests/export-csv', {
    responseType: 'blob',
  });
  return response.data;
}



