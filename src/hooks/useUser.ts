'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { useAuthStore } from '../stores';
import { UpdateProfileDTO, ChangePasswordDTO } from '../types';
import { useToast } from './useToast';

export const USER_QUERY_KEYS = {
  profile: ['user', 'profile'],
  sessions: ['user', 'sessions'],
} as const;

export function useProfile() {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: USER_QUERY_KEYS.profile,
    queryFn: () => userApi.getProfile(),
    enabled: isHydrated && !!user,
    initialData: user || undefined,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      return userApi.updateProfile(data);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
      toast({
        title: 'Profil diperbarui',
        description: 'Perubahan profil Anda telah disimpan.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal memperbarui profil',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      return userApi.updateAvatar(file);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
      toast({
        title: 'Avatar diperbarui',
        description: 'Foto profil Anda telah diperbarui.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal memperbarui avatar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      return userApi.removeAvatar();
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(USER_QUERY_KEYS.profile, updatedUser);
      toast({
        title: 'Avatar dihapus',
        description: 'Foto profil Anda telah dihapus.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus avatar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ChangePasswordDTO) => {
      return userApi.changePassword(data);
    },
    onSuccess: () => {
      toast({
        title: 'Password diperbarui',
        description: 'Password Anda telah berhasil diubah.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal mengubah password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useToggleOtp() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      return userApi.toggleOtp(enabled);
    },
    onSuccess: (_, enabled) => {
      updateUser({ otp_enabled: enabled });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile });
      toast({
        title: enabled ? 'OTP diaktifkan' : 'OTP dinonaktifkan',
        description: enabled
          ? 'Verifikasi dua langkah telah diaktifkan.'
          : 'Verifikasi dua langkah telah dinonaktifkan.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal mengubah pengaturan OTP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useSessions() {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: USER_QUERY_KEYS.sessions,
    queryFn: () => userApi.getSessions(),
    enabled: isHydrated && !!user,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      return userApi.revokeSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.sessions });
      toast({
        title: 'Sesi dihapus',
        description: 'Sesi telah berhasil diakhiri.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus sesi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      return userApi.revokeAllSessions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.sessions });
      toast({
        title: 'Semua sesi dihapus',
        description: 'Semua sesi lain telah diakhiri.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Gagal menghapus sesi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
