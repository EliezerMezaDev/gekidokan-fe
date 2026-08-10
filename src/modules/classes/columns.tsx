import {
  IconKarate,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { KarateClass } from "@/shared/schemas/classes"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { styleLabel, formatSchedule } from "./class-labels"

// Columnas de la tabla de clases (dedicadas). La maqueta genérica (selección,
// orden, acciones, paginación) la aporta DataTable; aquí solo se declara cómo
// se ve cada campo de la clase.

export const classColumns: ColumnDef<KarateClass>[] = [
  selectionColumn<KarateClass>(),
  {
    id: "clase",
    accessorFn: (c) => c.name,
    header: ({ column }) => (
      <SortableHeader column={column}>Clase</SortableHeader>
    ),
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconKarate className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">{c.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {styleLabel[c.style]}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "instructorName",
    header: "Instructor",
  },
  {
    id: "horario",
    accessorFn: (c) => formatSchedule(c.schedules),
    header: "Horario",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatSchedule(row.original.schedules)}
      </span>
    ),
  },
  {
    id: "inscritos",
    accessorFn: (c) => c.enrolledStudentIds.length,
    header: ({ column }) => (
      <SortableHeader column={column}>Inscritos</SortableHeader>
    ),
    cell: ({ row }) => {
      const c = row.original
      return (
        <Badge variant="secondary">
          {c.enrolledStudentIds.length}
          {c.capacity ? ` / ${c.capacity}` : ""}
        </Badge>
      )
    },
  },
]

export const classRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<KarateClass>[] => [
  {
    label: "Ver",
    icon: IconEye,
    onSelect: (c) => router.push(`/d/classes/${c.slug}`),
  },
  {
    label: "Editar",
    icon: IconPencil,
    onSelect: (c) => router.push(`/d/classes/${c.slug}/edit`),
  },
  {
    // ponytail: eliminar es placeholder (fuera de alcance); avisa sin mutar.
    label: "Eliminar",
    icon: IconTrash,
    onSelect: () => toast.info("Eliminar clase aún no está disponible."),
    destructive: true,
    separatorBefore: true,
  },
]
