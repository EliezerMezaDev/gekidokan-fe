import type { ReactNode } from "react"
import { Barlow, Chakra_Petch } from "next/font/google"
import { SiteHeader } from "@/modules/public/components/SiteHeader"
import { SiteFooter } from "@/modules/public/components/SiteFooter"

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
      className={`portal ${barlow.variable} ${chakraPetch.variable} flex min-h-svh flex-col bg-background font-sans text-foreground`}
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
