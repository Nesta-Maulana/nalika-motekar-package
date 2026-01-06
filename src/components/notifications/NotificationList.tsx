'use client';

import Link from 'next/link';
import { Check, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useNotifications, useMarkAllAsRead } from '../../hooks/useNotifications';
import { useNotificationStore } from '../../stores';
import { NotificationItem } from './NotificationItem';
import { Loading } from '../common/Loading';
import { Empty } from '../common/Empty';

export function NotificationList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();
  const markAllAsRead = useMarkAllAsRead();
  const { unreadCount, setDropdownOpen } = useNotificationStore();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold">Notifikasi</h3>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <Check className="mr-1 h-4 w-4" />
              Tandai semua
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            icon="inbox"
            title="Tidak ada notifikasi"
            description="Anda akan menerima notifikasi di sini"
            className="py-8"
          />
        ) : (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        )}

        {/* Load more */}
        {hasNextPage && (
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Memuat...' : 'Muat lebih banyak'}
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-2">
        <Link
          href="/dashboard/notifications"
          className="block"
          onClick={() => setDropdownOpen(false)}
        >
          <Button variant="ghost" size="sm" className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Lihat Semua Notifikasi
          </Button>
        </Link>
      </div>
    </div>
  );
}
