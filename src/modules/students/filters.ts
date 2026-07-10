import type { Student } from "@/shared/schemas/students"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { beltLabel } from "./belt"

// Configuración de filtrado del módulo de alumnos (dedicada). El texto libre
// (name/belt/contact) va por el input avanzado; el estado va por tabs. Todos se
// vuelcan a query params. `applyStudentFilters` es el matcher cliente que hoy
// filtra los mocks; cuando exista el backend, estos mismos campos viajan como
// query params a GET /students y el matcher se retira. ponytail: filtrado en
// cliente hasta que el backend pagine/filtre.

// Campos del input de texto (name = primer campo → término sin `=` filtra nombre).
export const studentsFilterSchema: FilterSchema = {
  name: { type: "text" },
  belt: { type: "text" },
  contact: { type: "text" },
}

// Schema completo para la URL: suma el estado (controlado por tabs, no por chip).
export const studentsQuerySchema: FilterSchema = {
  ...studentsFilterSchema,
  status: { type: "text" },
}

export const studentsFieldSuggestions: FieldSuggestion[] = [
  { field: "name", label: "Nombre", type: "text", example: "mateo" },
  { field: "belt", label: "Cinta", type: "text", example: "azul,negro" },
  { field: "contact", label: "Contacto", type: "text", example: "412" },
]

// ¿Alguno de los términos OR (separados por coma) aparece en el texto? (ci).
function matchesText(haystack: string, term: string): boolean {
  const hay = haystack.toLowerCase()
  return term
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) => hay.includes(t))
}

export function applyStudentFilters(
  students: Student[],
  filters: ParsedFilter
): Student[] {
  return students.filter((s) => {
    if (
      filters.name &&
      !matchesText(`${s.firstName} ${s.lastName}`, filters.name)
    )
      return false
    if (
      filters.belt &&
      !matchesText(`${s.belt} ${beltLabel[s.belt]}`, filters.belt)
    )
      return false
    if (
      filters.contact &&
      !matchesText(
        [s.phone, s.email, s.guardianName].filter(Boolean).join(" "),
        filters.contact
      )
    )
      return false
    if (filters.status && s.status !== filters.status) return false
    return true
  })
}
