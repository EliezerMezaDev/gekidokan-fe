"use client"

import { Fragment } from "react"
import { IconUser, IconDotsVertical } from "@tabler/icons-react"
import type { Student } from "@/shared/schemas/students"
import type { RowAction } from "@/shared/components/data-table"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu"
import { relationshipLabel } from "@/modules/guardians/relationship"
import { beltLabel, beltDot, dateFmt } from "./belt"

// Texto de contacto: representante (+ relación si existe) o el email de fallback.
function contactLine(s: Student): string {
  if (!s.guardianName) return s.email ?? "—"
  const rel = s.guardianRelationship
    ? ` (${relationshipLabel[s.guardianRelationship]})`
    : ""
  return `Rep.${rel}: ${s.guardianName}`
}

// Tarjeta de alumno para la vista de grilla (dedicada). Mismos datos que una
// fila de la tabla, con el mismo menú de acciones (⋯) para mantener paridad.

export function StudentCard({
  student: s,
  actions,
}: {
  student: Student
  actions: RowAction<Student>[]
}) {
  return (
    <Card size="sm" className="gap-3 rounded-xl">
      <div className="flex items-start gap-3 px-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <IconUser className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {s.firstName} {s.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {contactLine(s)}
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
                  onClick={() => a.onSelect(s)}
                >
                  {a.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-4">
        <span className="flex items-center gap-2 text-sm">
          <span className={`size-2.5 rounded-full ${beltDot[s.belt]}`} />
          {beltLabel[s.belt]}
        </span>
        {s.status === "ACTIVE" ? (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary">Inactivo</Badge>
        )}
      </div>

      <div className="flex items-center justify-between border-t px-4 pt-3 text-xs text-muted-foreground">
        <span className="truncate">{s.phone ?? s.email ?? "—"}</span>
        <span className="shrink-0">
          {dateFmt.format(new Date(s.enrolledAt))}
        </span>
      </div>
    </Card>
  )
}
