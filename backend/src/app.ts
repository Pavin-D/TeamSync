import express from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { errorMiddleware } from './middleware/error.middleware';

import healthRoutes from './routes/health.routes';
import collegeRoutes from './routes/college.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import githubRoutes from './routes/github.routes';
import eventRoutes from './routes/event.routes';
import teamRoutes from './routes/team.routes';
import workspaceRoutes from './routes/workspace.routes';
import locationRoutes from './routes/location.routes';
import recommendationRoutes from './routes/recommendation.routes';
import notificationRoutes from './routes/notification.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import reportRoutes from './routes/report.routes';
import rankingRoutes from './routes/ranking.routes';
import analyticsRoutes from './routes/analytics.routes';
import adminRoutes from './routes/admin.routes';
import searchRoutes from './routes/search.routes';

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/v1', healthRoutes);
app.use('/api', authRoutes);
app.use('/api/v1', authRoutes);
app.use('/', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api', githubRoutes);
app.use('/api/v1', githubRoutes);
app.use('/api', eventRoutes);
app.use('/api/v1', eventRoutes);
app.use('/api', teamRoutes);
app.use('/api/v1', teamRoutes);
app.use('/api', workspaceRoutes);
app.use('/api/v1', workspaceRoutes);
app.use('/api', locationRoutes);
app.use('/api/v1', locationRoutes);
app.use('/api', recommendationRoutes);
app.use('/api/v1', recommendationRoutes);
app.use('/api', notificationRoutes);
app.use('/api/v1', notificationRoutes);
app.use('/api', mentorshipRoutes);
app.use('/api/v1', mentorshipRoutes);
app.use('/api', reportRoutes);
app.use('/api/v1', reportRoutes);
app.use('/api', rankingRoutes);
app.use('/api/v1', rankingRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/v1', analyticsRoutes);
app.use('/api', collegeRoutes);
app.use('/api/v1', collegeRoutes);
app.use('/api', userRoutes);
app.use('/api/v1', userRoutes);
app.use('/api', searchRoutes);
app.use('/api/v1', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/admin', adminRoutes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;
