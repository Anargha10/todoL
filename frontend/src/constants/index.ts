import { TaskStatus, TaskPriority, TaskCategory } from '../types';

export const STATUS_OPTIONS = Object.values(TaskStatus).map((value) => ({
  label: value,
  value,
}));

export const PRIORITY_OPTIONS = Object.values(TaskPriority).map((value) => ({
  label: value,
  value,
}));

export const CATEGORY_OPTIONS = Object.values(TaskCategory).map((value) => ({
  label: value,
  value,
}));

export const SORT_OPTIONS = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Updated Date', value: 'updatedAt' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Title', value: 'title' },
];

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; border: string; ring: string }> = {
  [TaskPriority.LOW]: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    ring: 'ring-emerald-500',
  },
  [TaskPriority.MEDIUM]: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    ring: 'ring-amber-500',
  },
  [TaskPriority.HIGH]: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    ring: 'ring-orange-500',
  },
  [TaskPriority.CRITICAL]: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    ring: 'ring-red-500',
  },
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  [TaskStatus.TODO]: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  [TaskStatus.IN_PROGRESS]: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  [TaskStatus.COMPLETED]: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  [TaskStatus.ARCHIVED]: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
  },
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.PERSONAL]: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  [TaskCategory.WORK]: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  [TaskCategory.STUDY]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400',
  [TaskCategory.HEALTH]: 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
  [TaskCategory.FINANCE]: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  [TaskCategory.CUSTOM]: 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
};
