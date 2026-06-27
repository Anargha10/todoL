import { z } from 'zod';
import { TaskStatus, TaskPriority, TaskCategory } from '../types';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  priority: z.nativeEnum(TaskPriority, {
    errorMap: () => ({ message: 'Invalid priority value' }),
  }),
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
  category: z.nativeEnum(TaskCategory, {
    errorMap: () => ({ message: 'Invalid category value' }),
  }),
  dueDate: z.string().datetime({ message: 'Invalid due date format' }),
  estimatedHours: z.number().min(0, 'Estimated hours cannot be negative').max(1000, 'Estimated hours cannot exceed 1000'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).max(1000).optional(),
});

export const taskFiltersSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().transform(Number).default('1').refine((n) => n >= 1, 'Page must be at least 1'),
  limit: z.string().transform(Number).default('10').refine((n) => n >= 1 && n <= 100, 'Limit must be between 1 and 100'),
});

export const bulkActionSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
});
