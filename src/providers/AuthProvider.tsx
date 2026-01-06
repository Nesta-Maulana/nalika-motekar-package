'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../lib/api';
import { initializeEcho, disconnectEcho, updateEchoAuth } from '../lib/reverb';
import { getDomainInfo } from '../hooks/useDomainDetect';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isHydrated, clearAuth, setAuth } = useAuthStore();

  const isAuthenticated = !!token && !!user;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Validate token and fetch user on mount
  useEffect(() => {
    if (!isHydrated) return;

    const validateAuth = async () => {
      if (!token) return;

      try {
        const { isCentral } = getDomainInfo();
        const userData = isCentral
          ? await authApi.centralMe()
          : await authApi.me();
        if (userData) {
          setAuth(userData, token, useAuthStore.getState().refreshToken || '');
        }
      } catch {
        clearAuth();
        if (!isPublicPath) {
          router.push('/login');
        }
      }
    };

    validateAuth();
  }, [isHydrated, token]);

  // Handle authentication redirects
  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, pathname, router, isPublicPath]);

  // Initialize Echo for real-time notifications
  useEffect(() => {
    if (isAuthenticated && token) {
      initializeEcho();
      updateEchoAuth(token);
    } else {
      disconnectEcho();
    }

    return () => {
      disconnectEcho();
    };
  }, [isAuthenticated, token]);

  const logout = async () => {
    try {
      const { isCentral } = getDomainInfo();
      if (isCentral) {
        await authApi.centralLogout();
      } else {
        await authApi.logout();
      }
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      disconnectEcho();
      router.push('/login');
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading: !isHydrated,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
