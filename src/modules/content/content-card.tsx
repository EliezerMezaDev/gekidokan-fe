"use client"

import { Fragment } from "react"
import { IconBook2, IconDotsVertical, IconVideo } from "@tabler/icons-react"
import type { SyllabusItem } from "@/shared/schemas/content"
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
import { beltLabel, beltDot } from "@/modules/students/belt"
import { syllabusTypeLabel, contentStyleLabel } from "./content-labels"

// Tarjeta de contenido para la vista de grilla (dedicada). Mismos datos que
// una fila de la tabla, con el mismo menú de acciones (⋯).

export function ContentCard({
  item: c,
  actions,
}: {
  item: SyllabusItem
  actions: RowAction<SyllabusItem>[]
}) {
  return (
    <Card size="sm" className="gap-3 rounded-xl">
      <div className="flex items-start gap-3 px-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <IconBook2 className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{c.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {syllabusTypeLabel[c.type]}
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
                  onClick={() => a.onSelect(c)}
                >
                  {a.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-4">
        <Badge variant="secondary" className="gap-1.5">
          <span className={`size-2.5 rounded-full ${beltDot[c.minBeltRank]}`} />
          {beltLabel[c.minBeltRank]}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {contentStyleLabel[c.style]}
        </span>
      </div>

      <div className="flex items-center justify-between border-t px-4 pt-3 text-xs text-muted-foreground">
        <span>Video</span>
        {c.videoUrl ? (
          <IconVideo className="size-4" />
        ) : (
          <span>—</span>
        )}
      </div>
    </Card>
  )
}
