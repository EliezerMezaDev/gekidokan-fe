import { IconUser } from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Student } from "@/shared/schemas/students"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { beltLabel, beltDot, dateFmt } from "./belt"

// Columnas de la tabla de alumnos (dedicadas). La maqueta genérica (selección,
// orden, acciones, paginación) la aporta DataTable; aquí solo se declara cómo
// se ve cada campo del alumno.

export const studentColumns: ColumnDef<Student>[] = [
  selectionColumn<Student>(),
  {
    id: "alumno",
    accessorFn: (s) => `${s.firstName} ${s.lastName}`,
    header: ({ column }) => (
      <SortableHeader column={column}>Alumno</SortableHeader>
    ),
    cell: ({ row }) => {
      const s = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconUser className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">
              {s.firstName} {s.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {s.guardianName ? `Rep.: ${s.guardianName}` : (s.email ?? "—")}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "belt",
    header: "Cinta",
    cell: ({ row }) => {
      const belt = row.original.belt
      return (
        <span className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${beltDot[belt]}`} />
          {beltLabel[belt]}
        </span>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Contacto",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.phone ?? row.original.email ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "enrolledAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Inscripción</SortableHeader>
    ),
    cell: ({ row }) => dateFmt.format(new Date(row.original.enrolledAt)),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) =>
      row.original.status === "ACTIVE" ? (
        <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
          Activo
        </Badge>
      ) : (
        <Badge variant="secondary">Inactivo</Badge>
      ),
  },
]

export const studentRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<Student>[] => [
  { label: "Ver", onSelect: (s) => router.push(`/d/students/${s.slug}`) },
  {
    label: "Editar",
    onSelect: (s) => router.push(`/d/students/${s.slug}/edit`),
  },
  {
    // ponytail: eliminar es placeholder (fuera de alcance); avisa sin mutar.
    label: "Eliminar",
    onSelect: () => toast.info("Eliminar alumno aún no está disponible."),
    destructive: true,
    separatorBefore: true,
  },
]
