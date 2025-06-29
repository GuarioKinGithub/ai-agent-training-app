import { Factory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { ApiResponse } from '@ai-agent-training/shared';
import { createUserSchema, updateUserSchema } from '@ai-agent-training/shared';
import { userService } from '../../services/user-service';

const factory = new Factory();

const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const getAllUsers = factory.createHandlers(async (c) => {
  try {
    const users = await userService.getAllUsers();

    const response: ApiResponse = {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
});

export const getUserById = factory.createHandlers(
  zValidator('param', idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const user = await userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 404);
      }
      throw error;
    }
  }
);

export const createUser = factory.createHandlers(
  zValidator('json', createUserSchema),
  async (c) => {
    try {
      const data = c.req.valid('json');
      const user = await userService.createUser(data);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response, 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 409);
      }
      throw error;
    }
  }
);

export const updateUser = factory.createHandlers(
  zValidator('param', idParamSchema),
  zValidator('json', updateUserSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');
      const user = await userService.updateUser(id, data);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: error.message,
            },
            timestamp: new Date().toISOString(),
          };
          return c.json(response, 404);
        }
        if (error.message.includes('already exists')) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'USER_EXISTS',
              message: error.message,
            },
            timestamp: new Date().toISOString(),
          };
          return c.json(response, 409);
        }
      }
      throw error;
    }
  }
);

export const deleteUser = factory.createHandlers(
  zValidator('param', idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      await userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        data: { message: 'User deleted successfully' },
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 404);
      }
      throw error;
    }
  }
);