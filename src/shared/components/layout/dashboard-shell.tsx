"use client"

import type { ReactNode } from "react"
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
// (footer). Sin header sticky; los breadcrumbs viven en la barra superior del
// inset y son siempre visibles.

function DashboardSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2 text-lg font-bold">
          <span className="text-primary">Gekidokan</span>
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
      <SidebarInset>
        <div className="flex items-center gap-2 px-4 py-3 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <DashboardBreadcrumbs />
        </div>
        <main className="min-w-0 flex-1 px-4 pb-6 md:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
