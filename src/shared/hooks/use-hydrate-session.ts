"use client"

import { useEffect } from "react"
import { useSession } from "@/shared/store/session"
import { getAccessToken } from "@/shared/lib/tokens"
import { userFromToken } from "@/shared/lib/jwt"

// Rehidrata la sesión desde el token en cookie tras un refresh de página, para
// que el header (avatar, nombre) no quede vacío. La sesión ya validada por
// login() no se toca.

export function useHydrateSession() {
  const user = useSession((s) => s.user)
  const setUser = useSession((s) => s.setUser)

  useEffect(() => {
    if (user) return
    const token = getAccessToken()
    if (!token) return
    const decoded = userFromToken(token)
    if (decoded) setUser(decoded)
  }, [user, setUser])
}
