'use client';

import { useQuery } from '@tanstack/react-query';
import { menusApi } from '../lib/api';
import { useAuthStore } from '../stores';
import { Menu } from '../types';

export const MENU_QUERY_KEYS = {
  userMenus: ['menus', 'user'],
  allMenus: ['menus', 'all'],
  menuTree: ['menus', 'tree'],
} as const;

export function useUserMenus() {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: MENU_QUERY_KEYS.userMenus,
    queryFn: () => menusApi.getUserMenus(),
    enabled: isHydrated && !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useMenuTree() {
  const { user, isHydrated } = useAuthStore();

  return useQuery({
    queryKey: MENU_QUERY_KEYS.menuTree,
    queryFn: () => menusApi.getMenuTree(),
    enabled: isHydrated && !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function buildMenuTree(menus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>();
  const rootMenus: Menu[] = [];

  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  menus.forEach((menu) => {
    const currentMenu = menuMap.get(menu.id)!;
    if (menu.parent_id) {
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(currentMenu);
      } else {
        rootMenus.push(currentMenu);
      }
    } else {
      rootMenus.push(currentMenu);
    }
  });

  const sortMenus = (items: Menu[]): Menu[] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map((menu) => ({
        ...menu,
        children: menu.children ? sortMenus(menu.children) : [],
      }));
  };

  return sortMenus(rootMenus);
}

export function findActiveMenu(menus: Menu[], pathname: string): Menu | null {
  for (const menu of menus) {
    if (menu.route === pathname) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const found = findActiveMenu(menu.children, pathname);
      if (found) return found;
    }
  }
  return null;
}

export function getMenuBreadcrumb(
  menus: Menu[],
  pathname: string
): { label: string; href?: string }[] {
  const findPath = (
    items: Menu[],
    path: string,
    breadcrumb: { label: string; href?: string }[] = []
  ): { label: string; href?: string }[] | null => {
    for (const menu of items) {
      const currentBreadcrumb = [
        ...breadcrumb,
        { label: menu.name, href: menu.route },
      ];

      if (menu.route === path) {
        return currentBreadcrumb;
      }

      if (menu.children && menu.children.length > 0) {
        const found = findPath(menu.children, path, currentBreadcrumb);
        if (found) return found;
      }
    }
    return null;
  };

  return findPath(menus, pathname) || [];
}
