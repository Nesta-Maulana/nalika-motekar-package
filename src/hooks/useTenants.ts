'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '../lib/api';
import { useToast } from './useToast';
import type {
  TenantFilters,
  CreateTenantPayload,
  UpdateTenantPayload,
  SuspendTenantPayload,
} from '../types';

export const TENANT_QUERY_KEYS = {
  all: ['tenants'] as const,
  lists: () => [...TENANT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: TenantFilters) => [...TENANT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TENANT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TENANT_QUERY_KEYS.details(), id] as const,
  stats: () => [...TENANT_QUERY_KEYS.all, 'stats'] as const,
  plans: () => ['plans'] as const,
  modules: () => ['modules'] as const,
} as const;

export function useTenants(filters: TenantFilters = {}) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.list(filters),
    queryFn: () => tenantsApi.getAll(filters),
    staleTime: 30000,
  });
}

export function useTenant(id: string, enabled = true) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.detail(id),
    queryFn: () => tenantsApi.getById(id),
    enabled: enabled && !!id,
  });
}

export function useTenantStats() {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.stats(),
    queryFn: () => tenantsApi.getStats(),
    staleTime: 60000,
  });
}

export function usePlans() {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.plans(),
    queryFn: () => tenantsApi.getPlans(),
    staleTime: 300000,
  });
}

export function useModules() {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.modules(),
    queryFn: () => tenantsApi.getModules(),
    staleTime: 300000,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTenantPayload) => tenantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.stats() });
      toast({
        title: 'Tenant created',
        description: 'New tenant has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantPayload }) =>
      tenantsApi.update(id, data),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(TENANT_QUERY_KEYS.detail(updatedTenant.id), updatedTenant);
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.lists() });
      toast({
        title: 'Tenant updated',
        description: 'Tenant has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => tenantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.stats() });
      toast({
        title: 'Tenant deleted',
        description: 'Tenant has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useSuspendTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: SuspendTenantPayload }) =>
      tenantsApi.suspend(id, payload),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(TENANT_QUERY_KEYS.detail(updatedTenant.id), updatedTenant);
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.stats() });
      toast({
        title: 'Tenant suspended',
        description: 'Tenant has been suspended successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to suspend tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useActivateTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => tenantsApi.activate(id),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(TENANT_QUERY_KEYS.detail(updatedTenant.id), updatedTenant);
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.stats() });
      toast({
        title: 'Tenant activated',
        description: 'Tenant has been activated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to activate tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useCheckSubdomain() {
  return useMutation({
    mutationFn: (subdomain: string) => tenantsApi.checkSubdomain(subdomain),
  });
}
