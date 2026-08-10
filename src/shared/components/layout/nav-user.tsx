"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  IconDotsVertical,
  IconLogout,
  IconUser,
  IconUserCircle,
  IconBell,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/shadcn/avatar"
import { Badge } from "@/shadcn/badge"
import { Switch } from "@/shadcn/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shadcn/sidebar"
import { useSession } from "@/shared/store/session"
import { useUi } from "@/shared/store/ui"
import { logout } from "@/shared/lib/auth"

// Fila de usuario al fondo de la sidebar (estilo bloque dashboard-01): abre el
// dropdown con Notificaciones, Cuenta y Cerrar sesión.

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?"
}

export function NavUser() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const user = useSession((s) => s.user)
  const unread = useUi((s) => s.unreadCount)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  function onLogout() {
    logout()
    router.replace("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user ? initials(user.name) : <IconUser className="size-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name ?? "Invitado"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate">{user?.name ?? "Invitado"}</span>
              {user?.email ? (
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* ponytail: item placeholder; cablear a GET /me/notifications cuando exista */}
            <DropdownMenuItem>
              <IconBell className="size-4" />
              Notificaciones
              {unread > 0 ? (
                <Badge className="ml-auto h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                  {unread > 9 ? "9+" : unread}
                </Badge>
              ) : null}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/d/profile")}>
              <IconUserCircle className="size-4" />
              Cuenta
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              {isDark ? (
                <IconMoon className="size-4" />
              ) : (
                <IconSun className="size-4" />
              )}
              Tema oscuro
              <Switch
                checked={isDark}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                className="ml-auto"
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <IconLogout className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
