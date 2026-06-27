export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum TaskCategory {
  PERSONAL = 'Personal',
  WORK = 'Work',
  STUDY = 'Study',
  HEALTH = 'Health',
  FINANCE = 'Finance',
  CUSTOM = 'Custom',
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours: number;
  completedAt?: Date | null;
}

export interface ITaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  estimatedHours: number;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: TaskCategory;
  dueDate?: string;
  estimatedHours?: number;
  completedAt?: Date | null;
}

export interface ITaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IAnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  tasksByPriority: { priority: string; count: number }[];
  tasksByStatus: { status: string; count: number }[];
  tasksByCategory: { category: string; count: number }[];
  recentActivity: {
    action: string;
    taskTitle: string;
    timestamp: Date;
  }[];
}

export interface IDashboardStats {
  totalTasks: number;
  completedToday: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  highPriorityTasks: number;
}
