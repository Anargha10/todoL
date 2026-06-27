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

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours: number;
  completedAt?: string | null;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string;
  estimatedHours: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: TaskCategory;
  dueDate?: string;
  estimatedHours?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AnalyticsData {
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
    timestamp: string;
  }[];
}

export interface DashboardStats {
  totalTasks: number;
  completedToday: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  highPriorityTasks: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
