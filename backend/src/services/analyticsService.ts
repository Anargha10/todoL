import { Task } from '../models/Task';
import { TaskStatus, IAnalyticsData, IDashboardStats } from '../types';

export class AnalyticsService {
  static async getAnalytics(): Promise<IAnalyticsData> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      tasksByPriority,
      tasksByStatus,
      tasksByCategory,
      recentCompleted,
      recentCreated,
    ] = await Promise.all([
      Task.countDocuments().exec(),
      Task.countDocuments({ status: TaskStatus.COMPLETED }).exec(),
      Task.countDocuments({ status: { $in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } }).exec(),
      Task.countDocuments({ dueDate: { $lt: now }, status: { $nin: [TaskStatus.COMPLETED, TaskStatus.ARCHIVED] } }).exec(),
      Task.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $project: { priority: '$_id', count: 1, _id: 0 } },
      ]).exec(),
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
      ]).exec(),
      Task.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
      ]).exec(),
      Task.find({ status: TaskStatus.COMPLETED, completedAt: { $gte: startOfDay } })
        .sort({ completedAt: -1 })
        .limit(5)
        .select('title completedAt')
        .lean()
        .exec(),
      Task.find({ createdAt: { $gte: startOfDay } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt')
        .lean()
        .exec(),
    ]);

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recentActivity = [
      ...recentCompleted.map((t) => ({
        action: 'completed',
        taskTitle: t.title,
        timestamp: t.completedAt || now,
      })),
      ...recentCreated.map((t) => ({
        action: 'created',
        taskTitle: t.title,
        timestamp: t.createdAt || now,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
      tasksByPriority,
      tasksByStatus,
      tasksByCategory,
      recentActivity,
    };
  }

  static async getDashboardStats(): Promise<IDashboardStats> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalTasks,
      completedToday,
      pendingTasks,
      overdueTasks,
      highPriorityTasks,
      avgCompletionResult,
    ] = await Promise.all([
      Task.countDocuments().exec(),
      Task.countDocuments({ status: TaskStatus.COMPLETED, completedAt: { $gte: startOfDay } }).exec(),
      Task.countDocuments({ status: { $in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } }).exec(),
      Task.countDocuments({ dueDate: { $lt: now }, status: { $nin: [TaskStatus.COMPLETED, TaskStatus.ARCHIVED] } }).exec(),
      Task.countDocuments({ priority: 'Critical', status: { $nin: [TaskStatus.COMPLETED, TaskStatus.ARCHIVED] } }).exec(),
      Task.aggregate([
        { $match: { status: TaskStatus.COMPLETED, completedAt: { $exists: true } } },
        {
          $project: {
            completionTime: { $subtract: ['$completedAt', '$createdAt'] },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$completionTime' },
          },
        },
      ]).exec(),
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
    const averageCompletionTime = avgCompletionResult.length > 0 ? Math.round(avgCompletionResult[0].avgTime / (1000 * 60 * 60)) : 0;

    return {
      totalTasks,
      completedToday,
      pendingTasks,
      overdueTasks,
      completionRate,
      averageCompletionTime,
      highPriorityTasks,
    };
  }
}
