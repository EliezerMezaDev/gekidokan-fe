"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import type { Guardian } from "@/shared/schemas/guardians"
import { getGuardians } from "@/modules/guardians/api"
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
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import { useLocalStorageState } from "@/shared/hooks/use-local-storage-state"
import { guardianColumns, guardianRowActions } from "./columns"
import { GuardiansFilter } from "./guardians-filter"
import { GuardianCard } from "./guardian-card"
import { applyGuardianFilters, guardiansQuerySchema } from "./filters"

// Orquestador del módulo de representantes. Responsabilidad única: cargar
// datos, exponer los filtros (sincronizados con la URL vía query params) y el
// modo de vista (tabla/grilla), y delegar el render a las piezas dedicadas
// (columns/GuardianCard) sobre el genérico (DataTable). Sin tabs de estado
// (los representantes no tienen estado). El filtrado hoy corre en cliente
// sobre los mocks (ver filters.ts).

export function GuardiansView() {
  const router = useRouter()
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorageState<ViewMode>(
    "view:guardians",
    "table"
  )
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(guardiansQuerySchema)

  function fetchGuardians() {
    getGuardians()
      .then(setGuardians)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchGuardians()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchGuardians()
  }

  const visible = useMemo(
    () => applyGuardianFilters(guardians, filters),
    [guardians, filters]
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

  const actions = guardianRowActions(router)

  return (
    <div>
      <ModuleHeader
        title="Representantes"
        description="Gestiona los representantes de los alumnos."
      >
        <Button asChild>
          <Link href="/d/guardians/add">
            <IconPlus className="size-4" />
            Nuevo representante
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <GuardiansFilter filters={filters} onApply={apply} />
        <div className="flex justify-end">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={guardianColumns}
            data={visible}
            getRowId={(g) => g.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(g) => router.push(`/d/guardians/${g.slug}`)}
            exportable
            exportFileName="representantes"
            exportAll={() => getGuardians()}
            persistKey="guardians"
            emptyTitle="Sin representantes"
            emptyDescription="Ningún representante coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin representantes"
            description="Ningún representante coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((g) => (
                <GuardianCard key={g.id} guardian={g} actions={actions} />
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
