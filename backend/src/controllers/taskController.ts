import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { ITaskFilters } from '../types';

export class TaskController {
  static createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.createTask(req.body);
    ApiResponse.created(res, task, 'Task created successfully');
  });

  static getAllTasks = asyncHandler(async (req: Request, res: Response) => {
    const filters: ITaskFilters = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      category: req.query.category as any,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };
    const result = await TaskService.getAllTasks(filters);
    ApiResponse.success(res, result, 'Tasks retrieved successfully');
  });

  static getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.getTaskById(req.params.id);
    ApiResponse.success(res, task, 'Task retrieved successfully');
  });

  static updateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.updateTask(req.params.id, req.body);
    ApiResponse.success(res, task, 'Task updated successfully');
  });

  static deleteTask = asyncHandler(async (req: Request, res: Response) => {
    await TaskService.deleteTask(req.params.id);
    ApiResponse.success(res, null, 'Task deleted successfully');
  });

  static duplicateTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.duplicateTask(req.params.id);
    ApiResponse.created(res, task, 'Task duplicated successfully');
  });

  static bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    const count = await TaskService.bulkDelete(ids);
    ApiResponse.success(res, { deletedCount: count }, `${count} tasks deleted successfully`);
  });

  static bulkComplete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    const count = await TaskService.bulkComplete(ids);
    ApiResponse.success(res, { completedCount: count }, `${count} tasks completed successfully`);
  });
}
