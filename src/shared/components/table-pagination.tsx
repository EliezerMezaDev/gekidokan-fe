import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { Button } from "@/shadcn/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"

// Footer de paginación reusable (extraído de DataTable). Presentacional puro:
// recibe el estado y devuelve callbacks, sin depender de TanStack Table, para
// poder usarlo también sobre listas paginadas a mano (p.ej. la vista grilla).
export function TablePagination({
  pageIndex,
  pageSize,
  total,
  selectedCount = 0,
  pageSizeOptions = [10, 20, 30, 50],
  onPageChange,
  onPageSizeChange,
}: {
  pageIndex: number
  pageSize: number
  total: number
  selectedCount?: number
  pageSizeOptions?: number[]
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-1">
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0
          ? `${selectedCount} de ${total} fila(s) seleccionadas.`
          : `${total} resultado(s).`}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filas</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={`${n}`}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">
          Página {pageIndex + 1} de {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
            aria-label="Primera página"
          >
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
            aria-label="Anterior"
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
            aria-label="Siguiente"
          >
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={!canNextPage}
            aria-label="Última página"
          >
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
