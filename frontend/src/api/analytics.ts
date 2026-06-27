import { api } from './axios';
import { AnalyticsData, DashboardStats, ApiResponse } from '../types';

export const analyticsApi = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get<ApiResponse<AnalyticsData>>('/analytics');
    return response.data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
    return response.data.data;
  },
};
