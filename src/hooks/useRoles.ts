'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi, permissionsApi } from '../lib/api';
import { CreateRoleDTO, UpdateRoleDTO, RoleFilters } from '../types';

export const ROLE_QUERY_KEYS = {
  list: ['roles'],
  detail: (id: string) => ['roles', id],
  permissions: ['permissions'],
  groupedPermissions: ['permissions', 'grouped'],
} as const;

export function useRoles(params?: RoleFilters) {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEYS.list, params],
    queryFn: () => rolesApi.getRoles(params),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.detail(id),
    queryFn: () => rolesApi.getRole(id),
    enabled: !!id,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.permissions,
    queryFn: () => permissionsApi.getPermissions(),
  });
}

export function useGroupedPermissions() {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.groupedPermissions,
    queryFn: () => permissionsApi.getGroupedPermissions(),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDTO) => rolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.list });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDTO }) =>
      rolesApi.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(id) });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.list });
    },
  });
}

export function useSyncPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }: { id: string; permissionIds: string[] }) =>
      rolesApi.syncPermissions(id, permissionIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(id) });
    },
  });
}
