import { z } from 'zod';

// Tenant Information Schema (Tab 1)
export const tenantInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(255, 'Company name must not exceed 255 characters'),
  subdomain: z
    .string()
    .min(1, 'Subdomain is required')
    .min(2, 'Subdomain must be at least 2 characters')
    .max(100, 'Subdomain must not exceed 100 characters')
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      'Subdomain can only contain lowercase letters, numbers, and hyphens'
    ),
  domain: z
    .string()
    .max(255, 'Domain must not exceed 255 characters')
    .optional()
    .nullable(),
  plan_id: z
    .string()
    .min(1, 'Plan is required')
    .uuid('Invalid plan ID'),
});

// Tenant Settings Schema (Tab 2)
export const tenantSettingsSchema = z.object({
  company_email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  company_phone: z
    .string()
    .max(20, 'Phone must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
  company_address: z
    .string()
    .max(500, 'Address must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  company_city: z
    .string()
    .max(100, 'City must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  company_country: z
    .string()
    .max(100, 'Country must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  company_postal_code: z
    .string()
    .max(20, 'Postal code must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
  company_website: z
    .string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  company_tax_id: z
    .string()
    .max(50, 'Tax ID must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  timezone: z
    .string()
    .optional()
    .default('Asia/Jakarta'),
  date_format: z
    .string()
    .optional()
    .default('DD/MM/YYYY'),
  time_format: z
    .enum(['12h', '24h'])
    .optional()
    .default('24h'),
  currency: z
    .string()
    .optional()
    .default('IDR'),
});

// Module Configuration Schema (Tab 3)
export const tenantModulesSchema = z.object({
  module_ids: z.array(z.string().uuid()).default([]),
});

// Admin Account Schema (Tab 4 - only for create)
export const adminAccountSchema = z.object({
  admin_name: z
    .string()
    .min(1, 'Admin name is required')
    .min(2, 'Admin name must be at least 2 characters')
    .max(255, 'Admin name must not exceed 255 characters'),
  admin_email: z
    .string()
    .min(1, 'Admin email is required')
    .email('Invalid email format'),
  admin_password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Combined Create Tenant Schema
export const createTenantSchema = tenantInfoSchema
  .merge(
    z.object({
      settings: tenantSettingsSchema.optional(),
      module_ids: z.array(z.string().uuid()).optional(),
    })
  )
  .merge(adminAccountSchema);

// Combined Update Tenant Schema
export const updateTenantSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(255, 'Company name must not exceed 255 characters')
    .optional(),
  domain: z
    .string()
    .max(255, 'Domain must not exceed 255 characters')
    .optional()
    .nullable(),
  plan_id: z
    .string()
    .uuid('Invalid plan ID')
    .optional(),
  settings: tenantSettingsSchema.optional(),
  module_ids: z.array(z.string().uuid()).optional(),
});

// Suspend Tenant Schema
export const suspendTenantSchema = z.object({
  reason: z
    .string()
    .max(500, 'Reason must not exceed 500 characters')
    .optional(),
});

// Types
export type TenantInfoFormData = z.infer<typeof tenantInfoSchema>;
export type TenantSettingsFormData = z.infer<typeof tenantSettingsSchema>;
export type TenantModulesFormData = z.infer<typeof tenantModulesSchema>;
export type AdminAccountFormData = z.infer<typeof adminAccountSchema>;
export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
export type SuspendTenantFormData = z.infer<typeof suspendTenantSchema>;
