import { Hono } from 'hono';
import * as handlers from './users.handlers';

export const userRoutes = new Hono();

userRoutes.get('/', ...handlers.getAllUsers);
userRoutes.get('/:id', ...handlers.getUserById);
userRoutes.post('/', ...handlers.createUser);
userRoutes.patch('/:id', ...handlers.updateUser);
userRoutes.delete('/:id', ...handlers.deleteUser);