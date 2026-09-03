"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import type { Student } from "@/shared/schemas/students"
import { getStudentBySlug } from "@/modules/students/api"
import { dateFmt } from "@/modules/students/belt"
import { getClasses } from "@/modules/classes/api"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  DataTable,
  SortableHeader,
  type ColumnDef,
} from "@/shared/components/data-table"
import { TableFilters } from "@/shared/components/table-filters"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { getAttendanceByStudent } from "./api"

// Vista de asistencia de un alumno (referencia de patrón: student-detail.tsx +
// students-view.tsx). Resuelve el alumno por slug, trae sus sesiones de
// asistencia y las aplana a filas para el DataTable genérico. Filtrable por
// fecha vía query params (mismo mecanismo que el resto de los módulos).

interface AttendanceRow {
  sessionId: string
  date: string
  className: string
  present: boolean
  notes?: string
}

const filterSchema: FilterSchema = { date: { type: "text" } }
const fieldSuggestions: FieldSuggestion[] = [
  { field: "date", label: "Fecha", type: "text", example: "2026-08-01" },
]

// OR por coma, coincidencia parcial (mismo criterio que matchesText en
// modules/students/filters.ts).
function matchesDate(date: string, term: string): boolean {
  return term
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .some((t) => date.includes(t))
}

function applyFilters(
  rows: AttendanceRow[],
  filters: ParsedFilter
): AttendanceRow[] {
  if (!filters.date) return rows
  return rows.filter((r) => matchesDate(r.date, filters.date!))
}

const columns: ColumnDef<AttendanceRow>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortableHeader column={column}>Fecha</SortableHeader>
    ),
    cell: ({ row }) => dateFmt.format(new Date(row.original.date)),
  },
  {
    accessorKey: "className",
    header: ({ column }) => (
      <SortableHeader column={column}>Clase</SortableHeader>
    ),
  },
  {
    accessorKey: "present",
    header: "Asistencia",
    cell: ({ row }) =>
      row.original.present ? (
        <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
          Presente
        </Badge>
      ) : (
        <Badge variant="secondary">Ausente</Badge>
      ),
  },
  {
    accessorKey: "notes",
    header: "Nota",
    cell: ({ row }) => row.original.notes ?? "—",
  },
]

export function StudentAttendanceView({ slug }: { slug: string }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { filters, apply } = useQueryFilters(filterSchema)
  const [value, setValue] = useState(stringifyFilters(filters))

  function load() {
    setLoading(true)
    setError(null)
    getStudentBySlug(slug)
      .then(async (s) => {
        setStudent(s)
        if (!s) return
        const [sessions, classes] = await Promise.all([
          getAttendanceByStudent(s.id),
          getClasses(),
        ])
        const classNames = new Map(classes.map((c) => [c.id, c.name]))
        setRows(
          sessions.map((session) => {
            const record = session.records.find((r) => r.studentId === s.id)
            return {
              sessionId: session.id,
              date: session.date,
              className: classNames.get(session.classId) ?? session.classId,
              present: record?.present ?? false,
              notes: record?.notes,
            }
          })
        )
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    load()
  }

  const visible = useMemo(() => applyFilters(rows, filters), [rows, filters])

  if (loading && !student) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!student)
    return (
      <EmptyState
        title="Alumno no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/students">Volver a alumnos</Link>
          </Button>
        }
      />
    )

  const apply2 = (parsed: ParsedFilter) => {
    apply(parsed)
    setValue(stringifyFilters(parsed))
  }
  const removeChip = (field: string) => {
    const next = { ...filters }
    delete next[field]
    apply2(next)
  }

  return (
    <div>
      <ModuleHeader
        title={`Asistencia de ${student.firstName} ${student.lastName}`}
        description="Historial de sesiones de clase del alumno."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/students/${student.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver al alumno
          </Link>
        </Button>
      </ModuleHeader>

      <div className="mb-3">
        <TableFilters
          value={value}
          onChange={setValue}
          onApply={() => apply2(parseFilterInput(value, filterSchema))}
          onClear={() => apply2({})}
          placeholder="Filtrar por fecha… (ej. 2026-08)"
          suggestions={fieldSuggestions}
          onInsertField={(field) =>
            setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
          }
          activeFilters={buildFilterChips(filters, fieldSuggestions)}
          onRemoveFilter={removeChip}
        />
      </div>

      <DataTable
        columns={columns}
        data={visible}
        getRowId={(r) => r.sessionId}
        loading={loading}
        error={error}
        onRetry={retry}
        emptyTitle="Sin asistencias"
        emptyDescription="No hay sesiones registradas para este alumno."
      />
    </div>
  )
}
