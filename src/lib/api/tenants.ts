import apiClient from './client';
import type {
  Tenant,
  Plan,
  Module,
  CreateTenantPayload,
  UpdateTenantPayload,
  TenantFilters,
  TenantListResponse,
  TenantStats,
  SuspendTenantPayload,
} from '../../types';

export const tenantsApi = {
  async getAll(filters: TenantFilters = {}): Promise<TenantListResponse> {
    const params: Record<string, string | number> = {};

    if (filters.search) params.search = filters.search;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.plan_id) params.plan_id = filters.plan_id;
    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.sort_dir) params.sort_dir = filters.sort_dir;

    const response = await apiClient.get<TenantListResponse>('/v1/tenants', { params });
    return response.data;
  },

  async getById(id: string): Promise<Tenant> {
    const response = await apiClient.get<{ data: Tenant }>(`/v1/tenants/${id}`);
    return response.data.data;
  },

  async create(data: CreateTenantPayload): Promise<Tenant> {
    const response = await apiClient.post<{ data: Tenant }>('/v1/tenants', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTenantPayload): Promise<Tenant> {
    const response = await apiClient.put<{ data: Tenant }>(`/v1/tenants/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/tenants/${id}`);
  },

  async suspend(id: string, payload?: SuspendTenantPayload): Promise<Tenant> {
    const response = await apiClient.post<{ data: Tenant }>(`/v1/tenants/${id}/suspend`, payload || {});
    return response.data.data;
  },

  async activate(id: string): Promise<Tenant> {
    const response = await apiClient.post<{ data: Tenant }>(`/v1/tenants/${id}/activate`);
    return response.data.data;
  },

  async getStats(): Promise<TenantStats> {
    const response = await apiClient.get<{ data: TenantStats }>('/v1/tenants/stats');
    return response.data.data;
  },

  async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<{ data: Plan[] }>('/v1/plans');
    return response.data.data;
  },

  async getModules(): Promise<Module[]> {
    const response = await apiClient.get<{ data: Module[] }>('/v1/modules');
    return response.data.data;
  },

  async checkSubdomain(subdomain: string): Promise<{ available: boolean }> {
    const response = await apiClient.get<{ data: { available: boolean } }>('/v1/tenants/check-subdomain', {
      params: { subdomain },
    });
    return response.data.data;
  },

  async updateModules(id: string, moduleIds: string[]): Promise<Tenant> {
    const response = await apiClient.put<{ data: Tenant }>(`/v1/tenants/${id}/modules`, {
      module_ids: moduleIds,
    });
    return response.data.data;
  },
};

export default tenantsApi;
