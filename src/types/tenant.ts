export type TenantStatus = 'pending' | 'provisioning' | 'active' | 'suspended' | 'terminated';
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime' | 'custom';

export interface PlanFeatures {
  max_users?: number;
  max_storage_gb?: number;
  api_access?: boolean;
  priority_support?: boolean;
  custom_domain?: boolean;
  white_label?: boolean;
  sso?: boolean;
  audit_logs?: boolean;
  advanced_reports?: boolean;
  [key: string]: unknown;
}

export interface PlanLimits {
  users: number;
  storage_gb: number;
  api_calls_per_day: number;
  file_upload_mb: number;
  [key: string]: number;
}

export interface PlanModule {
  id: string;
  plan_id: string;
  module_id: string;
  module?: {
    id: string;
    name: string;
    code: string;
    description: string | null;
  };
  is_included: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  slug?: string;
  description: string | null;
  price: number;
  billing_cycle: BillingCycle;
  features: PlanFeatures;
  limits: PlanLimits;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  trial_days: number;
  modules?: PlanModule[];
  created_at: string;
  updated_at: string;
}

export interface CreatePlanPayload {
  name: string;
  code: string;
  description?: string;
  price: number;
  billing_cycle: BillingCycle;
  features?: PlanFeatures;
  limits?: PlanLimits;
  is_active?: boolean;
  is_default?: boolean;
  sort_order?: number;
  trial_days?: number;
  module_ids?: string[];
}

export interface UpdatePlanPayload {
  name?: string;
  code?: string;
  description?: string;
  price?: number;
  billing_cycle?: BillingCycle;
  features?: PlanFeatures;
  limits?: PlanLimits;
  is_active?: boolean;
  is_default?: boolean;
  sort_order?: number;
  trial_days?: number;
  module_ids?: string[];
}

export interface PlanFilters {
  search?: string;
  is_active?: boolean;
  billing_cycle?: BillingCycle;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PlanComparison {
  plans: Plan[];
  features: string[];
  feature_matrix: Record<string, Record<string, boolean | string | number>>;
}

export interface Module {
  id: string;
  name: string;
  code?: string;
  slug?: string;
  description: string | null;
  version: string;
  is_core: boolean;
  is_active: boolean;
  has_migrations?: boolean;
  icon?: string | null;
  permissions?: string[] | null;
  menu_items?: Record<string, unknown>[] | null;
  settings_schema: Record<string, unknown> | null;
  dependencies?: string[] | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    settings: Record<string, unknown> | null;
    activated_at: string | null;
    migration_status: string | null;
  };
}

export interface TenantModule {
  id: string;
  tenant_id: string;
  module_id: string;
  module?: Module;
  is_active: boolean;
  activated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  // Company Information
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_city?: string;
  company_province?: string;
  company_postal_code?: string;
  company_country?: string;
  company_npwp?: string;
  company_website?: string;
  company_tax_id?: string;
  // Branding
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  secondary_color?: string;
  // Localization
  timezone?: string;
  locale?: string;
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
  subdomain?: string;
  domain?: string | null;
  plan_id?: string;
  status?: TenantStatus;
  settings?: TenantSettings;
  module_ids?: string[];
  expires_at?: string;
}

export interface TenantFilters {
  search?: string;
  status?: TenantStatus | 'all';
  plan_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  sort_order?: 'asc' | 'desc';
}

export interface ProvisionTenantPayload {
  run_migrations?: boolean;
  seed_data?: boolean;
  activate_modules?: string[];
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
  total_tenants?: number;
  active_tenants?: number;
  pending_tenants?: number;
  suspended_tenants?: number;
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
  tenants_by_plan?: Record<string, number>;
  recent_signups?: number;
}

export interface SuspendTenantPayload {
  reason?: string;
}
