'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { TenantProvider } from './TenantProvider';
import { ToastProvider } from './ToastProvider';
import { SiteConfigProvider } from './SiteConfigProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <SiteConfigProvider>
        <TenantProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </TenantProvider>
      </SiteConfigProvider>
    </QueryProvider>
  );
}

export { QueryProvider } from './QueryProvider';
export { AuthProvider, useAuth } from './AuthProvider';
export { TenantProvider, useTenant } from './TenantProvider';
export { ToastProvider } from './ToastProvider';
export { SiteConfigProvider, useSiteConfig } from './SiteConfigProvider';
