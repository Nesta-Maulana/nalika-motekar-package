'use client';

import { useState, useEffect, useCallback } from 'react';
import { ComponentType } from 'react';

interface RemoteModuleConfig {
  url: string;
  scope: string;
  module: string;
}

interface UseRemoteModuleResult {
  Component: ComponentType | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

const moduleCache = new Map<string, ComponentType>();

async function loadRemoteModule(config: RemoteModuleConfig): Promise<ComponentType> {
  const cacheKey = `${config.url}/${config.scope}/${config.module}`;

  if (moduleCache.has(cacheKey)) {
    return moduleCache.get(cacheKey)!;
  }

  // Dynamic import for Module Federation
  // This is a simplified version - in production, you'd use @module-federation/nextjs-mf
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const container = await (window as any)[config.scope];
    if (!container) {
      throw new Error(`Container ${config.scope} not found`);
    }

    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(config.module);
    const Module = factory();
    const Component = Module.default || Module;

    moduleCache.set(cacheKey, Component);
    return Component;
  } catch (error) {
    throw new Error(
      `Failed to load remote module ${config.module} from ${config.scope}: ${error}`
    );
  }
}

export function useRemoteModule(config: RemoteModuleConfig | null): UseRemoteModuleResult {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadModule = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    setError(null);

    try {
      const LoadedComponent = await loadRemoteModule(config);
      setComponent(() => LoadedComponent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load module'));
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadModule();
  }, [loadModule, retryCount]);

  const retry = useCallback(() => {
    if (config) {
      const cacheKey = `${config.url}/${config.scope}/${config.module}`;
      moduleCache.delete(cacheKey);
    }
    setRetryCount((prev) => prev + 1);
  }, [config]);

  return {
    Component,
    isLoading,
    error,
    retry,
  };
}

// Preload a remote module
export async function preloadRemoteModule(config: RemoteModuleConfig): Promise<void> {
  try {
    await loadRemoteModule(config);
  } catch {
    // Silently fail - module will be loaded on demand
  }
}

// Clear module cache
export function clearModuleCache(): void {
  moduleCache.clear();
}

// Hook for loading multiple modules
export function useRemoteModules(
  configs: RemoteModuleConfig[]
): Map<string, UseRemoteModuleResult> {
  const [results, setResults] = useState<Map<string, UseRemoteModuleResult>>(
    new Map()
  );

  useEffect(() => {
    const loadAll = async () => {
      const newResults = new Map<string, UseRemoteModuleResult>();

      for (const config of configs) {
        const key = `${config.scope}/${config.module}`;
        try {
          const Component = await loadRemoteModule(config);
          newResults.set(key, {
            Component,
            isLoading: false,
            error: null,
            retry: () => {},
          });
        } catch (error) {
          newResults.set(key, {
            Component: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Failed to load'),
            retry: () => {},
          });
        }
      }

      setResults(newResults);
    };

    if (configs.length > 0) {
      loadAll();
    }
  }, [configs]);

  return results;
}

// Declare webpack globals for TypeScript
declare global {
  const __webpack_share_scopes__: {
    default: Record<string, unknown>;
  };
}
