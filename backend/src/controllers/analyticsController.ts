import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export class AnalyticsController {
  static getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
    const analytics = await AnalyticsService.getAnalytics();
    ApiResponse.success(res, analytics, 'Analytics retrieved successfully');
  });
}

export class DashboardController {
  static getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await AnalyticsService.getDashboardStats();
    ApiResponse.success(res, stats, 'Dashboard stats retrieved successfully');
  });
}
