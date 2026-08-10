"use client"

import type { ReactNode } from "react"
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column as TColumn,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconDotsVertical,
  IconDownload,
  IconLayoutColumns,
  IconLoader2,
  IconSelector,
  IconSearch,
} from "@tabler/icons-react"

import { cn } from "@/shared/lib/utils"
import { csvCell } from "@/shared/lib/csv"
import { Button } from "@/shadcn/button"
import { Checkbox } from "@/shadcn/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/shadcn/context-menu"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu"
import { Input } from "@/shadcn/input"
import { TablePagination } from "./table-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/table"
import { TableSkeleton, EmptyState, ErrorState } from "./states"
import { ExportDialog } from "./export-dialog"
import { useLocalStorageState } from "@/shared/hooks/use-local-storage-state"

// Forma general de los módulos basados en tabla del dashboard (ver referencia
// apex-dashboard). Cada módulo declara sus `columns` (ColumnDef de TanStack) y
// pasa los datos ya cargados; este componente aporta selección, orden,
// visibilidad de columnas, búsqueda, exportación CSV, acciones por fila (menú
// ⋯ + clic derecho), paginación y los estados loading/error/empty de forma
// uniforme. Ningún módulo reimplementa esa maqueta.

// Cabecera de columna ordenable con flecha. Úsala en el `header` de un ColumnDef.
export function SortableHeader<T>({
  column,
  children,
  className,
}: {
  column: TColumn<T, unknown>
  children: ReactNode
  className?: string
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2 h-8 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <IconSelector className="size-3.5 text-muted-foreground" />
    </Button>
  )
}

// Columna de selección lista para anteponer a tus columnas cuando quieras
// checkboxes por fila (como en la referencia).
export function selectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// Acción de fila; se renderiza igual en el menú ⋯ y en el clic derecho.
export type RowAction<T> = {
  label: string
  onSelect: (row: T) => void
  icon?: React.ComponentType<{ className?: string }>
  destructive?: boolean
  separatorBefore?: boolean
}

export type { ColumnDef }

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading,
  error,
  onRetry,
  searchColumn,
  searchPlaceholder = "Buscar…",
  toolbarStart,
  toolbarEnd,
  rowActions,
  exportable = false,
  exportFileName = "export",
  exportAll,
  persistKey,
  onRowClick,
  emptyTitle = "Sin resultados",
  emptyDescription,
  emptyAction,
  pageSize = 10,
}: {
  columns: ColumnDef<T>[]
  data: T[]
  getRowId?: (row: T) => string
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  // id de la columna sobre la que filtra el buscador; omítelo para ocultarlo.
  searchColumn?: string
  searchPlaceholder?: string
  // fila 1 del toolbar (filtros/tabs).
  toolbarStart?: ReactNode
  // acciones extra a la derecha, junto a Exportar/Columnas.
  toolbarEnd?: ReactNode
  // acciones por fila: si se provee, se agrega la columna ⋯ y el clic derecho.
  rowActions?: (row: T) => RowAction<T>[]
  exportable?: boolean
  exportFileName?: string
  // si se provee, "Exportar" abre ExportDialog (trae TODOS los items, no solo
  // la página/filtro visible) en vez de exportar directo las filas filtradas.
  exportAll?: () => Promise<T[]>
  // si se provee, la visibilidad de columnas persiste en localStorage bajo
  // `${persistKey}:columns`.
  persistKey?: string
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  pageSize?: number
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  // ponytail: ambos hooks se llaman siempre (regla de hooks); sin persistKey
  // se usa el useState local y el de localStorage queda sin leerse/usarse.
  const [localColumnVisibility, setLocalColumnVisibility] =
    React.useState<VisibilityState>({})
  const [storedColumnVisibility, setStoredColumnVisibility] =
    useLocalStorageState<VisibilityState>(
      persistKey ? `${persistKey}:columns` : "__data-table:unused-columns",
      {}
    )
  const [columnVisibility, setColumnVisibility] = persistKey
    ? [storedColumnVisibility, setStoredColumnVisibility]
    : [localColumnVisibility, setLocalColumnVisibility]
  const [rowSelection, setRowSelection] = React.useState({})
  // ponytail: exportAll() se resuelve ANTES de abrir el Dialog (loading vive
  // en el botón, no dentro del diálogo) — abrir un Dialog de Radix con foco
  // real y mutar su estado interno mientras está abierto cuelga la pestaña
  // en Chromium (bug reproducido con click real, ver export-dialog.tsx).
  const [exportItems, setExportItems] = React.useState<T[] | null>(null)
  const [exportLoading, setExportLoading] = React.useState(false)

  function openExport() {
    if (!exportAll) return
    setExportLoading(true)
    exportAll()
      .then(setExportItems)
      .finally(() => setExportLoading(false))
  }

  // Columna de acciones (⋯) autogenerada cuando hay rowActions.
  const allColumns = React.useMemo<ColumnDef<T>[]>(() => {
    if (!rowActions) return columns
    const actionsCol: ColumnDef<T> = {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
                aria-label="Acciones"
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {rowActions(row.original).map((a, i) => (
                <React.Fragment key={a.label}>
                  {a.separatorBefore && i > 0 ? (
                    <DropdownMenuSeparator />
                  ) : null}
                  <DropdownMenuItem
                    variant={a.destructive ? "destructive" : "default"}
                    onClick={() => a.onSelect(row.original)}
                  >
                    {a.icon ? <a.icon className="size-4" /> : null}
                    {a.label}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }
    return [...columns, actionsCol]
  }, [columns, rowActions])

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const searchCol = searchColumn ? table.getColumn(searchColumn) : undefined

  // Exporta a CSV las filas filtradas usando solo columnas con accessor.
  // ponytail: cabeceras = id de columna; añadir meta.exportHeader si hace falta.
  function exportCsv() {
    const cols = table
      .getVisibleLeafColumns()
      .filter((c) => typeof c.accessorFn === "function")
    const header = cols.map((c) => c.id)
    const body = table
      .getFilteredRowModel()
      .rows.map((r) => cols.map((c) => r.getValue(c.id)))
    const csv = [header, ...body]
      .map((cells) => cells.map(csvCell).join(","))
      .join("\n")
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    )
    const a = document.createElement("a")
    a.href = url
    a.download = `${exportFileName}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolbar = (
    <div className="flex flex-col gap-3">
      {toolbarStart}
      <div className="flex flex-wrap items-center gap-2">
        {searchCol ? (
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={(searchCol.getFilterValue() as string) ?? ""}
              onChange={(e) => searchCol.setFilterValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-56 pl-8"
            />
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {toolbarEnd}
          {exportable || exportAll ? (
            <Button
              variant="outline"
              size="sm"
              disabled={exportLoading}
              onClick={() => (exportAll ? openExport() : exportCsv())}
            >
              {exportLoading ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconDownload className="size-4" />
              )}
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="size-4" />
                <span className="hidden sm:inline">Columnas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    className="capitalize"
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  >
                    {c.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  if (loading)
    return <TableSkeleton columns={allColumns.length} rows={pageSize} />
  if (error) return <ErrorState message={error} onRetry={onRetry} />

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      {toolbar}

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} colSpan={h.colSpan}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-muted">
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const tableRow = (
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onDoubleClick={
                      onRowClick ? () => onRowClick(row.original) : undefined
                    }
                    className={onRowClick ? "cursor-pointer" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )

                if (!rowActions)
                  return (
                    <React.Fragment key={row.id}>{tableRow}</React.Fragment>
                  )

                return (
                  <ContextMenu key={row.id}>
                    <ContextMenuTrigger asChild>{tableRow}</ContextMenuTrigger>
                    <ContextMenuContent className="w-36">
                      {rowActions(row.original).map((a, i) => (
                        <React.Fragment key={a.label}>
                          {a.separatorBefore && i > 0 ? (
                            <ContextMenuSeparator />
                          ) : null}
                          <ContextMenuItem
                            variant={a.destructive ? "destructive" : "default"}
                            onSelect={() => a.onSelect(row.original)}
                          >
                            {a.icon ? <a.icon className="size-4" /> : null}
                            {a.label}
                          </ContextMenuItem>
                        </React.Fragment>
                      ))}
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        total={table.getFilteredRowModel().rows.length}
        selectedCount={table.getFilteredSelectedRowModel().rows.length}
        onPageChange={table.setPageIndex}
        onPageSizeChange={table.setPageSize}
      />

      {exportAll ? (
        <ExportDialog
          open={exportItems !== null}
          onOpenChange={(v) => {
            if (!v) setExportItems(null)
          }}
          columns={allColumns}
          items={exportItems ?? []}
          exportFileName={exportFileName}
        />
      ) : null}
    </div>
  )
}
