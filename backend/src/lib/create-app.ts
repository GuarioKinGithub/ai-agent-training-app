import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { ApiError, ApiResponse } from '@ai-agent-training/shared';

export const createApp = (): Hono => {
  const app = new Hono();

  // Middleware
  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
    })
  );

  // Error handling
  app.onError((err, c) => {
    console.error(err);

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  });

  // 404 handler
  app.notFound((c) => {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 404);
  });

  return app;
};