import type { Guardian } from "@/shared/schemas/guardians"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"

// Configuración de filtrado del módulo de representantes (dedicada). Sin tabs
// de estado (los representantes no tienen estado). ponytail: filtrado en
// cliente hasta que el backend pagine/filtre.

export const guardiansFilterSchema: FilterSchema = {
  name: { type: "text" },
  contact: { type: "text" },
  relationship: { type: "text" },
}

export const guardiansQuerySchema: FilterSchema = guardiansFilterSchema

export const guardiansFieldSuggestions: FieldSuggestion[] = [
  { field: "name", label: "Nombre", type: "text", example: "carla" },
  { field: "contact", label: "Contacto", type: "text", example: "412" },
  {
    field: "relationship",
    label: "Relación",
    type: "text",
    example: "padre,madre",
  },
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

export function applyGuardianFilters(
  guardians: Guardian[],
  filters: ParsedFilter
): Guardian[] {
  return guardians.filter((g) => {
    if (filters.name && !matchesText(`${g.firstName} ${g.lastName}`, filters.name))
      return false
    if (
      filters.contact &&
      !matchesText(
        [g.phone, g.email, g.nationalId].filter(Boolean).join(" "),
        filters.contact
      )
    )
      return false
    // ponytail: la relación vive en el vínculo del alumno, no en el guardian;
    // este filtro queda de placeholder hasta que se pueda cruzar con students.
    return true
  })
}
