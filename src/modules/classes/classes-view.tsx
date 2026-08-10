"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import type { KarateClass } from "@/shared/schemas/classes"
import { classStyleSchema } from "@/shared/schemas/classes"
import { getClasses } from "@/modules/classes/api"
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
import { useLocalStorageState } from "@/shared/hooks/use-local-storage-state"
import { classColumns, classRowActions } from "./columns"
import { ClassesFilter } from "./classes-filter"
import { ClassCard } from "./class-card"
import { applyClassFilters, classesQuerySchema } from "./filters"
import { styleLabel } from "./class-labels"

// Orquestador del módulo de clases. Responsabilidad única: cargar datos,
// exponer los filtros (sincronizados con la URL vía query params) y el modo
// de vista (tabla/grilla), y delegar el render a las piezas dedicadas
// (columns/ClassCard) sobre el genérico (DataTable). El tab de estilo y el
// filtro de texto comparten el mismo query param `style` (ver filters.ts). El
// filtrado hoy corre en cliente sobre los mocks.

export function ClassesView() {
  const router = useRouter()
  const [classes, setClasses] = useState<KarateClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorageState<ViewMode>("view:classes", "table")
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(classesQuerySchema)

  function fetchClasses() {
    getClasses()
      .then(setClasses)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchClasses()
  }

  const visible = useMemo(
    () => applyClassFilters(classes, filters),
    [classes, filters]
  )

  // ponytail: paginación de la grilla corre en cliente sobre los mocks, igual
  // que el resto del filtrado; mover al backend cuando pagine.
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

  const actions = classRowActions(router)
  const tab = filters.style ?? "all"
  const setTab = (value: string) =>
    apply(
      value === "all"
        ? { ...filters, style: undefined }
        : { ...filters, style: value }
    )

  return (
    <div>
      <ModuleHeader title="Clases" description="Gestiona las clases del dojo.">
        <Button asChild>
          <Link href="/d/classes/add">
            <IconPlus className="size-4" />
            Nueva clase
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <ClassesFilter filters={filters} onApply={apply} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              {classStyleSchema.options.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {styleLabel[s]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={classColumns}
            data={visible}
            getRowId={(c) => c.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(c) => router.push(`/d/classes/${c.slug}`)}
            exportable
            exportFileName="clases"
            exportAll={() => getClasses()}
            persistKey="classes"
            emptyTitle="Sin clases"
            emptyDescription="Ninguna clase coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin clases"
            description="Ninguna clase coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((c) => (
                <ClassCard key={c.id} classItem={c} actions={actions} />
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
