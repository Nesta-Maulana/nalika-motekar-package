// Export from auth - excluding Tenant and Plan (use tenant.ts versions)
export {
  type LoginDTO,
  type RegisterDTO,
  type ForgotPasswordDTO,
  type ResetPasswordDTO,
  type VerifyOtpDTO,
  type ChangePasswordDTO,
  type LoginResponse,
  type OtpRequiredResponse,
  type TokenResponse,
  type User,
  type Role,
  type RolePermission,
  type LoginResult,
} from './auth';

export * from './user';

// Export from menu - excluding Module (use tenant.ts version)
export {
  type Menu,
  type MenuTreeItem,
  type CreateMenuDTO,
  type UpdateMenuDTO,
  type ReorderMenuDTO,
} from './menu';

export * from './notification';

// Export all from tenant (Tenant, Plan, Module are the canonical versions)
export * from './tenant';

// Export all settings types
export * from './settings';

// Export all central/audit types
export * from './central';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
