import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDropdownOpen: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  setDropdownOpen: (open: boolean) => void;
  toggleDropdown: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isDropdownOpen: false,

  setNotifications: (notifications) => {
    set({ notifications });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
    if (!notification.read_at) {
      get().incrementUnread();
    }
  },

  removeNotification: (id) => {
    const notification = get().notifications.find((n) => n.id === id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    if (notification && !notification.read_at) {
      get().decrementUnread();
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ),
    }));
    get().decrementUnread();
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read_at: n.read_at || new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
  },

  setUnreadCount: (count) => {
    set({ unreadCount: Math.max(0, count) });
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  decrementUnread: () => {
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
  },

  setDropdownOpen: (open) => {
    set({ isDropdownOpen: open });
  },

  toggleDropdown: () => {
    set((state) => ({ isDropdownOpen: !state.isDropdownOpen }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
