import type { Tenant, Plan } from './tenant';

export interface LoginDTO {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterDTO {
  tenant_name: string;
  subdomain: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyOtpDTO {
  otp_token: string;
  code: string;
}

export interface ChangePasswordDTO {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    };
  };
}

export interface OtpRequiredResponse {
  success: boolean;
  message: string;
  data: {
    requires_otp: true;
    otp_token: string;
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  email_verified_at?: string;
  otp_enabled: boolean;
  is_active?: boolean;
  status?: 'active' | 'inactive';
  tenant?: Tenant;
  roles: Role[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// Tenant and Plan are imported from tenant.ts

export interface Role {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  guard_name: string;
  is_system?: boolean;
  permissions?: RolePermission[];
  users_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RolePermission {
  id: string;
  name: string;
  guard_name: string;
  module?: string;
  description?: string;
}

export type LoginResult =
  | { success: true; user: User; token: string; refreshToken: string }
  | { success: false; requiresOtp: true; otpToken: string }
  | { success: false; error: string };
