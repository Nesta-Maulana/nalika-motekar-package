import apiClient from './client';
import {
  Role,
  Permission,
  CreateRoleDTO,
  UpdateRoleDTO,
  RoleFilters,
  PaginatedResponse,
} from '../../types';

export const rolesApi = {
  async getRoles(params?: RoleFilters): Promise<PaginatedResponse<Role>> {
    const response = await apiClient.get<PaginatedResponse<Role>>('/v1/roles', { params });
    return response.data;
  },

  async getRole(id: string): Promise<Role> {
    const response = await apiClient.get<{ data: Role }>(`/v1/roles/${id}`);
    return response.data.data;
  },

  async createRole(data: CreateRoleDTO): Promise<Role> {
    const response = await apiClient.post<{ data: Role }>('/v1/roles', data);
    return response.data.data;
  },

  async updateRole(id: string, data: UpdateRoleDTO): Promise<Role> {
    const response = await apiClient.put<{ data: Role }>(`/v1/roles/${id}`, data);
    return response.data.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/v1/roles/${id}`);
  },

  async syncPermissions(id: string, permissionIds: string[]): Promise<Role> {
    const response = await apiClient.post<{ data: Role }>(`/v1/roles/${id}/permissions`, {
      permission_ids: permissionIds,
    });
    return response.data.data;
  },
};

export const permissionsApi = {
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<{ data: Permission[] }>('/v1/permissions');
    return response.data.data;
  },

  async getGroupedPermissions(): Promise<Record<string, Permission[]>> {
    const permissions = await this.getPermissions();
    return permissions.reduce((acc, permission) => {
      const module = permission.module || 'general';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  },
};

export default rolesApi;
