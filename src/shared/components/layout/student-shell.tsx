"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { AppHeader } from "./app-header"
import { studentNav } from "./nav-items"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"

// Shell del área de alumno (/s): mobile-first, header arriba y nav inferior.
export function StudentShell({ children }: { children: ReactNode }) {
  useHydrateSession()
  const pathname = usePathname()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col">
      <AppHeader title={<span className="text-primary">Gekidokan</span>} />
      <main className="flex-1 p-4 pb-24">{children}</main>
      <nav className="bg-background/90 fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md items-center justify-around border-t backdrop-blur">
        {studentNav.map((item) => {
          const active = pathname === item.href || (item.href !== "/s" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
