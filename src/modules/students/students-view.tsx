"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import type { Student } from "@/shared/schemas/students"
import type { ParsedFilter } from "@/shared/lib/filter-parser"
import { getStudents } from "@/modules/students/api"
import { ModuleHeader } from "@/shared/components/module-header"
import { DataTable } from "@/shared/components/data-table"
import { TablePagination } from "@/shared/components/table-pagination"
import { ViewToggle, type ViewMode } from "@/shared/components/view-toggle"
import { useLocalStorageState } from "@/shared/hooks/use-local-storage-state"
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/shared/components/states"
import { Button } from "@/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs"
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import { studentColumns, studentRowActions } from "./columns"
import { StudentsFilter } from "./students-filter"
import { StudentCard } from "./student-card"
import {
  applyStudentFilters,
  studentsFilterSchema,
  studentsQuerySchema,
} from "./filters"

// Orquestador del módulo de alumnos. Responsabilidad única: cargar datos,
// exponer los filtros (sincronizados con la URL vía query params) y el modo de
// vista (tabla/grilla), y delegar el render a las piezas dedicadas
// (columns/StudentCard) sobre el genérico (DataTable). El filtrado hoy corre en
// cliente sobre los mocks (ver filters.ts).

// Deja solo los campos de texto (excluye status, que controla el tab).
function textOnly(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(studentsFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function StudentsView() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorageState<ViewMode>("view:students", "table")
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(studentsQuerySchema)

  function fetchStudents() {
    getStudents()
      .then(setStudents)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchStudents()
  }

  const visible = useMemo(
    () => applyStudentFilters(students, filters),
    [students, filters]
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

  const actions = studentRowActions(router)
  const tab = filters.status ?? "all"

  // El filtro de texto conserva el estado del tab, y el tab conserva el texto.
  const applyText = (parsed: ParsedFilter) =>
    apply({ ...parsed, ...(filters.status ? { status: filters.status } : {}) })
  const setStatus = (value: string) =>
    apply(
      value === "all"
        ? textOnly(filters)
        : { ...textOnly(filters), status: value }
    )

  return (
    <div>
      <ModuleHeader
        title="Alumnos"
        description="Gestiona los alumnos del dojo."
      >
        <Button asChild>
          <Link href="/d/students/add">
            <IconPlus className="size-4" />
            Nuevo alumno
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <StudentsFilter filters={filters} onApply={applyText} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={tab} onValueChange={setStatus}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="ACTIVE">Activos</TabsTrigger>
              <TabsTrigger value="INACTIVE">Inactivos</TabsTrigger>
            </TabsList>
          </Tabs>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={studentColumns}
            data={visible}
            getRowId={(s) => s.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(s) => router.push(`/d/students/${s.slug}`)}
            exportable
            exportFileName="alumnos"
            exportAll={() => getStudents()}
            persistKey="students"
            emptyTitle="Sin alumnos"
            emptyDescription="Ningún alumno coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin alumnos"
            description="Ningún alumno coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((s) => (
                <StudentCard key={s.id} student={s} actions={actions} />
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
