import { http } from '@/shared/api/http';

export interface AdminStats {
  brands: number;
  generics: number;
  companies: number;
  indications: number;
  labTests: number;
}

export interface BackendActivity {
  id: string;
  action: string;
  target: string;
  details?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface DashboardData {
  stats: AdminStats;
  activities: BackendActivity[];
}

export const adminApi = {
  getDashboardData: async () => {
    const response = await http.get<{ data: DashboardData }>('/admin/dashboard');
    return response.data.data;
  },
};
