import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/teamsync?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'teamsync_super_secret_jwt_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
