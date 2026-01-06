'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '../../stores';
import { useNotificationSubscription } from '../../hooks/useNotifications';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  // Subscribe to real-time notifications
  useNotificationSubscription();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
