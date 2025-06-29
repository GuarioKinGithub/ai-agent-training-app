import type { CreateUser, UpdateUser } from '@ai-agent-training/shared';
import { userRepository } from '../repositories/user-repository';

export class UserService {
  public async getAllUsers() {
    return await userRepository.findAll();
  }

  public async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async createUser(data: CreateUser) {
    // Check if user exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    return await userRepository.create(data);
  }

  public async updateUser(id: string, data: UpdateUser) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }
    }

    return await userRepository.update(id, data);
  }

  public async deleteUser(id: string) {
    const user = await userRepository.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const userService = new UserService();