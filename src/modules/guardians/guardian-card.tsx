"use client"

import { Fragment } from "react"
import { IconUser, IconDotsVertical } from "@tabler/icons-react"
import type { Guardian } from "@/shared/schemas/guardians"
import type { RowAction } from "@/shared/components/data-table"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu"
import { dateFmt } from "./date-fmt"

// Tarjeta de representante para la vista de grilla (dedicada). Mismos datos
// que una fila de la tabla, con el mismo menú de acciones (⋯) para mantener
// paridad.

export function GuardianCard({
  guardian: g,
  actions,
}: {
  guardian: Guardian
  actions: RowAction<Guardian>[]
}) {
  return (
    <Card size="sm" className="gap-3 rounded-xl">
      <div className="flex items-start gap-3 px-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <IconUser className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {g.firstName} {g.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {g.email ?? "—"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-1 size-8 text-muted-foreground"
              aria-label="Acciones"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {actions.map((a, i) => (
              <Fragment key={a.label}>
                {a.separatorBefore && i > 0 ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem
                  variant={a.destructive ? "destructive" : "default"}
                  onClick={() => a.onSelect(g)}
                >
                  {a.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-4 text-sm text-muted-foreground">
        <span className="truncate">{g.nationalId ?? "—"}</span>
      </div>

      <div className="flex items-center justify-between border-t px-4 pt-3 text-xs text-muted-foreground">
        <span className="truncate">{g.phone ?? g.email ?? "—"}</span>
        <span className="shrink-0">{dateFmt.format(new Date(g.createdAt))}</span>
      </div>
    </Card>
  )
}
