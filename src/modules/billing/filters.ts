import type { MonthlyInvoice } from "@/shared/schemas/billing"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"

// Configuración de filtrado del módulo de facturas (dedicada). El texto libre
// (student/period) va por el input avanzado; el estado va por tabs. Todos se
// vuelcan a query params. ponytail: filtrado en cliente sobre los mocks hasta
// que el backend pagine/filtre.

export const invoicesFilterSchema: FilterSchema = {
  student: { type: "text" },
  period: { type: "text" },
}

// Schema completo para la URL: suma el estado (controlado por tabs).
export const invoicesQuerySchema: FilterSchema = {
  ...invoicesFilterSchema,
  status: { type: "text" },
}

export const invoicesFieldSuggestions: FieldSuggestion[] = [
  { field: "student", label: "Alumno", type: "text", example: "mateo" },
  { field: "period", label: "Período", type: "text", example: "2026-06" },
]

function matchesText(haystack: string, term: string): boolean {
  const hay = haystack.toLowerCase()
  return term
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) => hay.includes(t))
}

export function applyInvoiceFilters(
  invoices: MonthlyInvoice[],
  filters: ParsedFilter
): MonthlyInvoice[] {
  return invoices.filter((i) => {
    if (filters.student && !matchesText(i.studentName, filters.student))
      return false
    if (filters.period && !matchesText(i.period, filters.period))
      return false
    if (filters.status && i.status !== filters.status) return false
    return true
  })
}
