"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const WORKSPACE_PREFIXES = ["/d", "/s", "/login"]

// Activa la paleta ámbar+glass de la web app poniendo la clase en <html>
// (no en un div interno): los overlays de Radix (Sheet, Popover, Dialog...)
// se portalean a document.body, fuera del árbol del layout, así que solo un
// scope en el elemento raíz les llega a ambos por igual. El portal público
// nunca activa esta clase y sigue leyendo los tokens de :root/.dark.
export function WorkspaceScope() {
  const pathname = usePathname()

  useEffect(() => {
    const isWorkspace = WORKSPACE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
    document.documentElement.classList.toggle("workspace", isWorkspace)
  }, [pathname])

  return null
}
