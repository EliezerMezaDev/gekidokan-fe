import { create } from "zustand"
import type { SessionUser } from "@/shared/schemas/auth"

// Sesión y usuario actual. Sin lógica de negocio.

type SessionState = {
  user: SessionUser | null
  setUser: (user: SessionUser | null) => void
  clear: () => void
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}))
