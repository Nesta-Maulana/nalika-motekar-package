'use client';

import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { useSidebarStore } from '../../stores';
import { useUserMenus, buildMenuTree } from '../../hooks/useMenus';
import { SidebarItem } from './SidebarItem';
import { Logo } from '../common';
import { Loading } from '../common/Loading';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isCollapsed, setCollapsed } = useSidebarStore();
  const { data: menus, isLoading } = useUserMenus();

  const menuTree = menus ? buildMenuTree(menus) : [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => useSidebarStore.getState().toggle()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <Logo showText={!isCollapsed} size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className={cn('hidden lg:flex', isCollapsed && 'hidden')}
            onClick={() => setCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loading size="sm" />
            </div>
          ) : (
            <ul className="space-y-1">
              {menuTree.map((menu) => (
                <SidebarItem
                  key={menu.id}
                  menu={menu}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
              ))}
            </ul>
          )}
        </nav>

        {/* Collapse toggle for collapsed state */}
        {isCollapsed && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
