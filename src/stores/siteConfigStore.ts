import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { configApi, SiteConfig, SiteBranding, SiteTheme } from '../lib/api/config';

interface SiteConfigState {
  config: SiteConfig | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  fetchConfig: () => Promise<void>;
  setConfig: (config: SiteConfig) => void;
  setHydrated: (hydrated: boolean) => void;
  clearConfig: () => void;
}

const defaultBranding: SiteBranding = {
  name: 'Nalika Motekar',
  logo_url: '/images/logo.png',
  favicon_url: '/favicon.ico',
  tagline: 'Central Administration Portal',
  description: 'Manage tenants, plans, and system configuration',
};

const defaultCentralTheme: SiteTheme = {
  primary_color: '#3b82f6',
  secondary_color: '#1e40af',
  accent_color: '#60a5fa',
  sidebar_bg: '#1e293b',
};

const defaultTenantTheme: SiteTheme = {
  primary_color: '#22c55e',
  secondary_color: '#15803d',
  accent_color: '#4ade80',
  sidebar_bg: '#1e293b',
};

export const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set, get) => ({
      config: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      fetchConfig: async () => {
        set({ isLoading: true, error: null });
        try {
          const config = await configApi.getSiteConfig();
          set({ config, isLoading: false });
          applyThemeFromConfig(config.theme);
          applyFavicon(config.branding.favicon_url);
          applyPageTitle(config.branding.name);
        } catch (error) {
          console.error('Failed to fetch site config:', error);
          set({ error: 'Failed to load site configuration', isLoading: false });

          // Apply default config based on current domain
          const domainType = detectDomainType();
          const defaultConfig: SiteConfig = {
            domain_type: domainType,
            branding: defaultBranding,
            theme: domainType === 'central' ? defaultCentralTheme : defaultTenantTheme,
          };
          set({ config: defaultConfig });
          applyThemeFromConfig(defaultConfig.theme);
        }
      },

      setConfig: (config: SiteConfig) => {
        set({ config });
        applyThemeFromConfig(config.theme);
        applyFavicon(config.branding.favicon_url);
        applyPageTitle(config.branding.name);
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      clearConfig: () => {
        set({ config: null, error: null });
      },
    }),
    {
      name: 'site-config-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        if (state?.config) {
          applyThemeFromConfig(state.config.theme);
        }
      },
    }
  )
);

function detectDomainType(): 'central' | 'tenant' {
  if (typeof window === 'undefined') return 'central';

  const host = window.location.host;
  const parts = host.split('.');

  // Check if there's a subdomain (subdomain.domain.tld format)
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Reserved subdomains are central
    if (['www', 'api', 'admin'].includes(subdomain)) {
      return 'central';
    }
    return 'tenant';
  }

  return 'central';
}

function applyThemeFromConfig(theme: SiteTheme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Convert hex colors to HSL for Tailwind CSS variables
  const primaryHsl = hexToHsl(theme.primary_color);
  const secondaryHsl = hexToHsl(theme.secondary_color);
  const accentHsl = hexToHsl(theme.accent_color);

  // Apply primary colors (Tailwind expects HSL values without hsl() wrapper)
  root.style.setProperty('--primary', primaryHsl);
  root.style.setProperty('--primary-foreground', '210 40% 98%'); // Light text for colored background

  // Apply accent colors
  root.style.setProperty('--accent', accentHsl);

  // Apply ring color (for focus states)
  root.style.setProperty('--ring', primaryHsl);

  // Also set custom properties for additional use
  root.style.setProperty('--color-primary-hex', theme.primary_color);
  root.style.setProperty('--color-secondary-hex', theme.secondary_color);
  root.style.setProperty('--color-accent-hex', theme.accent_color);
  root.style.setProperty('--color-sidebar-bg', theme.sidebar_bg);
}

function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Return HSL values in Tailwind format: "h s% l%"
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function adjustColor(hex: string, amount: number): string {
  // Simple color adjustment - darken or lighten
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function applyFavicon(faviconUrl: string) {
  if (typeof window === 'undefined') return;

  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
}

function applyPageTitle(name: string) {
  if (typeof window === 'undefined') return;
  document.title = name;
}

// Helper hooks
export const getSiteConfig = () => useSiteConfigStore.getState().config;
export const getDomainType = () => useSiteConfigStore.getState().config?.domain_type ?? detectDomainType();
export const getBranding = () => useSiteConfigStore.getState().config?.branding ?? defaultBranding;
export const getSiteTheme = () => useSiteConfigStore.getState().config?.theme ?? defaultCentralTheme;
