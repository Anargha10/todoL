import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiResponse';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw ApiError.validation(errorMessage);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        const errorMessage = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw ApiError.validation(errorMessage);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
