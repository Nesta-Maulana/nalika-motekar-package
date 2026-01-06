'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menusApi, modulesApi } from '../lib/api';
import { useAuthStore } from '../stores';
import { Menu, CreateMenuDTO, UpdateMenuDTO, ReorderMenuDTO } from '../types';

export const MENU_QUERY_KEYS = {
  userMenus: ['menus', 'user'],
  allMenus: ['menus', 'all'],
  menuTree: ['menus', 'tree'],
  list: ['menus'],
  detail: (id: string) => ['menus', id],
  modules: ['modules'],
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

export function useMenus() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.list,
    queryFn: () => menusApi.getMenus(),
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

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuDTO) => menusApi.createMenu(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menuTree });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuDTO }) =>
      menusApi.updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menuTree });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menusApi.deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menuTree });
    },
  });
}

export function useReorderMenus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderMenuDTO) => menusApi.reorderMenus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.menuTree });
    },
  });
}

// Module hooks (for admin module management)
export function useAdminModules() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.modules,
    queryFn: () => modulesApi.getModules(),
  });
}

export function useActivateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modulesApi.activateModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.modules });
    },
  });
}

export function useDeactivateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modulesApi.deactivateModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEYS.modules });
    },
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
