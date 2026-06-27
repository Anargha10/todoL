import { Response } from 'express';
import { IApiResponse } from '../types';

export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message: string = 'Resource created successfully'): void {
    this.success(res, data, message, 201);
  }

  static noContent(res: Response, message: string = 'Resource deleted successfully'): void {
    const response: IApiResponse<null> = {
      success: true,
      message,
      data: null,
    };
    res.status(204).json(response);
  }
}

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request'): ApiError {
    return new ApiError(message, 400);
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404);
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }

  static conflict(message: string = 'Conflict'): ApiError {
    return new ApiError(message, 409);
  }

  static validation(message: string = 'Validation error'): ApiError {
    return new ApiError(message, 422);
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return new ApiError(message, 500, false);
  }
}
