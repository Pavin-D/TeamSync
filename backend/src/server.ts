import app from './app';
import { config } from './config/environment';
import { checkDatabaseConnection } from './config/database';

async function startServer() {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.warn('⚠️ Warning: PostgreSQL database is not connected. API will respond with 503 until PostgreSQL is available.');
  } else {
    console.log('✅ PostgreSQL database connection verified successfully via Prisma ORM.');
  }

  app.listen(config.port, () => {
    console.log(`🚀 TeamSync Express API Server running on port ${config.port}`);
    console.log(`📡 Health endpoint: http://localhost:${config.port}/api/health`);
  });
}

startServer();
