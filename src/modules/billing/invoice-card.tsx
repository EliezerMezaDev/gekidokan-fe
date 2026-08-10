"use client"

import { Fragment } from "react"
import { IconFileInvoice, IconDotsVertical } from "@tabler/icons-react"
import type { MonthlyInvoice } from "@/shared/schemas/billing"
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
import { usdFmt, localFmt } from "./money"
import { InvoiceStatusBadge } from "./columns"

// Tarjeta de factura para la vista de grilla (dedicada). Mismos datos que una
// fila de la tabla, con el mismo menú de acciones (⋯) para mantener paridad.

export function InvoiceCard({
  invoice: i,
  actions,
}: {
  invoice: MonthlyInvoice
  actions: RowAction<MonthlyInvoice>[]
}) {
  return (
    <Card size="sm" className="gap-3 rounded-xl">
      <div className="flex items-start gap-3 px-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <IconFileInvoice className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{i.studentName}</p>
          <p className="truncate text-xs text-muted-foreground">{i.period}</p>
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
            {actions.map((a, idx) => (
              <Fragment key={a.label}>
                {a.separatorBefore && idx > 0 ? (
                  <DropdownMenuSeparator />
                ) : null}
                <DropdownMenuItem
                  variant={a.destructive ? "destructive" : "default"}
                  onClick={() => a.onSelect(i)}
                >
                  {a.icon ? <a.icon className="size-4" /> : null}
                  {a.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-4">
        <span className="text-sm font-medium">
          {usdFmt.format(i.amountUsd)}
        </span>
        <InvoiceStatusBadge status={i.status} />
      </div>

      <div className="flex items-center justify-between border-t px-4 pt-3 text-xs text-muted-foreground">
        <span className="truncate">{localFmt.format(i.localAmount)}</span>
        <span className="shrink-0">Vence {i.dueDate}</span>
      </div>
    </Card>
  )
}
