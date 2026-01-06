'use client';

import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useNotificationStore } from '../../stores';
import { useUnreadCount } from '../../hooks/useNotifications';
import { NotificationList } from './NotificationList';
import { cn } from '../../lib/utils';

export function NotificationBell() {
  const { unreadCount, isDropdownOpen, setDropdownOpen } = useNotificationStore();

  // Fetch and sync unread count
  useUnreadCount();

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-medium',
                unreadCount > 99 ? 'h-5 w-7 px-1' : 'h-5 w-5'
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifikasi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0"
        align="end"
        forceMount
      >
        <NotificationList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
