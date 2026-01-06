// Audit Log types
export type AuditEvent =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'restored'
  | 'login'
  | 'logout'
  | 'failed_login'
  | 'password_reset'
  | 'email_verified'
  | 'settings_updated'
  | 'tenant_provisioned'
  | 'module_activated'
  | 'module_deactivated'
  | 'plan_changed'
  | 'custom';

export interface AuditCauser {
  id: string;
  name: string;
  email: string;
  type?: 'central_user' | 'tenant_user';
}

export interface AuditProperties {
  old?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  extra?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AuditLog {
  id: string;
  log_name?: string;
  description: string;
  subject_type: string | null;
  subject_id: string | null;
  causer_type: string | null;
  causer_id: string | null;
  causer?: AuditCauser | null;
  properties: AuditProperties;
  event: AuditEvent;
  batch_uuid?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditFilters {
  search?: string;
  log_name?: string;
  event?: AuditEvent;
  subject_type?: string;
  subject_id?: string;
  causer_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AuditStats {
  total_logs: number;
  logs_today: number;
  logs_this_week: number;
  logs_this_month?: number;
  logs_by_event?: Record<AuditEvent, number>;
  logs_by_subject?: Record<string, number>;
  recent_activity?: AuditLog[];
}

export interface AuditExportPayload {
  format: 'csv' | 'json' | 'xlsx';
  filters?: AuditFilters;
  columns?: string[];
}

// Central User types
export type CentralUserRole = 'super_admin' | 'admin' | 'staff' | 'viewer';
export type CentralUserStatus = 'active' | 'inactive' | 'suspended';

export interface CentralUser {
  id: string;
  name: string;
  email: string;
  role: CentralUserRole;
  status?: CentralUserStatus;
  is_active?: boolean;
  email_verified_at: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CentralUserFilters {
  search?: string;
  role?: CentralUserRole;
  status?: CentralUserStatus;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CreateCentralUserPayload {
  name: string;
  email: string;
  password: string;
  role: CentralUserRole;
  is_active?: boolean;
}

export interface UpdateCentralUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: CentralUserRole;
  status?: CentralUserStatus;
  is_active?: boolean;
}

// Central Auth Types
export interface CentralLoginPayload {
  email: string;
  password: string;
}

export interface CentralLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: CentralUser;
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
  };
}
