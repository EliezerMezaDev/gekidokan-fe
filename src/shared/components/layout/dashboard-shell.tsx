"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconMenu2 } from "@tabler/icons-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shadcn/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shadcn/sheet"
import { AppHeader } from "./app-header"
import { dashboardNav } from "./nav-items"
import { useUi } from "@/shared/store/ui"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 p-2">
      {dashboardNav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/d" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

// Shell del dashboard admin (/d): sidebar fijo en desktop, Sheet en móvil.
export function DashboardShell({ children }: { children: ReactNode }) {
  useHydrateSession()
  const sidebarOpen = useUi((s) => s.sidebarOpen)
  const setSidebar = useUi((s) => s.setSidebar)

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-14 items-center border-b px-4 text-lg font-bold">
          <span className="text-primary">Gekidokan</span>
        </div>
        <NavLinks />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          left={
            <Sheet open={sidebarOpen} onOpenChange={setSidebar}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Menú"
                >
                  <IconMenu2 className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-sidebar p-0 text-sidebar-foreground"
              >
                <SheetHeader>
                  <SheetTitle className="text-primary">Gekidokan</SheetTitle>
                </SheetHeader>
                <NavLinks onNavigate={() => setSidebar(false)} />
              </SheetContent>
            </Sheet>
          }
        />
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
