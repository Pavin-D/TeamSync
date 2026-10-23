import { Request, Response, NextFunction } from 'express';

const attemptsMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_ATTEMPTS = 15;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const key = `${req.path}_${ip}`;
  const now = Date.now();

  const record = attemptsMap.get(key);

  if (record) {
    if (now > record.expiresAt) {
      attemptsMap.set(key, { count: 1, expiresAt: now + WINDOW_MS });
      return next();
    }

    if (record.count >= MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many authentication attempts. Please try again in 15 minutes.',
        },
      });
    }

    record.count += 1;
    attemptsMap.set(key, record);
    return next();
  }

  attemptsMap.set(key, { count: 1, expiresAt: now + WINDOW_MS });
  return next();
}
