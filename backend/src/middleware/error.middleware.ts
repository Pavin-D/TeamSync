import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred on the server.';

  console.error(`[API Error] ${req.method} ${req.path} (${statusCode}): ${message}`);

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
}
