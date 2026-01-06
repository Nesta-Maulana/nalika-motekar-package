import apiClient from './client';
import { Notification, NotificationListParams, NotificationListResponse } from '../../types';

export const notificationsApi = {
  async getNotifications(params?: NotificationListParams): Promise<NotificationListResponse> {
    const response = await apiClient.get<NotificationListResponse>('/v1/notifications', {
      params,
    });
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ data: { count: number } }>(
      '/v1/notifications/unread-count'
    );
    return response.data.data.count;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<{ data: Notification }>(
      `/v1/notifications/${id}/read`
    );
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/v1/notifications/mark-all-read');
  },

  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/v1/notifications/${id}`);
  },

  async deleteAllRead(): Promise<void> {
    await apiClient.delete('/v1/notifications/read');
  },
};

export default notificationsApi;
