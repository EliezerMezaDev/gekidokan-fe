import { IconFileInvoice, IconEye, IconReceipt2 } from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { MonthlyInvoice } from "@/shared/schemas/billing"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { usdFmt, localFmt } from "./money"
import { invoiceStatusLabel, invoiceStatusBadgeClass } from "./invoice-status"

// Columnas de la tabla de facturas (dedicadas). La maqueta genérica
// (selección, orden, acciones, paginación) la aporta DataTable.

export function InvoiceStatusBadge({
  status,
}: {
  status: MonthlyInvoice["status"]
}) {
  return (
    <Badge
      variant={
        status === "PENDING" || status === "VOIDED" ? "secondary" : undefined
      }
      className={invoiceStatusBadgeClass[status] || undefined}
    >
      {invoiceStatusLabel[status]}
    </Badge>
  )
}

export const invoiceColumns: ColumnDef<MonthlyInvoice>[] = [
  selectionColumn<MonthlyInvoice>(),
  {
    id: "factura",
    accessorFn: (i) => `${i.studentName} ${i.period}`,
    header: ({ column }) => (
      <SortableHeader column={column}>Alumno / período</SortableHeader>
    ),
    cell: ({ row }) => {
      const i = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconFileInvoice className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">{i.studentName}</p>
            <p className="truncate text-xs text-muted-foreground">{i.period}</p>
          </div>
        </div>
      )
    },
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
    accessorKey: "localAmount",
    header: "Monto local",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {localFmt.format(row.original.localAmount)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <SortableHeader column={column}>Vence</SortableHeader>
    ),
    cell: ({ row }) => row.original.dueDate,
  },
]

export const invoiceRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<MonthlyInvoice>[] => [
  {
    label: "Ver",
    icon: IconEye,
    onSelect: (i) => router.push(`/d/billing/invoices/${i.slug}`),
  },
  {
    // ponytail: la conciliación real vive en el detalle (lista de pagos); aquí
    // solo se navega a ella.
    label: "Conciliar",
    icon: IconReceipt2,
    onSelect: (i) => router.push(`/d/billing/invoices/${i.slug}`),
  },
]
