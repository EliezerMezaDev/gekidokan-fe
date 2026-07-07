import type { ReactNode } from "react"
import { SiteHeader } from "@/shared/components/public/site-header"
import { SiteFooter } from "@/shared/components/public/site-footer"

// Layout del portal público (SSG/SSR). Header + contenido + footer. Sin auth:
// el middleware solo protege /d y /s, no el portal.

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
