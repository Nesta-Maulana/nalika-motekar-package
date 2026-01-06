export type TenantStatus = 'pending' | 'provisioning' | 'active' | 'suspended' | 'terminated';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  version: string;
  is_core: boolean;
  is_active: boolean;
  has_migrations: boolean;
  permissions: string[] | null;
  menu_items: Record<string, unknown>[] | null;
  settings_schema: Record<string, unknown> | null;
  dependencies: string[] | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    settings: Record<string, unknown> | null;
    activated_at: string | null;
    migration_status: string | null;
  };
}

export interface TenantSettings {
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_city?: string;
  company_country?: string;
  company_postal_code?: string;
  company_website?: string;
  company_tax_id?: string;
  timezone?: string;
  date_format?: string;
  time_format?: '12h' | '24h';
  currency?: string;
  [key: string]: unknown;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  domain: string | null;
  status: TenantStatus;
  plan_id: string;
  plan?: Plan;
  modules?: Module[];
  settings: TenantSettings | null;
  provisioned_at: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTenantPayload {
  name: string;
  subdomain: string;
  plan_id: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
  domain?: string;
  settings?: TenantSettings;
  module_ids?: string[];
}

export interface UpdateTenantPayload {
  name?: string;
  domain?: string | null;
  plan_id?: string;
  settings?: TenantSettings;
  module_ids?: string[];
}

export interface TenantFilters {
  search?: string;
  status?: TenantStatus | 'all';
  plan_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface TenantListResponse {
  success: boolean;
  data: Tenant[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface TenantStats {
  total: number;
  by_status: {
    pending: number;
    provisioning: number;
    active: number;
    suspended: number;
    terminated: number;
  };
  by_plan: Array<{
    plan_id: string;
    plan_name: string;
    count: number;
  }>;
}

export interface SuspendTenantPayload {
  reason?: string;
}
