"use client"

import { IconBell, IconBellOff } from "@tabler/icons-react"
import { Button } from "@/shadcn/button"
import { Badge } from "@/shadcn/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shadcn/dropdown-menu"
import { useUi } from "@/shared/store/ui"
import { EmptyState } from "@/shared/components/states"

// Campana in-app presente en ambos shells. En Etapa 0 va vacía; cada etapa la
// llena consumiendo GET /me/notifications y actualizando useUi.unreadCount.

export function NotificationBell() {
  const unread = useUi((s) => s.unreadCount)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificaciones"
        >
          <IconBell className="size-5" />
          {unread > 0 ? (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
              {unread > 9 ? "9+" : unread}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <EmptyState
            icon={<IconBellOff className="size-6" />}
            title="Sin notificaciones"
            description="Aquí verás tus avisos."
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
