'use client';

import { getEcho } from './client';
import { Notification } from '../../types';

export const CHANNELS = {
  USER: (userId: string) => `user.${userId}`,
  TENANT: (tenantId: string) => `tenant.${tenantId}`,
  NOTIFICATIONS: (userId: string) => `notifications.${userId}`,
} as const;

export const EVENTS = {
  NOTIFICATION_NEW: 'notification.new',
  NOTIFICATION_READ: 'notification.read',
  USER_UPDATED: 'user.updated',
  TENANT_UPDATED: 'tenant.updated',
} as const;

export interface NotificationNewEvent {
  notification: Notification;
}

export function subscribeToUserChannel(
  userId: string,
  callbacks: {
    onNotification?: (data: NotificationNewEvent) => void;
    onUserUpdated?: (data: unknown) => void;
  }
): () => void {
  const echo = getEcho();
  if (!echo) return () => {};

  const channel = echo.private(CHANNELS.USER(userId));

  if (callbacks.onNotification) {
    channel.listen(EVENTS.NOTIFICATION_NEW, callbacks.onNotification);
  }

  if (callbacks.onUserUpdated) {
    channel.listen(EVENTS.USER_UPDATED, callbacks.onUserUpdated);
  }

  return () => {
    channel.stopListening(EVENTS.NOTIFICATION_NEW);
    channel.stopListening(EVENTS.USER_UPDATED);
    echo.leave(CHANNELS.USER(userId));
  };
}

export function subscribeToTenantChannel(
  tenantId: string,
  callbacks: {
    onTenantUpdated?: (data: unknown) => void;
  }
): () => void {
  const echo = getEcho();
  if (!echo) return () => {};

  const channel = echo.private(CHANNELS.TENANT(tenantId));

  if (callbacks.onTenantUpdated) {
    channel.listen(EVENTS.TENANT_UPDATED, callbacks.onTenantUpdated);
  }

  return () => {
    channel.stopListening(EVENTS.TENANT_UPDATED);
    echo.leave(CHANNELS.TENANT(tenantId));
  };
}

export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: Notification) => void
): () => void {
  const echo = getEcho();
  if (!echo) return () => {};

  const channel = echo.private(CHANNELS.NOTIFICATIONS(userId));

  channel.listen('.notification.new', (data: NotificationNewEvent) => {
    onNotification(data.notification);
  });

  return () => {
    channel.stopListening('.notification.new');
    echo.leave(CHANNELS.NOTIFICATIONS(userId));
  };
}

export default {
  CHANNELS,
  EVENTS,
  subscribeToUserChannel,
  subscribeToTenantChannel,
  subscribeToNotifications,
};
