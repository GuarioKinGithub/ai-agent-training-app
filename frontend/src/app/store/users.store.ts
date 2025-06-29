import { computed, Injectable } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import type { User, CreateUser, UpdateUser } from '@ai-agent-training/shared';
import { ApiService } from '../services/api.service';

type UsersState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userCount: computed(() => store.users().length),
    hasError: computed(() => !!store.error()),
  })),
  withMethods((store, apiService = new ApiService()) => ({
    async loadUsers(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const users = await apiService.get<User[]>('/users');
        patchState(store, { users, loading: false });
      } catch (error) {
        patchState(store, {
          error:
            error instanceof Error ? error.message : 'Failed to load users',
          loading: false,
        });
      }
    },

    async createUser(userData: CreateUser): Promise<User> {
      patchState(store, { error: null });
      try {
        const newUser = await apiService.post<User>('/users', userData);
        patchState(store, { users: [...store.users(), newUser] });
        return newUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create user';
        patchState(store, { error: message });
        throw error;
      }
    },

    async updateUser(id: string, userData: UpdateUser): Promise<User> {
      patchState(store, { error: null });
      try {
        const updatedUser = await apiService.patch<User>(
          `/users/${id}`,
          userData
        );
        patchState(store, {
          users: store
            .users()
            .map((user) => (user.id === id ? updatedUser : user)),
        });
        return updatedUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update user';
        patchState(store, { error: message });
        throw error;
      }
    },

    async deleteUser(id: string): Promise<void> {
      patchState(store, { error: null });
      try {
        await apiService.delete(`/users/${id}`);
        patchState(store, {
          users: store.users().filter((user) => user.id !== id),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete user';
        patchState(store, { error: message });
        throw error;
      }
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);