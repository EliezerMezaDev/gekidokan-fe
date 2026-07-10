import type { useRouter } from "next/navigation"
import type { TuitionScheme } from "@/shared/schemas/billing"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { usdFmt } from "./money"
import { tuitionStatusLabel } from "./invoice-status"

// Columnas de la tabla de esquemas de mensualidad (dedicadas). La maqueta
// genérica (selección, orden, acciones) la aporta DataTable.

export const schemeColumns: ColumnDef<TuitionScheme>[] = [
  selectionColumn<TuitionScheme>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Nombre</SortableHeader>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "amountUsd",
    header: ({ column }) => (
      <SortableHeader column={column}>Monto USD</SortableHeader>
    ),
    cell: ({ row }) => usdFmt.format(row.original.amountUsd),
  },
  {
    accessorKey: "cutoffDay",
    header: "Día de corte",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.cutoffDay}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "APPROVED" ? undefined : "secondary"}>
        {tuitionStatusLabel[row.original.status]}
      </Badge>
    ),
  },
]

export const schemeRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<TuitionScheme>[] => [
  {
    label: "Editar",
    onSelect: (s) => router.push(`/d/billing/schemes/${s.slug}/edit`),
  },
]
