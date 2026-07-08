import type { ReactNode } from "react"
import { Barlow, Chakra_Petch } from "next/font/google"
import { SiteHeader } from "@/shared/components/public/site-header"
import { SiteFooter } from "@/shared/components/public/site-footer"

// Layout del portal público (SSG/SSR). Header + contenido + footer. Sin auth:
// el middleware solo protege /d y /s, no el portal.
//
// Tipografía del diseño (Chakra Petch display + Barlow) cargada y scoping SOLO
// aquí: se redefinen --font-heading y --font-sans en el contenedor, así el
// dashboard /d, el área /s y /login conservan Noto Sans + Inter del root layout.

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
})

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${barlow.variable} ${chakraPetch.variable} flex min-h-svh flex-col bg-[#f7f1f1] font-sans text-[#1c1717]`}
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
