"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcn/sidebar"
import { Separator } from "@/shadcn/separator"
import { dashboardNav } from "./nav-items"
import { NavUser } from "./nav-user"
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"

// Shell del dashboard admin (/d): sidebar shadcn con nav arriba y usuario abajo
// (footer). Header de breadcrumbs sticky y siempre visible; el scroll queda
// acotado al <main> (SidebarInset fija su altura a h-svh).

function DashboardSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2">
          {/* ponytail: collapsible="offcanvas" no tiene estado icon-only,
              así que no hace falta isologo.png para un estado colapsado */}
          <Image
            src="/images/brand/logotipo.png"
            alt="Gekidokan"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {dashboardNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/d" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  useHydrateSession()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 py-3 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <DashboardBreadcrumbs />
        </div>
        <main className="relative isolate min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <Image
              src="/images/assets/patter-light.svg"
              alt=""
              fill
              className="object-cover opacity-40 dark:hidden"
            />
            <Image
              src="/images/assets/pattern-dark.svg"
              alt=""
              fill
              className="hidden object-cover opacity-40 dark:block"
            />
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
