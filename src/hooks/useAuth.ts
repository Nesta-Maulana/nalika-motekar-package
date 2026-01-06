'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';
import { useAuthStore } from '../stores';
import { initializeEcho, updateEchoAuth, disconnectEcho } from '../lib/reverb';
import { getDomainInfo } from './useDomainDetect';
import {
  LoginDTO,
  RegisterDTO,
  VerifyOtpDTO,
  LoginResult,
  LoginResponse,
  OtpRequiredResponse,
} from '../types';
import { useToast } from './useToast';

function isLoginResponse(
  response: LoginResponse | OtpRequiredResponse
): response is LoginResponse {
  return 'data' in response && 'token' in response.data && 'access_token' in response.data.token;
}

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation<LoginResult, Error, LoginDTO>({
    mutationFn: async (data) => {
      const { isCentral } = getDomainInfo();
      const response = isCentral
        ? await authApi.centralLogin(data)
        : await authApi.login(data);

      if (isLoginResponse(response)) {
        return {
          success: true,
          user: response.data.user,
          token: response.data.token.access_token,
          refreshToken: response.data.token.refresh_token,
        };
      }

      return {
        success: false,
        requiresOtp: true,
        otpToken: response.data.otp_token,
      };
    },
    onSuccess: (result) => {
      if (result.success) {
        setAuth(result.user, result.token, result.refreshToken);
        initializeEcho();
        updateEchoAuth(result.token);
        toast({
          title: 'Login berhasil',
          description: `Selamat datang, ${result.user.name}!`,
        });
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      toast({
        title: 'Login gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterDTO) => {
      return authApi.register(data);
    },
    onSuccess: () => {
      toast({
        title: 'Registrasi berhasil',
        description: 'Silakan cek email Anda untuk verifikasi.',
      });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    },
    onError: (error: Error) => {
      toast({
        title: 'Registrasi gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: VerifyOtpDTO) => {
      return authApi.verifyOtp(data);
    },
    onSuccess: (response) => {
      setAuth(
        response.data.user,
        response.data.token.access_token,
        response.data.token.refresh_token
      );
      initializeEcho();
      updateEchoAuth(response.data.token.access_token);
      toast({
        title: 'Verifikasi berhasil',
        description: `Selamat datang, ${response.data.user.name}!`,
      });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: 'Verifikasi gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      clearAuth();
      disconnectEcho();
      queryClient.clear();
      toast({
        title: 'Logout berhasil',
        description: 'Sampai jumpa lagi!',
      });
      router.push('/login');
    },
    onError: () => {
      clearAuth();
      disconnectEcho();
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      return authApi.forgotPassword({ email });
    },
    onSuccess: () => {
      toast({
        title: 'Email terkirim',
        description: 'Silakan cek email Anda untuk instruksi reset password.',
      });
    },
    onError: () => {
      toast({
        title: 'Email terkirim',
        description: 'Jika email terdaftar, Anda akan menerima instruksi reset password.',
      });
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { token: string; email: string; password: string; password_confirmation: string }) => {
      return authApi.resetPassword(data);
    },
    onSuccess: () => {
      toast({
        title: 'Password berhasil direset',
        description: 'Silakan login dengan password baru Anda.',
      });
      router.push('/login');
    },
    onError: (error: Error) => {
      toast({
        title: 'Reset password gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (token: string) => {
      return authApi.verifyEmail(token);
    },
    onSuccess: () => {
      toast({
        title: 'Email terverifikasi',
        description: 'Silakan login untuk melanjutkan.',
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: 'Verifikasi gagal',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Note: useCheckSubdomain is now in useTenants.ts to avoid duplication
