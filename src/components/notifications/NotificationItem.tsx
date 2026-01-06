'use client';

import { Trash2, Info, CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Notification } from '../../types';
import { useMarkAsRead, useDeleteNotification } from '../../hooks/useNotifications';
import { formatRelative } from '../../lib/utils/formatters';
import { cn } from '../../lib/utils';

interface NotificationItemProps {
  notification: Notification;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const markAsRead = useMarkAsRead();
  const deleteNotification = useDeleteNotification();

  const isUnread = !notification.read_at;
  const type = notification.type.split('.')[0] || 'info';
  const Icon = typeIcons[type] || Bell;
  const iconColor = typeColors[type] || 'text-muted-foreground';

  const handleClick = () => {
    if (isUnread) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(notification.id);
  };

  return (
    <li
      className={cn(
        'flex gap-3 p-4 cursor-pointer hover:bg-accent transition-colors group',
        isUnread && 'bg-primary/5'
      )}
      onClick={handleClick}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColor)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm font-medium truncate',
              isUnread && 'font-semibold'
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelative(notification.created_at)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={handleDelete}
        disabled={deleteNotification.isPending}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </li>
  );
}
