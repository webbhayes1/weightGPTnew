/**
 * Error Handling Middleware
 * Global error handler for Express application
 * Formats errors consistently and logs them appropriately
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma database errors
 */
const handlePrismaError = (error: PrismaClientKnownRequestError): { statusCode: number; message: string } => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return {
        statusCode: 409,
        message: `Duplicate value for ${error.meta?.target || 'field'}`,
      };
    case 'P2025':
      // Record not found
      return {
        statusCode: 404,
        message: 'Record not found',
      };
    case 'P2003':
      // Foreign key constraint failed
      return {
        statusCode: 400,
        message: 'Invalid reference to related record',
      };
    default:
      return {
        statusCode: 500,
        message: 'Database operation failed',
      };
  }
};

/**
 * Handle Zod validation errors
 */
const handleZodError = (error: ZodError): { statusCode: number; message: string; errors: any[] } => {
  const errors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation failed',
    errors,
  };
};

/**
 * Error logging middleware
 * Logs errors before sending response
 */
export const logError = (error: Error, req: Request): void => {
  const isOperational = error instanceof AppError ? error.isOperational : false;

  // In production, use proper logger (pino)
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    // Log to external service (Sentry, etc.)
    console.error('🔴 CRITICAL ERROR:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.userId,
    });
  } else {
    // Development logging
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }
};

/**
 * Global error handling middleware
 * Must be defined AFTER all routes
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logError(error, req);

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    const { statusCode, message } = handlePrismaError(error);
    res.status(statusCode).json({
      error: 'Database error',
      message,
      ...(process.env.NODE_ENV === 'development' && { code: error.code }),
    });
    return;
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const { statusCode, message, errors } = handleZodError(error);
    res.status(statusCode).json({
      error: 'Validation error',
      message,
      errors,
    });
    return;
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: 'Application error',
      message: error.message,
    });
    return;
  }

  // Handle unknown errors
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message;

  res.status(statusCode).json({
    error: 'Internal server error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * 404 Not Found handler
 * Use this BEFORE the global error handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  AppError,
  errorHandler,
  notFoundHandler,
  logError,
  asyncHandler,
};
