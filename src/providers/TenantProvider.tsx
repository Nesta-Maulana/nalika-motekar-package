'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Tenant } from '../types';
import { useAuthStore } from '../stores';

interface TenantContextValue {
  tenant: Tenant | null;
  subdomain: string | null;
  isLoading: boolean;
  isCentralAdmin: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const tenant = user?.tenant || null;
  const isCentralAdmin = subdomain === 'admin' || subdomain === 'central';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // Handle localhost and IP addresses
      if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        setSubdomain(null);
      } else if (parts.length >= 3) {
        // subdomain.domain.tld
        setSubdomain(parts[0]);
      } else if (parts.length === 2 && parts[1] === 'local') {
        // subdomain.local
        setSubdomain(parts[0] === 'nalika-motekar' ? null : parts[0]);
      } else {
        setSubdomain(null);
      }

      setIsLoading(false);
    }
  }, []);

  const value: TenantContextValue = {
    tenant,
    subdomain,
    isLoading,
    isCentralAdmin,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
