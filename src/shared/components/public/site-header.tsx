"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { IconMenu2 } from "@tabler/icons-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shadcn/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shadcn/sheet"

// Header del portal público. Nav desktop + menú móvil (Sheet). CTA a /login.

const publicNav = [
  { href: "/", label: "Inicio" },
  { href: "/clases", label: "Clases" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
]

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Gekidokan — inicio">
          <Image
            src="/images/brand/logotipo.png"
            alt="Gekidokan"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-3xl px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/login">Ingresar</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="ml-auto md:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <IconMenu2 />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetTitle className="px-4 pt-4">Menú</SheetTitle>
            <nav className="flex flex-col gap-1 p-4">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-3xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive(pathname, item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Ingresar
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
