"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import type { SyllabusItem } from "@/shared/schemas/content"
import type { ParsedFilter } from "@/shared/lib/filter-parser"
import { getSyllabusItems } from "@/modules/content/api"
import { ModuleHeader } from "@/shared/components/module-header"
import { DataTable } from "@/shared/components/data-table"
import { TablePagination } from "@/shared/components/table-pagination"
import { ViewToggle, type ViewMode } from "@/shared/components/view-toggle"
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/shared/components/states"
import { Button } from "@/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs"
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import { contentColumns, contentRowActions } from "./columns"
import { ContentFilter } from "./content-filter"
import { ContentCard } from "./content-card"
import {
  applyContentFilters,
  contentFilterSchema,
  contentQuerySchema,
} from "./filters"

// Orquestador del módulo de contenido. Responsabilidad única: cargar datos,
// exponer los filtros (URL) y el modo de vista, y delegar el render a las
// piezas dedicadas (columns/ContentCard) sobre el genérico (DataTable). El
// filtrado hoy corre en cliente sobre los mocks (ver filters.ts).

// Deja solo los campos de texto (excluye type, que controla el tab).
function textOnly(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(contentFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function ContentView() {
  const router = useRouter()
  const [items, setItems] = useState<SyllabusItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>("table")
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(contentQuerySchema)

  function fetchItems() {
    getSyllabusItems()
      .then(setItems)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchItems()
  }

  const visible = useMemo(
    () => applyContentFilters(items, filters),
    [items, filters]
  )

  // ponytail: paginación de la grilla corre en cliente sobre los mocks, igual
  // que el resto del filtrado (ver filters.ts); mover al backend cuando pagine.
  useEffect(() => {
    setGridPageIndex(0)
  }, [filters, gridPageSize])

  const gridPage = useMemo(
    () =>
      visible.slice(
        gridPageIndex * gridPageSize,
        gridPageIndex * gridPageSize + gridPageSize
      ),
    [visible, gridPageIndex, gridPageSize]
  )

  const actions = contentRowActions(router)
  const tab = filters.type ?? "all"

  // El filtro de texto conserva el estado del tab, y el tab conserva el texto.
  const applyText = (parsed: ParsedFilter) =>
    apply({ ...parsed, ...(filters.type ? { type: filters.type } : {}) })
  const setType = (value: string) =>
    apply(value === "all" ? textOnly(filters) : { ...textOnly(filters), type: value })

  return (
    <div>
      <ModuleHeader
        title="Contenido"
        description="Syllabus programático por cinta (katas, bunkai y programas)."
      >
        <Button asChild>
          <Link href="/d/content/add">
            <IconPlus className="size-4" />
            Nuevo contenido
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <ContentFilter filters={filters} onApply={applyText} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={tab} onValueChange={setType}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="KATA">Kata</TabsTrigger>
              <TabsTrigger value="BUNKAI">Bunkai</TabsTrigger>
              <TabsTrigger value="PROGRAM">Programa</TabsTrigger>
            </TabsList>
          </Tabs>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={contentColumns}
            data={visible}
            getRowId={(c) => c.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(c) => router.push(`/d/content/${c.slug}`)}
            exportable
            exportFileName="contenido"
            emptyTitle="Sin contenido"
            emptyDescription="Ningún contenido coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin contenido"
            description="Ningún contenido coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((c) => (
                <ContentCard key={c.id} item={c} actions={actions} />
              ))}
            </div>
            <TablePagination
              pageIndex={gridPageIndex}
              pageSize={gridPageSize}
              total={visible.length}
              onPageChange={setGridPageIndex}
              onPageSizeChange={setGridPageSize}
            />
          </div>
        )}
      </div>
    </div>
  )
}
