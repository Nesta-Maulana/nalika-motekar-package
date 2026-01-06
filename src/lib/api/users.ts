import apiClient from './client';
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilters,
  PaginatedResponse,
} from '../../types';

export const usersApi = {
  async getUsers(params?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/v1/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<{ data: User }>(`/v1/users/${id}`);
    return response.data.data;
  },

  async createUser(data: CreateUserDTO): Promise<User> {
    const response = await apiClient.post<{ data: User }>('/v1/users', data);
    return response.data.data;
  },

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const response = await apiClient.put<{ data: User }>(`/v1/users/${id}`, data);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/v1/users/${id}`);
  },

  async assignRoles(id: string, roleIds: string[]): Promise<User> {
    const response = await apiClient.post<{ data: User }>(`/v1/users/${id}/roles`, {
      role_ids: roleIds,
    });
    return response.data.data;
  },

  async resetPassword(id: string): Promise<void> {
    await apiClient.post(`/v1/users/${id}/reset-password`);
  },
};

export default usersApi;
