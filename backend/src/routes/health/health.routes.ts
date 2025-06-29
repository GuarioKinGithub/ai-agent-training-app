import { Hono } from 'hono';
import type { ApiResponse } from '@ai-agent-training/shared';

export const healthRoutes = new Hono();

healthRoutes.get('/', (c) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response);
});