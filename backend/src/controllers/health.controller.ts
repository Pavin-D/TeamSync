import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/database';

export async function getHealthStatus(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();

  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      message: 'TeamSync API is running but PostgreSQL database connection failed.',
      database: 'DISCONNECTED',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    message: 'TeamSync API is running',
    database: 'CONNECTED',
    timestamp: new Date().toISOString(),
  });
}
