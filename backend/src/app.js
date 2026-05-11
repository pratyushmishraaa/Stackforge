import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import AppError from './utils/AppError.js';
import { STATUS } from './constants/status.js';

const app = express();

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // allow cookies cross-origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, STATUS.NOT_FOUND, 'NOT_FOUND'));
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
