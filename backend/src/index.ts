import { serve } from '@hono/node-server';
import { createApp } from './lib/create-app';
import { healthRoutes } from './routes/health/health.routes';
import { userRoutes } from './routes/users/users.routes';

const app = createApp();
const PORT = Number(process.env.PORT) || 3001;

// Routes
app.route('/health', healthRoutes);
app.route('/api/users', userRoutes);

console.log(`Server is running on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});