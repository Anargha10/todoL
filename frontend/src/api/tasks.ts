import { api } from './axios';
import { Task, TaskInput, TaskUpdate, TasksResponse, ApiResponse } from '../types';

export const taskApi = {
  getAll: async (params?: Record<string, any>): Promise<TasksResponse> => {
    const response = await api.get<ApiResponse<TasksResponse>>('/tasks', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (task: TaskInput): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', task);
    return response.data.data;
  },

  update: async (id: string, task: TaskUpdate): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, task);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/tasks/${id}`);
  },

  duplicate: async (id: string): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(`/tasks/${id}/duplicate`);
    return response.data.data;
  },

  bulkDelete: async (ids: string[]): Promise<{ deletedCount: number }> => {
    const response = await api.post<ApiResponse<{ deletedCount: number }>>('/tasks/bulk-delete', { ids });
    return response.data.data;
  },

  bulkComplete: async (ids: string[]): Promise<{ completedCount: number }> => {
    const response = await api.post<ApiResponse<{ completedCount: number }>>('/tasks/bulk-complete', { ids });
    return response.data.data;
  },
};
