import {
  IconBook2,
  IconVideo,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { SyllabusItem } from "@/shared/schemas/content"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { beltLabel, beltDot } from "@/modules/students/belt"
import { syllabusTypeLabel, contentStyleLabel } from "./content-labels"

// Columnas de la tabla de contenido (dedicadas). La maqueta genérica la aporta
// DataTable; aquí solo se declara cómo se ve cada campo del syllabus.

export const contentColumns: ColumnDef<SyllabusItem>[] = [
  selectionColumn<SyllabusItem>(),
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableHeader column={column}>Título</SortableHeader>
    ),
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconBook2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">{c.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {syllabusTypeLabel[c.type]}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "minBeltRank",
    header: "Cinta mínima",
    cell: ({ row }) => {
      const belt = row.original.minBeltRank
      return (
        <Badge variant="secondary" className="gap-1.5">
          <span className={`size-2.5 rounded-full ${beltDot[belt]}`} />
          {beltLabel[belt]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "style",
    header: "Estilo",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {contentStyleLabel[row.original.style]}
      </span>
    ),
  },
  {
    id: "video",
    header: "Video",
    cell: ({ row }) =>
      row.original.videoUrl ? (
        <IconVideo className="size-4 text-muted-foreground" />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
]

export const contentRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<SyllabusItem>[] => [
  {
    label: "Ver",
    icon: IconEye,
    onSelect: (c) => router.push(`/d/content/${c.slug}`),
  },
  {
    label: "Editar",
    icon: IconPencil,
    onSelect: (c) => router.push(`/d/content/${c.slug}/edit`),
  },
  {
    // ponytail: eliminar es placeholder (fuera de alcance); avisa sin mutar.
    label: "Eliminar",
    icon: IconTrash,
    onSelect: () => toast.info("Eliminar contenido aún no está disponible."),
    destructive: true,
    separatorBefore: true,
  },
]
