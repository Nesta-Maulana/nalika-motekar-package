import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { storage } from '../lib/utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isHydrated: false,

      setAuth: (user, token, refreshToken) => {
        // Sync with storage utility for API client
        storage.setToken(token);
        storage.setRefreshToken(refreshToken);
        storage.setUser(user);
        set({ user, token, refreshToken });
      },

      clearAuth: () => {
        // Clear storage utility
        storage.clearAuth();
        set({ user: null, token: null, refreshToken: null });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export const getAuthState = () => useAuthStore.getState();
export const getToken = () => useAuthStore.getState().token;
export const getUser = () => useAuthStore.getState().user;
export const isAuthenticated = () => !!useAuthStore.getState().token;
