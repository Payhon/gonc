import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface AppState {
  themeMode: ThemeMode;
  sidebarCollapsed: boolean;
  currentTaskId?: string;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setCurrentTaskId: (taskId?: string) => void;
}

const defaultTheme = (() => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
})();

export const useAppStore = create<AppState>((set) => ({
  themeMode: defaultTheme,
  sidebarCollapsed: false,
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed
    })),
  setCurrentTaskId: (taskId) => set({ currentTaskId: taskId })
}));
