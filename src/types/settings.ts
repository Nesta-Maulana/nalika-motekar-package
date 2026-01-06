export type SettingType = 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array' | 'encrypted';

export type SettingGroup =
  | 'general'
  | 'auth'
  | 'smtp'
  | 'notification'
  | 'storage'
  | 'billing'
  | 'appearance'
  | 'security'
  | 'features';

export interface SettingOption {
  label: string;
  value: string;
}

export interface GlobalSetting {
  id: string;
  key: string;
  value: string | null;
  type: SettingType;
  group: SettingGroup;
  label: string;
  description: string | null;
  is_public: boolean;
  is_encrypted: boolean;
  validation_rules: Record<string, unknown> | null;
  options: SettingOption[] | null;
  created_at: string;
  updated_at: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'tls' | 'ssl' | 'none';
  from_address: string;
  from_name: string;
}

export interface AuthSettings {
  allow_registration: boolean;
  require_email_verification: boolean;
  enable_otp: boolean;
  otp_expiry_minutes: number;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_number: boolean;
  password_require_special: boolean;
  max_login_attempts: number;
  lockout_duration_minutes: number;
  session_lifetime_minutes: number;
  remember_me_lifetime_days: number;
}

export interface FeatureFlags {
  maintenance_mode: boolean;
  allow_tenant_registration: boolean;
  enable_api_access: boolean;
  enable_webhooks: boolean;
  enable_audit_logs: boolean;
  enable_two_factor: boolean;
  enable_sso: boolean;
  [key: string]: boolean;
}

export interface AppearanceSettings {
  app_name: string;
  app_logo: string | null;
  app_favicon: string | null;
  primary_color: string;
  secondary_color: string;
  footer_text: string | null;
  custom_css: string | null;
}

export interface SettingsGroup {
  group: SettingGroup;
  label: string;
  description: string;
  settings: GlobalSetting[];
}

export interface UpdateSettingPayload {
  key: string;
  value: string | number | boolean | object | null;
}

export interface UpdateSettingsPayload {
  settings: UpdateSettingPayload[];
}

export interface TestSmtpPayload {
  to_email: string;
}

export interface TestSmtpResponse {
  success: boolean;
  message: string;
  error?: string;
}
