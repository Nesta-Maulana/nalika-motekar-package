'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { notificationsApi } from '../lib/api';
import { useNotificationStore, useAuthStore } from '../stores';
import { subscribeToNotifications } from '../lib/reverb';
import { Notification } from '../types';
import { useToast } from './useToast';

export const NOTIFICATION_QUERY_KEYS = {
  list: ['notifications'],
  unreadCount: ['notifications', 'unread-count'],
} as const;

export function useNotifications(options?: { unreadOnly?: boolean }) {
  const { user, isHydrated } = useAuthStore();

  return useInfiniteQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.list, options?.unreadOnly],
    queryFn: ({ pageParam = 1 }) =>
      notificationsApi.getNotifications({
        page: pageParam,
        per_page: 10,
        unread_only: options?.unreadOnly,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: isHydrated && !!user,
    initialPageParam: 1,
  });
}

export function useUnreadCount() {
  const { user, isHydrated } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();

  const query = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: isHydrated && !!user,
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setUnreadCount(query.data);
    }
  }, [query.data, setUnreadCount]);

  return query;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead: markAsReadInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      return notificationsApi.markAsRead(id);
    },
    onSuccess: (_, id) => {
      markAsReadInStore(id);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead: markAllAsReadInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      return notificationsApi.markAllAsRead();
    },
    onSuccess: () => {
      markAllAsReadInStore();
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { removeNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      return notificationsApi.deleteNotification(id);
    },
    onSuccess: (_, id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
  });
}

export function useNotificationSubscription() {
  const { user, isHydrated } = useAuthStore();
  const { addNotification, incrementUnread } = useNotificationStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isHydrated || !user) return;

    const unsubscribe = subscribeToNotifications(
      user.id,
      (notification: Notification) => {
        addNotification(notification);
        incrementUnread();
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });

        toast({
          title: notification.title,
          description: notification.message,
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isHydrated, user, addNotification, incrementUnread, queryClient, toast]);
}
