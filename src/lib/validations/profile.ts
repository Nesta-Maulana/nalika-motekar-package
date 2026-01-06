import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama harus diisi')
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+62|62|0)[0-9]{9,12}$/.test(val.replace(/\s|-/g, '')),
      'Format nomor telepon tidak valid'
    ),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Password saat ini harus diisi'),
    password: z
      .string()
      .min(1, 'Password baru harus diisi')
      .min(8, 'Password baru minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password harus mengandung huruf besar, huruf kecil, dan angka'
      ),
    password_confirmation: z.string().min(1, 'Konfirmasi password harus diisi'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok',
    path: ['password_confirmation'],
  })
  .refine((data) => data.current_password !== data.password, {
    message: 'Password baru harus berbeda dengan password saat ini',
    path: ['password'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const avatarSchema = z.object({
  avatar: z
    .custom<File>()
    .refine((file) => file instanceof File, 'File harus diunggah')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Ukuran file maksimal 2MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format file harus JPG, PNG, atau WebP'
    ),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;
