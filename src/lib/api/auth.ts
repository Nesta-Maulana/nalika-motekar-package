import apiClient from './client';
import {
  LoginDTO,
  LoginResponse,
  OtpRequiredResponse,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyOtpDTO,
  TokenResponse,
  User,
} from '../../types';

export const authApi = {
  async login(data: LoginDTO): Promise<LoginResponse | OtpRequiredResponse> {
    const response = await apiClient.post<LoginResponse | OtpRequiredResponse>(
      '/v1/auth/login',
      data
    );
    return response.data;
  },

  async register(data: RegisterDTO): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/v1/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/v1/auth/verify-email', { token });
    return response.data;
  },

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/v1/auth/resend-verification', { email });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordDTO): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/v1/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordDTO): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/v1/auth/reset-password', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpDTO): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/v1/auth/verify-otp', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<{ data: TokenResponse }>('/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data.data;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<{ data: { user: User } }>('/v1/auth/me');
    return response.data.data.user;
  },

  async checkSubdomain(subdomain: string): Promise<{ available: boolean }> {
    const response = await apiClient.get<{ data: { available: boolean } }>(
      `/v1/auth/check-subdomain/${subdomain}`
    );
    return response.data.data;
  },

  async centralLogin(data: LoginDTO): Promise<LoginResponse | OtpRequiredResponse> {
    const response = await apiClient.post<LoginResponse | OtpRequiredResponse>(
      '/v1/auth/central/login',
      data
    );
    return response.data;
  },

  async centralLogout(): Promise<void> {
    await apiClient.post('/v1/auth/central/logout');
  },

  async centralMe(): Promise<User> {
    const response = await apiClient.get<{ data: { user: User } }>('/v1/auth/central/me');
    return response.data.data.user;
  },

  async centralRefresh(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<{ data: TokenResponse }>('/v1/auth/central/refresh', {
      refresh_token: refreshToken,
    });
    return response.data.data;
  },
};

export default authApi;
