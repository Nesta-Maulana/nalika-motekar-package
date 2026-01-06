import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  expandedMenus: string[];
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMenu: (menuId: string) => void;
  setExpandedMenus: (menuIds: string[]) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isCollapsed: false,
      expandedMenus: [],

      toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setOpen: (open) => {
        set({ isOpen: open });
      },

      setCollapsed: (collapsed) => {
        set({ isCollapsed: collapsed });
      },

      toggleMenu: (menuId) => {
        const { expandedMenus } = get();
        if (expandedMenus.includes(menuId)) {
          set({ expandedMenus: expandedMenus.filter((id) => id !== menuId) });
        } else {
          set({ expandedMenus: [...expandedMenus, menuId] });
        }
      },

      setExpandedMenus: (menuIds) => {
        set({ expandedMenus: menuIds });
      },
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        expandedMenus: state.expandedMenus,
      }),
    }
  )
);
