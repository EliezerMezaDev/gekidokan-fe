"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconBell, IconBellOff } from "@tabler/icons-react"
import { Button } from "@/shadcn/button"
import { Badge } from "@/shadcn/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/shadcn/dropdown-menu"
import { useUi } from "@/shared/store/ui"
import { EmptyState } from "@/shared/components/states"
import type { Notification } from "@/shared/schemas/notifications"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/shared/lib/notifications-mock"

// Campana in-app presente en ambos shells. Consume el mock en memoria de
// notifications-mock.ts; se sustituye por GET/PATCH /me/notifications cuando
// exista el backend (ver comentario ponytail en ese archivo).

const relativeTimeFormatter = new Intl.RelativeTimeFormat("es", {
  numeric: "auto",
})

// Formatea una fecha ISO como tiempo relativo ("hace 2 h", "hace 3 d").
function formatRelative(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffMin = Math.round(diffMs / 60000)
  if (Math.abs(diffMin) < 60) return relativeTimeFormatter.format(diffMin, "minute")
  const diffHour = Math.round(diffMin / 60)
  if (Math.abs(diffHour) < 24) return relativeTimeFormatter.format(diffHour, "hour")
  const diffDay = Math.round(diffHour / 24)
  return relativeTimeFormatter.format(diffDay, "day")
}

export function NotificationBell() {
  const unread = useUi((s) => s.unreadCount)
  const setUnreadCount = useUi((s) => s.setUnreadCount)
  const router = useRouter()
  const [items, setItems] = useState<Notification[]>([])

  // Sincroniza unreadCount con el mock al montar.
  useEffect(() => {
    const loaded = getNotifications()
    setItems(loaded)
    setUnreadCount(loaded.filter((n) => !n.read).length)
  }, [setUnreadCount])

  function handleSelect(n: Notification) {
    if (!n.read) {
      markAsRead(n.id)
      setItems(getNotifications())
      setUnreadCount(getNotifications().filter((n) => !n.read).length)
    }
    if (n.href) router.push(n.href)
  }

  function handleMarkAllAsRead() {
    markAllAsRead()
    setItems(getNotifications())
    setUnreadCount(0)
  }

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
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
          {unread > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="mr-1 h-auto py-1 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-2">
            <EmptyState
              icon={<IconBellOff className="size-6" />}
              title="Sin notificaciones"
              description="Aquí verás tus avisos."
            />
          </div>
        ) : (
          <div className="flex max-h-96 flex-col overflow-y-auto">
            {items.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-0.5 whitespace-normal py-2"
                onClick={() => handleSelect(n)}
              >
                <div className="flex w-full items-center gap-2">
                  {!n.read ? (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  ) : null}
                  <span className="flex-1 font-medium">{n.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.body}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatRelative(n.createdAt)}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
