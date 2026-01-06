'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useSiteConfigStore } from '../stores/siteConfigStore';
import { SiteConfig } from '../lib/api/config';

interface SiteConfigContextValue {
  config: SiteConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

interface SiteConfigProviderProps {
  children: ReactNode;
}

export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const { config, isLoading, error, fetchConfig, isHydrated } = useSiteConfigStore();

  useEffect(() => {
    if (isHydrated) {
      fetchConfig();
    }
  }, [isHydrated, fetchConfig]);

  const value: SiteConfigContextValue = {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
