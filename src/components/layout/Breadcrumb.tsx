'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useUserMenus, buildMenuTree, getMenuBreadcrumb } from '../../hooks/useMenus';
import { cn } from '../../lib/utils';

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const { data: menus } = useUserMenus();

  const menuTree = menus ? buildMenuTree(menus) : [];
  const breadcrumbItems = getMenuBreadcrumb(menuTree, pathname);

  // Fallback for pages not in menu
  if (breadcrumbItems.length === 0) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      segments.forEach((segment, index) => {
        const href =
          index === segments.length - 1
            ? undefined
            : '/' + segments.slice(0, index + 1).join('/');
        breadcrumbItems.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href,
        });
      });
    }
  }

  return (
    <nav className={cn('flex items-center text-sm', className)}>
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
