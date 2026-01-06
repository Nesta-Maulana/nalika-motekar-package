'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../lib/api';
import { User, CreateUserDTO, UpdateUserDTO, UserFilters } from '../types';

export const USERS_QUERY_KEYS = {
  list: ['users'],
  detail: (id: string) => ['users', id],
} as const;

export function useUsers(initialFilters?: UserFilters) {
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const query = useQuery({
    queryKey: [...USERS_QUERY_KEYS.list, filters],
    queryFn: () => usersApi.getUsers(filters),
  });

  return {
    ...query,
    users: query.data?.data || [],
    meta: query.data?.meta,
    filters,
    setFilters,
  };
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.list });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.list });
    },
  });
}

export function useAssignRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) =>
      usersApi.assignRoles(id, roleIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(id) });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => usersApi.resetPassword(id),
  });
}
