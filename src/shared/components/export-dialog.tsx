"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { IconDownload } from "@tabler/icons-react"

import { Button } from "@/shadcn/button"
import { Checkbox } from "@/shadcn/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/dialog"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/table"
import { csvCell } from "@/shared/lib/csv"

// Diálogo de exportación "todos los items" (no solo la vista/página actual):
// recibe los datos YA cargados por DataTable (que resuelve `exportAll` antes
// de abrir el diálogo — abrir un Dialog real-focused y luego mutar su estado
// internamente cuelga la pestaña en Chromium/Radix, ver data-table.tsx),
// permite filtrarlos con un texto simple y exporta a CSV los que queden.
export function ExportDialog<T>({
  open,
  onOpenChange,
  columns,
  items,
  exportFileName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: ColumnDef<T>[]
  items: T[]
  exportFileName: string
}) {
  // ponytail: filtro de texto simple sobre todos los campos visibles, no el
  // mini-lenguaje campo=valor de filter-parser.ts (no hace falta acá).
  const [query, setQuery] = React.useState("")
  const [showPreview, setShowPreview] = React.useState(false)

  const table = useReactTable({
    data: items,
    columns,
    state: { globalFilter: query },
    onGlobalFilterChange: setQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getFilteredRowModel().rows
  const previewLimit = 50
  const previewRows = rows.slice(0, previewLimit)

  function handleExport() {
    const cols = table
      .getVisibleLeafColumns()
      .filter((c) => typeof c.accessorFn === "function")
    const header = cols.map((c) => c.id)
    const body = rows.map((r) => cols.map((c) => r.getValue(c.id)))
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar CSV</DialogTitle>
          <DialogDescription>
            Exporta todos los registros (no solo los de la vista actual).
            Filtrá antes de exportar si querés un subconjunto.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar…"
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id="export-preview"
            checked={showPreview}
            onCheckedChange={(v) => setShowPreview(!!v)}
          />
          <Label htmlFor="export-preview" className="text-sm font-normal">
            Mostrar preview
          </Label>
          <span className="ml-auto text-sm text-muted-foreground">
            {rows.length} registro{rows.length === 1 ? "" : "s"}
          </span>
        </div>

        {showPreview ? (
          <div className="max-h-72 overflow-auto rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {h.isPlaceholder
                          ? null
                          : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length > previewLimit ? (
              <p className="p-2 text-center text-xs text-muted-foreground">
                y {rows.length - previewLimit} más…
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button onClick={handleExport}>
            <IconDownload className="size-4" />
            Exportar CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
