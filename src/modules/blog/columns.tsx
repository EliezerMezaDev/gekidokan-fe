import { IconArticle, IconEye, IconPencil, IconTrash } from "@tabler/icons-react"
import type { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { BlogPostAdmin } from "@/shared/schemas/public"
import {
  SortableHeader,
  selectionColumn,
  type ColumnDef,
  type RowAction,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { dateFmt } from "./labels"

// Columnas de la tabla de posts del blog (dedicada). La maqueta genérica la
// aporta DataTable; aquí solo se declara cómo se ve cada campo del post.

export const blogColumns: ColumnDef<BlogPostAdmin>[] = [
  selectionColumn<BlogPostAdmin>(),
  {
    id: "post",
    accessorFn: (p) => p.title,
    header: ({ column }) => (
      <SortableHeader column={column}>Publicación</SortableHeader>
    ),
    cell: ({ row }) => {
      const p = row.original
      return (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <IconArticle className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-medium">{p.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {p.excerpt}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
  },
  {
    id: "tags",
    accessorFn: (p) => p.tags.join(", "),
    header: "Etiquetas",
    cell: ({ row }) =>
      row.original.tags.length === 0 ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((t) => (
            <Badge key={t} variant="outline" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      ),
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Fecha</SortableHeader>
    ),
    cell: ({ row }) => dateFmt.format(new Date(row.original.publishedAt)),
  },
  {
    accessorKey: "isPublic",
    header: "Estado",
    cell: ({ row }) =>
      row.original.isPublic ? (
        <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
          Público
        </Badge>
      ) : (
        <Badge variant="secondary">Privado</Badge>
      ),
  },
]

export const blogRowActions = (
  router: ReturnType<typeof useRouter>
): RowAction<BlogPostAdmin>[] => [
  {
    label: "Ver",
    icon: IconEye,
    onSelect: (p) => router.push(`/d/blog/${p.slug}`),
  },
  {
    label: "Editar",
    icon: IconPencil,
    onSelect: (p) => router.push(`/d/blog/${p.slug}/edit`),
  },
  {
    // ponytail: eliminar es placeholder (fuera de alcance); avisa sin mutar.
    label: "Eliminar",
    icon: IconTrash,
    onSelect: () => toast.info("Eliminar publicación aún no está disponible."),
    destructive: true,
    separatorBefore: true,
  },
]
