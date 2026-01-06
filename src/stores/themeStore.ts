import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange';

interface ThemeState {
  mode: ThemeMode;
  color: ThemeColor;
  isHydrated: boolean;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  setHydrated: (hydrated: boolean) => void;
  setCentralTheme: () => void;
  setTenantTheme: () => void;
}

// Color configurations
export const themeColors = {
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryForeground: '#ffffff',
    accent: '#dbeafe',
    accentForeground: '#1e40af',
  },
  green: {
    primary: '#22c55e',
    primaryHover: '#16a34a',
    primaryForeground: '#ffffff',
    accent: '#dcfce7',
    accentForeground: '#166534',
  },
  purple: {
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryForeground: '#ffffff',
    accent: '#f3e8ff',
    accentForeground: '#7c3aed',
  },
  orange: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryForeground: '#ffffff',
    accent: '#fed7aa',
    accentForeground: '#c2410c',
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      color: 'blue', // Default: Blue for Central
      isHydrated: false,

      setMode: (mode) => {
        set({ mode });
        applyThemeMode(mode);
      },

      setColor: (color) => {
        set({ color });
        applyThemeColor(color);
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },

      // Central uses blue theme
      setCentralTheme: () => {
        set({ color: 'blue' });
        applyThemeColor('blue');
      },

      // Tenant uses green theme
      setTenantTheme: () => {
        set({ color: 'green' });
        applyThemeColor('green');
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        color: state.color,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        if (state) {
          applyThemeMode(state.mode);
          applyThemeColor(state.color);
        }
      },
    }
  )
);

function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function applyThemeColor(color: ThemeColor) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = themeColors[color];

  // Apply CSS variables
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-primary-foreground', colors.primaryForeground);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-foreground', colors.accentForeground);

  // Update data attribute for Tailwind
  root.setAttribute('data-theme-color', color);
}

export const getThemeState = () => useThemeStore.getState();
export const getThemeMode = () => useThemeStore.getState().mode;
export const getThemeColor = () => useThemeStore.getState().color;
