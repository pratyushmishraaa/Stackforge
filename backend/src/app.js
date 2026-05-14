import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';
import orgRoutes  from './modules/orgs/org.routes.js';
import leadRoutes from './modules/leads/lead.routes.js';
import dealRoutes from './modules/deals/deal.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import userRoutes      from './modules/users/user.routes.js';
import activityRoutes  from './modules/activity/activity.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';

import errorHandler from './middlewares/error.middleware.js';
import { globalLimiter, authLimiter } from './middlewares/rateLimit.middleware.js';
import AppError from './utils/AppError.js';
import { STATUS } from './constants/status.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
    ];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use(globalLimiter);
app.use('/api/v1/auth/login',    authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// Routes
app.use('/api/v1/auth',  authRoutes);
app.use('/api/v1/orgs',  orgRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/deals', dealRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/activity',  activityRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404
app.use((req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, STATUS.NOT_FOUND, 'NOT_FOUND'));
});

// Global error handler
app.use(errorHandler);

export default app;
