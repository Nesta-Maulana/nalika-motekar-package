import type { User } from './auth';

export interface Permission {
  id: string;
  name: string;
  guard_name: string;
  module?: string;
  description?: string;
}

// User Management Types (for admin user management)
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role_ids?: string[];
  is_active?: boolean;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role_ids?: string[];
  is_active?: boolean;
}

export interface UserFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  role_id?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Role Management Types
export interface CreateRoleDTO {
  name: string;
  slug?: string;
  description?: string;
  permission_ids: string[];
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  permission_ids?: string[];
}

export interface RoleFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

// Module Management Types
export interface ModuleFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface UpdateProfileDTO {
  name: string;
  phone?: string;
}

export interface UpdateAvatarDTO {
  avatar: File;
}

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'inactive';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Session {
  id: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  is_current: boolean;
}
