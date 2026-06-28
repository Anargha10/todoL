import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import {  TaskInput, TaskUpdate, TasksResponse, TaskFilters } from '../types';
import { useToast } from '../context/ThemeContext';

const TASKS_QUERY_KEY = 'tasks';
const TASK_QUERY_KEY = 'task';

export function useTasks(filters?: TaskFilters) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const tasksQuery: UseQueryResult<TasksResponse, Error> = useQuery({
    queryKey: [TASKS_QUERY_KEY, filters],
    queryFn: () => taskApi.getAll(filters),
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskInput) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Task created successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create task', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) => taskApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Task updated successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update task', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Task deleted successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete task', 'error');
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => taskApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Task duplicated successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to duplicate task', 'error');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => taskApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Tasks deleted successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete tasks', 'error');
    },
  });

  const bulkCompleteMutation = useMutation({
    mutationFn: (ids: string[]) => taskApi.bulkComplete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Tasks completed successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to complete tasks', 'error');
    },
  });

  return {
    tasks: tasksQuery.data?.tasks || [],
    pagination: tasksQuery.data?.pagination,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    duplicateTask: duplicateMutation.mutate,
    bulkDelete: bulkDeleteMutation.mutate,
    bulkComplete: bulkCompleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useTask(id: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const taskQuery = useQuery({
    queryKey: [TASK_QUERY_KEY, id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskUpdate) => taskApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData([TASK_QUERY_KEY, id], data);
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      showToast('Task updated successfully', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update task', 'error');
    },
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
