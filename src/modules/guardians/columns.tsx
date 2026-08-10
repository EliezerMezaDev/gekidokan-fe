import { IconUser, IconEye, IconPencil, IconTrash } from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Guardian } from "@/shared/schemas/guardians"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { dateFmt } from "./date-fmt"

// Columnas de la tabla de representantes (dedicadas). La maqueta genérica
// (selección, orden, acciones, paginación) la aporta DataTable; aquí solo se
// declara cómo se ve cada campo del representante.

export const guardianColumns: ColumnDef<Guardian>[] = [
  selectionColumn<Guardian>(),
  {
    id: "representante",
    accessorFn: (g) => `${g.firstName} ${g.lastName}`,
    header: ({ column }) => (
      <SortableHeader column={column}>Representante</SortableHeader>
    ),
    cell: ({ row }) => {
      const g = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconUser className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">
              {g.firstName} {g.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {g.email ?? "—"}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: "contacto",
    accessorFn: (g) => g.phone ?? g.email ?? "",
    header: "Contacto",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.phone ?? row.original.email ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "nationalId",
    header: "Cédula",
    cell: ({ row }) => row.original.nationalId ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Creado</SortableHeader>
    ),
    cell: ({ row }) => dateFmt.format(new Date(row.original.createdAt)),
  },
]

export const guardianRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<Guardian>[] => [
  {
    label: "Ver",
    icon: IconEye,
    onSelect: (g) => router.push(`/d/guardians/${g.slug}`),
  },
  {
    label: "Editar",
    icon: IconPencil,
    onSelect: (g) => router.push(`/d/guardians/${g.slug}/edit`),
  },
  {
    // ponytail: eliminar es placeholder (fuera de alcance); avisa sin mutar.
    label: "Eliminar",
    icon: IconTrash,
    onSelect: () =>
      toast.info("Eliminar representante aún no está disponible."),
    destructive: true,
    separatorBefore: true,
  },
]
