'use client';

import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebarStore } from '../../stores';
import { UserMenu } from './UserMenu';
import { Breadcrumb } from './Breadcrumb';
import { NotificationBell } from '../notifications/NotificationBell';
import { cn } from '../../lib/utils';

export function Header() {
  const { toggle, isCollapsed } = useSidebarStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 transition-all',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-68'
      )}
    >
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
