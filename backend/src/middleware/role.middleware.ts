import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(allowedRoles: Array<'STUDENT' | 'PROFESSIONAL' | 'COLLEGE_ADMIN' | 'PLATFORM_ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User authentication required.',
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access restricted to authorized roles.',
        },
      });
    }

    return next();
  };
}
