"use client"

import { useRouter } from "next/navigation"
import { IconLogout, IconUser } from "@tabler/icons-react"
import { Avatar, AvatarFallback } from "@/shadcn/avatar"
import { Button } from "@/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shadcn/dropdown-menu"
import { useSession } from "@/shared/store/session"
import { logout } from "@/shared/lib/auth"

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?"
}

export function UserMenu() {
  const router = useRouter()
  const user = useSession((s) => s.user)

  function onLogout() {
    logout()
    router.replace("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Cuenta"
        >
          <Avatar className="size-8">
            <AvatarFallback>
              {user ? initials(user.name) : <IconUser className="size-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{user?.name ?? "Invitado"}</span>
          {user?.email ? (
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <IconLogout className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
