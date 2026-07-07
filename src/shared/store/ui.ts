import { create } from "zustand"

// Estado de UI global: sidebar móvil y conteo de notificaciones no leídas
// (lo consume la campana de ambos shells). Sin lógica de negocio.

type UiState = {
  sidebarOpen: boolean
  setSidebar: (open: boolean) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
}

export const useUi = create<UiState>((set) => ({
  sidebarOpen: false,
  setSidebar: (sidebarOpen) => set({ sidebarOpen }),
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
}))
