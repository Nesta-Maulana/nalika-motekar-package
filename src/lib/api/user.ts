import apiClient from './client';
import { User, UpdateProfileDTO, ChangePasswordDTO, Session } from '../../types';

export const userApi = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/v1/profile');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileDTO): Promise<User> {
    const response = await apiClient.put<{ data: User }>('/v1/profile', data);
    return response.data.data;
  },

  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ data: User }>('/v1/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async removeAvatar(): Promise<User> {
    const response = await apiClient.delete<{ data: User }>('/v1/profile/avatar');
    return response.data.data;
  },

  async changePassword(data: ChangePasswordDTO): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put('/v1/profile/password', data);
    return response.data;
  },

  async toggleOtp(enabled: boolean): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put('/v1/profile/otp', { enabled });
    return response.data;
  },

  async getSessions(): Promise<Session[]> {
    const response = await apiClient.get<{ data: Session[] }>('/v1/profile/sessions');
    return response.data.data;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/v1/profile/sessions/${sessionId}`);
  },

  async revokeAllSessions(): Promise<void> {
    await apiClient.delete('/v1/profile/sessions');
  },
};

export default userApi;
