import type { User } from './auth';

export interface Permission {
  id: string;
  name: string;
  guard_name: string;
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
