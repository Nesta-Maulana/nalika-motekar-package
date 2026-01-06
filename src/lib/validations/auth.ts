import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password harus diisi')
    .min(6, 'Password minimal 6 karakter'),
  remember_me: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    tenant_name: z
      .string()
      .min(1, 'Nama perusahaan harus diisi')
      .min(3, 'Nama perusahaan minimal 3 karakter')
      .max(100, 'Nama perusahaan maksimal 100 karakter'),
    subdomain: z
      .string()
      .min(1, 'Subdomain harus diisi')
      .min(3, 'Subdomain minimal 3 karakter')
      .max(50, 'Subdomain maksimal 50 karakter')
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'Subdomain hanya boleh huruf kecil, angka, dan tanda hubung'
      ),
    name: z
      .string()
      .min(1, 'Nama harus diisi')
      .min(3, 'Nama minimal 3 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: z
      .string()
      .min(1, 'Email harus diisi')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(1, 'Password harus diisi')
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password harus mengandung huruf besar, huruf kecil, dan angka'
      ),
    password_confirmation: z.string().min(1, 'Konfirmasi password harus diisi'),
    agree_to_terms: z.literal(true, {
      errorMap: () => ({ message: 'Anda harus menyetujui syarat dan ketentuan' }),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email harus diisi')
    .email('Format email tidak valid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password harus diisi')
      .min(8, 'Password minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password harus mengandung huruf besar, huruf kecil, dan angka'
      ),
    password_confirmation: z.string().min(1, 'Konfirmasi password harus diisi'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .min(1, 'Kode OTP harus diisi')
    .length(6, 'Kode OTP harus 6 digit')
    .regex(/^\d+$/, 'Kode OTP hanya boleh angka'),
});

export type OtpFormData = z.infer<typeof otpSchema>;
