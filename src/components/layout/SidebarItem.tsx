'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { Menu } from '../../types';
import { useSidebarStore } from '../../stores';

interface SidebarItemProps {
  menu: Menu;
  pathname: string;
  isCollapsed: boolean;
  level?: number;
}

export function SidebarItem({
  menu,
  pathname,
  isCollapsed,
  level = 0,
}: SidebarItemProps) {
  const { expandedMenus, toggleMenu } = useSidebarStore();
  const isExpanded = expandedMenus.includes(menu.id);
  const hasChildren = menu.children && menu.children.length > 0;
  const isActive = pathname === menu.route;
  const isChildActive = menu.children?.some(
    (child) =>
      pathname === child.route ||
      child.children?.some((grandChild) => pathname === grandChild.route)
  );

  // Get icon component
  const IconComponent = menu.icon
    ? (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
        menu.icon
      ] || Icons.Circle
    : Icons.Circle;

  const handleClick = () => {
    if (hasChildren) {
      toggleMenu(menu.id);
    }
  };

  const itemContent = (
    <>
      <IconComponent
        className={cn('h-4 w-4 shrink-0', isCollapsed ? 'mx-auto' : 'mr-3')}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{menu.name}</span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </>
      )}
    </>
  );

  const itemClasses = cn(
    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    (isActive || isChildActive) && 'bg-accent text-accent-foreground',
    isActive && 'bg-primary/10 text-primary',
    level > 0 && !isCollapsed && 'ml-4'
  );

  if (!menu.is_visible) {
    return null;
  }

  return (
    <li>
      {menu.route && !hasChildren ? (
        <Link href={menu.route} className={itemClasses}>
          {itemContent}
        </Link>
      ) : (
        <button onClick={handleClick} className={cn(itemClasses, 'w-full')}>
          {itemContent}
        </button>
      )}

      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <ul className="mt-1 space-y-1">
          {menu.children?.map((child) => (
            <SidebarItem
              key={child.id}
              menu={child}
              pathname={pathname}
              isCollapsed={isCollapsed}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
