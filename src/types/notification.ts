export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read_at?: string;
  created_at: string;
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'user.created'
  | 'user.updated'
  | 'role.assigned'
  | 'module.activated'
  | 'tenant.created'
  | 'system';

export interface NotificationListParams {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
}

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  notification_types: {
    [key: string]: {
      email: boolean;
      push: boolean;
      in_app: boolean;
    };
  };
}

export interface ReverbNotificationEvent {
  notification: Notification;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
