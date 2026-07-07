import type { ReactNode } from "react"
import { NotificationBell } from "./notification-bell"
import { UserMenu } from "./user-menu"

// Header común a ambos shells: slot izquierdo (menú móvil / título), campana y
// menú de usuario con avatar.

export function AppHeader({ left, title }: { left?: ReactNode; title?: ReactNode }) {
  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
      {left}
      <div className="flex-1 truncate font-semibold">{title}</div>
      <NotificationBell />
      <UserMenu />
    </header>
  )
}
