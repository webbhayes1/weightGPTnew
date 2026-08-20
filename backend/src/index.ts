import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'express-pino-logger';
import { PrismaClient } from '@prisma/client';
import { initializeFirebase } from './config/firebase';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import mealPlanRoutes from './routes/mealPlan.routes';
import mealsRoutes from './routes/meals.routes';
import workoutPlanRoutes from './routes/workoutPlan.routes';
import progressRoutes from './routes/progress.routes';
import groceryListRoutes from './routes/groceryList.routes';
import loggingRoutes from './routes/logging.routes';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
try {
  initializeFirebase();
} catch (error) {
  console.error('Failed to initialize Firebase. Server will continue but auth will not work.');
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// Middleware - Order matters!
app.use(helmet()); // Security headers
// @ts-ignore - Type mismatch between pino and express-pino-logger versions
app.use(pinoHttp({ logger })); // Request logging
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      timestamp: Date.now(),
      database: 'connected',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'WeightGPT API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/grocery-lists', groceryListRoutes);
app.use('/api/logging', loggingRoutes);

// 404 handler (must come after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Export app for testing
export default app;

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`🚀 WeightGPT Backend running on http://localhost:${port}`);
    logger.info(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📡 Health check: http://localhost:${port}/health`);
    logger.info(`🔥 Firebase Admin SDK: ${process.env.FIREBASE_PROJECT_ID || 'not configured'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});
