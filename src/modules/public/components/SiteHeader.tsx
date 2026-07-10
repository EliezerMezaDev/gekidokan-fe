"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { IconMenu2, IconMoon, IconSun } from "@tabler/icons-react"
import { cn } from "@/shared/lib/utils"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shadcn/sheet"

const publicNav = [
  { href: "/", label: "Inicio" },
  { href: "/clases", label: "Clases" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
]

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  // ponytail: next-themes no conoce el tema hasta montar en cliente; sin este
  // guard el icono parpadea (SSR no sabe si es claro u oscuro).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className={cn("inline-block size-9", className)} />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:text-primary-strong",
        className
      )}
    >
      {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  )
}

export function Wordmark() {
  return (
    <Link
      href="/"
      className="disp flex items-center gap-2 text-[26px] font-bold text-foreground"
      aria-label="Gekidokan — inicio"
    >
      <span className="h-10 w-10">
        <img
          src="/images/brand/isologo.png"
          alt="Gekidokan - Logo"
          className="h-full w-full rounded-full object-contain"
        />
      </span>
      GEKIDOKAN
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-background/75 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 px-8 py-[22px]">
        <Wordmark />

        <nav className="hidden items-center gap-[30px] text-[14.5px] font-medium md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary-strong",
                isActive(pathname, item.href)
                  ? "text-primary"
                  : "text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="/login"
            className="disp rounded-[7px] bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-strong"
          >
            Iniciar sesión
          </Link>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
            aria-label="Abrir menú"
          >
            <IconMenu2 />
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetTitle className="disp px-4 pt-4">Menú</SheetTitle>
            <nav className="flex flex-col gap-1 p-4 text-[15px] font-medium">
              {publicNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 transition-colors",
                    isActive(pathname, item.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary-strong"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="disp mt-2 rounded-[7px] bg-primary px-4 py-2.5 text-center text-[13px] font-semibold text-white"
              >
                Iniciar sesión
              </Link>
              <ThemeToggle className="mt-2 self-center" />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
