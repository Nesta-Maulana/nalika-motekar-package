import apiClient from './client';

export interface TenantStats {
  total: number;
  by_status: {
    active: number;
    suspended: number;
    pending: number;
    terminated: number;
  };
  by_plan: Array<{
    plan_id: string;
    plan_name: string;
    count: number;
  }>;
}

export interface TenantWithUsers {
  tenant_id: string;
  tenant_name: string;
  subdomain: string;
  status: string;
  module_count: number;
  user_count: number;
  users_by_status: {
    active: number;
    inactive: number;
    suspended: number;
  };
  users_by_role: Array<{
    role: string;
    count: number;
  }>;
}

export interface DashboardStats {
  tenants: TenantStats;
  users: {
    total: number;
    by_tenant: TenantWithUsers[];
  };
  summary: {
    total_tenants: number;
    active_tenants: number;
    total_users: number;
  };
}

export interface Activity {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  tenant_id: string | null;
  tenant_name: string | null;
  token_type: 'central' | 'tenant' | null;
  action: string;
  resource: string;
  method: string;
  path: string;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
  response_status: number;
  duration_ms: number;
  details: Record<string, unknown>;
}

export interface ActivityParams {
  tenant_id?: string;
  user_id?: string;
  action?: string;
  token_type?: 'central' | 'tenant';
  tenant_name?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ActivitySummary {
  total: number;
  by_action: Array<{
    action: string;
    count: number;
  }>;
  by_tenant: Array<{
    tenant_id: string;
    count: number;
  }>;
  hourly: Array<{
    time: string;
    count: number;
  }>;
}

export const dashboardApi = {
  /**
   * Get dashboard statistics (tenant counts, user counts per tenant, module counts)
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/v1/statistics/dashboard');
    return response.data.data;
  },

  /**
   * Get activity logs with optional filters
   */
  async getActivities(params: ActivityParams = {}): Promise<{
    data: Activity[];
    meta: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  }> {
    const response = await apiClient.get('/v1/statistics/activities', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  /**
   * Get activity summary (aggregations)
   */
  async getActivitySummary(params: {
    tenant_id?: string;
    token_type?: 'central' | 'tenant';
    from?: string;
  } = {}): Promise<ActivitySummary> {
    const response = await apiClient.get('/v1/statistics/activities/summary', { params });
    return response.data.data;
  },
};

export default dashboardApi;
